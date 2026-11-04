const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


const { GoogleGenAI } = require("@google/genai");

dotenv.config();

console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Test API
app.get("/", (req, res) => {
    res.send("Chatbot API is working!");
});

// Chat API
app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message
        });

        const usage = response.usageMetadata;

        const inputTokens = usage?.promptTokenCount || 0;
        const outputTokens = usage?.candidatesTokenCount || 0;
        const totalTokens = usage?.totalTokenCount || 0;


        res.json({
    reply: response.text,
    tokenUsage: {
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        totalTokens: totalTokens
    }
});

    } catch (error) {
        console.error("GEMINI ERROR:");
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});