require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;
const GEMINI_MODEL = 'gemini-2.0-flash';

/*if (process.env.GOOGLE_API_KEY) {
  console.log('GOOGLE_API_KEY loaded successfully.');
} else {
  console.warn('GOOGLE_API_KEY is missing. Please check your .env file.');
}*/

app.use(cors({
  origin: ['https://ai-review-mate-xi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('CodeMentor AI Server running'));

app.post('/review', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code input is required.' });

  if (!process.env.GOOGLE_API_KEY) {
    // fallback mock
    return res.json({ improved_code: code.replace(/console\.log/g,'console.info'), explanation: 'Mock: replaced console.log', category: 'Best Practices' });
  }

  try {
    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are an AI code reviewer. Respond with JSON: { "category":"Best Practices|Bug Fix|Performance Improvement", "explanation":"...", "improved_code":"..." }\nCode:\n${code}`
            }
          ]
        }
      ]
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return res.status(500).json({ error: data.error });
    }

    let text = null;
    try { text = data.candidates[0].content.parts[0].text } catch(e){ text = null; }

    if (!text) {
      return res.json({ improved_code: code, explanation: 'No text returned from Gemini', category: 'Best Practices', raw: data });
    }

    // try parse JSON from model
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch(e2){ parsed = null; }
      }
    }

    if (!parsed) {
      return res.json({ improved_code: code, explanation: text, category: 'General Feedback' });
    }

    // normalize keys
    const improved_code = parsed.improved_code || parsed.improvedCode || parsed.improved || parsed.improvedCode || '';
    const explanation = parsed.explanation || parsed.note || '';
    const category = parsed.category || parsed.tag || 'Best Practices';

    res.json({ improved_code, explanation, category });

  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));