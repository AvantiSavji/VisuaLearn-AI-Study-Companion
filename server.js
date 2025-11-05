import express from "express"; //a popular Node.js tool for building servers easily. Express helps you handle requests and send back responses without writing tons of boilerplate code.
import cors from "cors";  //Cross-Origin Resource Sharing. It’s like giving permission to your frontend (running on one port, e.g. 5500) to talk to your backend (on another port, e.g. 3000).
import fetch from "node-fetch"; //lets your backend make API calls
import dotenv from "dotenv"; //This one loads your .env file

dotenv.config(); //it reads the .env file and loads your keys into process.env.

const app = express(); //Creates an instance of your Express app. Think of it like starting your own mini web server inside Node.
app.use(cors()); //now your frontend can talk to your backend freely.
app.use(express.json()); //elps read incoming data in json format
// Gemini API endpoint
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";     //the action you’re asking the model to perform.

// === API route ===
app.post("/api/gemini", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({ error: "Missing GOOGLE_API_KEY in .env file" });
        }

        const response = await fetch(`${GEMINI_URL}?key=${process.env.GOOGLE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(response.status).json({ error: data.error });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        res.json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
app.listen(3000, () => console.log("🚀 Gemini Server running on http://localhost:3000"));
