const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /ai
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length < 5) {
    return res.status(400).json({ error: 'Prompt too short or missing' });
  }

  try {
    const aiResponse = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt,
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const description = aiResponse.data.generations[0]?.text?.trim();
    if (!description) {
      return res.status(500).json({ error: 'No description generated' });
    }

    res.json({ description });
  } catch (err) {
    console.error('AI Generation Error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to generate description',
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
