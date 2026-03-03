import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Event from "./models/Event.js";

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("[ERROR] Error fetching events:", err);
    res.status(500).json({ error: "Server error while fetching events" });
  }
});

// CREATE event
app.post("/api/events", async (req, res) => {
  console.log("[INFO] New event created");
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    console.log("[INFO] Event saved successfully");
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("[ERROR] Error creating event:", err);
    res.status(400).json({ error: err.message });
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
app.put("/api/events/:id", async (req, res) => {
  console.log("[INFO] Event updated");
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("[INFO] Event updated successfully");
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
app.delete("/api/events/:id", async (req, res) => {
  console.log("[INFO] Event deleted");
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("[INFO] Event deleted successfully");
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("[ERROR] Error deleting event:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    res.status(500).json({ error: "Server error" });
  }
});


