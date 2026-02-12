import express from "express";
import path from "path";
import fs from "fs";

const EVENTS = "./events.json";
const app = express()
app.use(express.json());

const getData = () => JSON.parse(fs.readFileSync(EVENTS, "utf-8"));
const saveData = (data) => fs.writeFileSync(EVENTS, JSON.stringify(data, null, 2));

app.get("/", (req, res) => {
    res.send("CPS 630 Project!")
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})

app.get("/style.css", (req, res) => {
    res.sendFile(path.resolve("style.css"));
});



// GET requests


// POST requests
app.get("/create-event", (req, res) => {
    res.sendFile(path.resolve("create.html"));
});

app.post("/api/events", (req, res) => {
    const events = getData();
    const newEvent = { id: Date.now(), ...req.body };
    events.push(newEvent);
    saveData(events);
    res.status(201).json(newEvent);
});


// DELETE requests
app.get("/delete-event", (req, res) => {
    res.sendFile(path.resolve("delete.html"));
});

app.delete("/api/events/:id", (req, res) => {
    let events = getData();
    events = events.filter(e => e.id !== parseInt(req.params.id));
    saveData(events);
    res.sendStatus(200);
});