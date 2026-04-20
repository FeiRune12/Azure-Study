const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, "../public")));

// API KEY SEGURA
const API_KEY = process.env.YOUTUBE_API_KEY;

// ROTA API
app.get("/api/videos", async (req, res) => {
  const query = req.query.q;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${query}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar vídeos" });
  }
});

// PORTA DO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando...");
});