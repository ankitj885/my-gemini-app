import { GoogleGenAI } from "@google/genai";
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();
const port = 3000;
const ai = new GoogleGenAI({});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(fileUpload());

// Store chats in memory (for demo purposes - in production use a database)
const chatSessions = new Map();

app.post('/analyze', async (req, res) => {
  const text = req.body.text || req.files?.text?.data.toString();
  const systemInstruction = req.body.systemInstruction || "You are a recruiter hiring for Java developer. Your name is Eve.";
  const sessionId = req.body.sessionId || Date.now().toString();
  const file = req.files?.file;

  if (!text) {
    res.status(400).json({ error: 'Text is required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    let chat;
    if (!chatSessions.has(sessionId)) {
      chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [],
        config: {
      systemInstruction: systemInstruction,
    },
      });
      chatSessions.set(sessionId, chat);
    } else {
      chat = chatSessions.get(sessionId);
    }

    // Prepare message parts
    let parts = [{ text }];
    
    if (file) {
      parts.push({
        inlineData: {
          mimeType: file.mimetype,
          data: file.data.toString('base64')
        }
      });
    }

    const response = await chat.sendMessageStream({
      message: parts
      // Remove systemPrompt from here as it's set during chat creation
    });

    for await (const chunk of response) {
      res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
    }
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  }
  
  res.end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});