// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
console.log("OPENAI KEY loaded?", process.env.OPENAI_API_KEY ? "YES" : "NO (using mock insights)");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ AI route for claim insights (mock version for demo)
app.post("/api/insights", async (req, res) => {
  try {
    const { summary } = req.body;

    // Instead of calling OpenAI, we create a simple "AI-like" response
    const mockInsight = `📊 Insights:
- ${summary}.
- Overall approval rate looks steady.
- Pending claims are slightly higher than average.
- Consider focusing on resolving pending claims to improve efficiency.`;

    res.json({ insight: mockInsight });
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Unable to generate insights" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
