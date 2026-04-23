import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:11434/api/tags");
    const models = response.data.models?.map((m: any) => m.name) ?? [];

    return res.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return res.status(500).json({ error: "Unable to fetch models" });
  }
});

export default router;
