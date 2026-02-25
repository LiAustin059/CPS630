import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
// part of setting up the rest api
app.use(cors());
app.use(express.json());

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proper absolute path to events.json
const EVENTS = path.join(__dirname, "events.json");

// Make sure file exists
if (!fs.existsSync(EVENTS)) {
  fs.writeFileSync(EVENTS, "[]");
}

const getData = () =>
  JSON.parse(fs.readFileSync(EVENTS, "utf-8"));

const saveData = (data) =>
  fs.writeFileSync(EVENTS, JSON.stringify(data, null, 2));

app.get("/", (req, res) => {
  res.send("CPS 630 Project!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

// GET all events
app.get("/api/events", (req, res) => {
  res.json(getData());
});

// CREATE event
app.post("/api/events", (req, res) => {
  const events = getData();
  const newEvent = { id: Date.now(), ...req.body };
  events.push(newEvent);
  saveData(events);
  res.status(201).json(newEvent);
});

// DELETE event
app.delete("/api/events/:id", (req, res) => {
  let events = getData();
  events = events.filter(
    (e) => e.id !== parseInt(req.params.id)
  );
  saveData(events);
  res.sendStatus(200);
});

// Get Single Event
app.get("/api/events/:id", (req, res) => {
    const events = getData();
    const event = events.find(
      (e) => e.id === parseInt(req.params.id)
    );
  
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
  
    res.json(event);
  });

// Update Event
app.put("/api/events/:id", (req, res) => {
    let events = getData();
    const index = events.findIndex(
      (e) => e.id === parseInt(req.params.id)
    );
  
    if (index === -1) {
      return res.status(404).json({ error: "Event not found" });
    }
  
    events[index] = {
      ...events[index],
      ...req.body,
    };
  
    saveData(events);
    res.json(events[index]);
  });

  