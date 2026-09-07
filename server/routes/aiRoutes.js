const express = require('express');
const router = express.Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || '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';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.CLIENT_ORIGIN || 'http://localhost:5173',
        'X-Title': 'HealthTrack AI',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: 'You are MEDICO AI, a friendly, knowledgeable, and empathetic health and wellness assistant. Provide actionable, concise, well-formatted health tips and recommendations in markdown. Always advise consulting a doctor for severe symptoms.'
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ success: false, message: errText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
