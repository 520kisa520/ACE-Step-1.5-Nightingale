import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import {
  checkLLMHealth,
  generateCaption,
  generateBatchCaptions,
  chatWithLLM,
} from '../services/llm.js';

const router = Router();

// GET /api/llm/health — Check if LLM service is available
router.get('/health', async (_req, res: Response) => {
  try {
    const status = await checkLLMHealth();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error instanceof Error ? error.message : 'Health check failed',
    });
  }
});

// POST /api/llm/caption — Generate a single caption for a dataset sample
router.post('/caption', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { filename, emotionTags, instrumentTags, bpm, keyScale, timeSignature, scene, existingCaption } = req.body;

    if (!filename && !emotionTags?.length && !scene) {
      res.status(400).json({ error: 'At least one of filename, emotionTags, or scene is required' });
      return;
    }

    const caption = await generateCaption({
      filename,
      emotionTags,
      instrumentTags,
      bpm,
      keyScale,
      timeSignature,
      scene,
      existingCaption,
    });

    res.json({ caption });
  } catch (error) {
    console.error('[LLM] Caption generation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Caption generation failed',
    });
  }
});

// POST /api/llm/caption/batch — Generate captions for multiple samples
router.post('/caption/batch', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { samples } = req.body;

    if (!Array.isArray(samples) || samples.length === 0) {
      res.status(400).json({ error: 'samples array is required and must not be empty' });
      return;
    }

    if (samples.length > 50) {
      res.status(400).json({ error: 'Maximum 50 samples per batch' });
      return;
    }

    const results = await generateBatchCaptions(samples);
    res.json({ results });
  } catch (error) {
    console.error('[LLM] Batch caption error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Batch caption generation failed',
    });
  }
});

// POST /api/llm/chat — General chat with LLM (for AI consultation)
router.post('/chat', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { messages, temperature } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    const reply = await chatWithLLM(messages, temperature);
    res.json({ reply });
  } catch (error) {
    console.error('[LLM] Chat error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Chat failed',
    });
  }
});

export default router;
