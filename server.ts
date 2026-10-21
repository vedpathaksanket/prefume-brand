/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are the Master Parfumeur & Olfactory Sommelier for Maison Aura, an haute parfumerie founded in Grasse and Paris.
Your role is to guide clients through personal fragrance discovery, decipher olfactory pyramids (Head/Heart/Base notes), recommend scent layering rituals, and suggest ideal signature perfumes based on mood, season, personality, or occasion.

Maison Aura's Permanent Collection:
1. Obsidian Oud (Woody & Smoky · Extrait 32% · $145–$320)
   - Notes: Smoked Saffron, Calabrian Bergamot, Cambodian Agarwood (Oud), Black Leather, Charred Atlas Cedar, Birch Tar.
   - Character: Nocturnal, majestic, smoky, commanding.

2. Celestial Rose (Solar & Floral · Eau de Parfum 22% · $125–$275)
   - Notes: Lychee Sorbet, Italian Mandarin, Pink Pepper, Grasse Centifolia Rose, Bulgarian Damascena, White Cashmere Wood, Ambrette.
   - Character: Ethereal, luminous, romantic, dewy sunrise.

3. Amber Velvet (Spiced Oriental · Extrait 28% · $135–$295)
   - Notes: Bitter Almond Glaze, Golden Rum, Ceylon Cinnamon, Siam Benzoin, Toasted Tonka, Madagascar Bourbon Vanilla, Amber Resin.
   - Character: Opulent, intoxicating, velvety warmth, addictive sillage.

4. L’Essence d’Or (Signature Solar Floral · Eau de Parfum 20% · $130–$280)
   - Notes: Cap d’Antibes Neroli, Sunlit Petitgrain, Tunisian Orange Blossom, Royal Jasmine Sambac, Mysore Sandalwood, Ambrette.
   - Character: Aristocratic, sun-drenched, regal poetics.

5. Aqua Nocturne (Aqua & Fresh · Eau de Parfum 21% · $120–$260)
   - Notes: Cold Atlantic Sea Salt, Wild Lime Caviar, Marine Cypress, Bioluminescent Blue Accord, Weathered Driftwood, Grey Ambergris.
   - Character: Crisp, bracing, elemental starlight over sea cliffs.

Also available:
- Bespoke 3-Vial Discovery Set (3 × 5ml custom atomizers in handcrafted walnut box with gold monogram for $48; comes with $48 voucher redeemable towards any 100ml flacon).

Communication Style:
- Elegant, articulate, evocative, and warm. Speak like an esteemed perfumer consulting a client in a private salon on Place Vendôme.
- Use rich perfumery vocabulary (sillage, evaporation, accords, maceration, skin chemistry) without being pedantic.
- Suggest specific Aura perfumes, provide layering tips (e.g., misting Celestial Rose over Obsidian Oud for an unforgettable dark floral tension), or recommend testing via the Discovery Kit.
- Keep responses concise (typically 2–3 evocative paragraphs or short bullet points for pairings).`;

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.8-flash' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Convert messages to Gemini contents format
    const contents = messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Selected model: gemini-3.8-flash for general high-quality tasks, or gemini-3.1-flash-lite for ultra-fast tasks
    const targetModel =
      model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.75,
      },
    });

    const reply =
      response.text ||
      'The atelier is momentarily quiet. Allow me a moment to re-evaluate the aromatic accords.';

    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: err.message || 'The Master Parfumeur is currently unavailable.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Flagship server listening on port ${PORT}`);
  });
}

startServer();
