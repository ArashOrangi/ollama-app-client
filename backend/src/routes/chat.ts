import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { authenticate } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();
const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

router.get("/conversations", authenticate, async (req: any, res) => {
  const convs = await prisma.conversation.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(convs);
});

router.post("/send", authenticate, async (req: any, res) => {
  const { conversationId, content, model } = req.body;
  let currentConvId = conversationId;
  if (!model) return res.status(400).json({ error: "Model is required" });
  if (!currentConvId) {
    const newConv = await prisma.conversation.create({
      data: { userId: req.userId, title: content.substring(0, 30) },
    });
    currentConvId = newConv.id;
  }

  await prisma.message.create({
    data: { conversationId: currentConvId, role: "user", content },
  });

  try {
    const response = await axios.post(OLLAMA_URL, {
      model,
      prompt: content,
      stream: false,
    });

    const aiContent = response.data.response;
    const aiMsg = await prisma.message.create({
      data: {
        conversationId: currentConvId,
        role: "assistant",
        content: aiContent,
      },
    });

    res.json({ conversationId: currentConvId, message: aiMsg });
  } catch (err) {
    console.log({ err });

    res.status(500).json({ error: "Ollama Error" });
  }
});

router.get("/history/:id", authenticate, async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { conversationId: parseInt(req.params.id) },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

export default router;
