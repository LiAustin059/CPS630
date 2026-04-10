import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { Server } from "socket.io";
import Event from "./models/Event.js";
import { requireAuth, signToken } from "./middleware/auth.js";

// ENV variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://${DB_HOST}:${DB_PORT}/events_app`;

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  createdEvents: user.createdEvents || [],
  joinedEvents: user.joinedEvents || [],
});

const populateEvent = () =>
  Event.find().populate("owner", "username email").populate("attendees", "username email");

const ensureEventOwner = async (eventId, userId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    return { error: { status: 404, message: "Event not found" } };
  }

  if (!event.owner || event.owner.toString() !== userId) {
    return { error: { status: 403, message: "You can only change your own events" } };
  }

  return { event };
};

// Seed events function
const seedEvents = async () => {
  try {
    const eventsPath = path.join(__dirname, "events.json");
    const rawData = fs.readFileSync(eventsPath, "utf-8");
    const events = JSON.parse(rawData);
    
    if (events && events.length > 0) {
      await Event.insertMany(events);
      console.log("[INFO] Events seeded successfully");
    } else {
      console.log("[WARNING] events.json is empty, skipping seeding");
    }
  } catch (err) {
    console.error("[ERROR] Seeding failed:", err.message);
  }
};

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("[INFO] Connected to MongoDB Atlas");
    
    // Seeding
    try {
      const count = await Event.countDocuments();
      if (count === 0) {
        console.log("[INFO] No events found. Going to seed events");
        await seedEvents();
      }
    } catch (err) {
      console.error("[ERROR] Failed to check for existing events:", err.message);
    }
  })
  .catch((err) => {
    console.error("[ERROR] MongoDB connection error:", err.message);
  });

// Monitor connection
mongoose.connection.on("error", (err) => {
  console.error("[ERROR] MongoDB runtime error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[WARNING] MongoDB disconnected. Attempting to reconnect...");
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "An account with that email or username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      createdEvents: [],
      joinedEvents: [],
    });

    const token = signToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("[ERROR] Registration failed:", error);
    res.status(500).json({ error: "Unable to register user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("[ERROR] Login failed:", error);
    res.status(500).json({ error: "Unable to log in" });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("createdEvents")
      .populate("joinedEvents");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("[ERROR] Failed to load profile:", error);
    res.status(500).json({ error: "Unable to load user profile" });
  }
});

// Routes
app.get("/", (req, res) => {
  console.log("[INFO] Home page accessed");
  res.send("[INFO] CPS 630 Project API is running!");
});

// GET all events
app.get("/api/events", async (req, res) => {
  console.log("[INFO] All events accessed");
  try {
    let events = await populateEvent();

    // Keep the public listing populated even after an empty DB reset.
    if (!events.length) {
      await seedEvents();
      events = await populateEvent();
    }

    console.log("[INFO] Events fetched successfully", events);
    res.json(events);
  } catch (err) {
    console.error("[ERROR] Error fetching events:", err);
    res.status(500).json({ error: "Server error while fetching events" });
  }
});

// CREATE event
app.post("/api/events", requireAuth, async (req, res) => {
  console.log("[INFO] New event created");
  try {
    const newEvent = new Event({
      ...req.body,
      owner: req.user.id,
      attendees: [req.user.id],
    });
    const savedEvent = await newEvent.save();

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        createdEvents: savedEvent._id,
        joinedEvents: savedEvent._id,
      },
    });

    console.log("[INFO] Event saved successfully");

    // Emit real-time event to all connected clients
    io.emit('eventCreated', savedEvent);

    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("[ERROR] Error creating event:", err);
    res.status(400).json({ error: err.message });
  }
});

// JOIN event
app.post("/api/events/:id/join", requireAuth, async (req, res) => {
  console.log("[INFO] Event join requested");
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendees = Array.isArray(event.attendees) ? event.attendees : [];
    const alreadyJoined = attendees.some((attendeeId) => attendeeId.toString() === req.user.id);

    if (!alreadyJoined) {
      event.attendees = [...attendees, req.user.id];
      await event.save();

      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { joinedEvents: event._id },
      });
    }

    const populatedEvent = await Event.findById(req.params.id)
      .populate("owner", "username email")
      .populate("attendees", "username email");

    res.json(populatedEvent);
  } catch (err) {
    console.error("[ERROR] Error joining event:", err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// GET single event
app.get("/api/events/:id", async (req, res) => {
  console.log("[INFO] Single event accessed");
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("[ERROR] Error fetching event:", err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE event
app.put("/api/events/:id", requireAuth, async (req, res) => {
  console.log("[INFO] Event updated");
  try {
    const ownershipCheck = await ensureEventOwner(req.params.id, req.user.id);

    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({ error: ownershipCheck.error.message });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("[INFO] Event updated successfully");

    // Emit real-time event to all connected clients
    io.emit('eventUpdated', updatedEvent);

    res.json(updatedEvent);
  } catch (err) {
    console.error("[ERROR] Error updating event:", err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE event
app.delete("/api/events/:id", requireAuth, async (req, res) => {
  console.log("[INFO] Event deleted");
  try {
    const ownershipCheck = await ensureEventOwner(req.params.id, req.user.id);

    if (ownershipCheck.error) {
      return res.status(ownershipCheck.error.status).json({ error: ownershipCheck.error.message });
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    console.log("[INFO] Event deleted successfully");

    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        createdEvents: deletedEvent._id,
        joinedEvents: deletedEvent._id,
      },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("[ERROR] Error deleting event:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    res.status(500).json({ error: "Server error" });
  }
});


