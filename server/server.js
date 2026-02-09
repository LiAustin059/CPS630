import express from "express";

const app = express()

app.get("/", (req, res) => {
    res.send("CPS 630 Project!")
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})



// GET requests


// POST requests


// DELETE requests