const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;
const ACESTEP_API = 'http://127.0.0.1:8001';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
let users = [];
let songs = [];
let playlists = [];
let currentUserId = null;

// Helper: Generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper: Get or create user
const getOrCreateUser = (username) => {
  let user = users.find(u => u.username === username);
  if (!user) {
    user = {
      id: generateId(),
      username,
      isAdmin: false,
      bio: '',
      avatar_url: '',
      banner_url: '',
      created_at: new Date().toISOString()
    };
    users.push(user);
  }
  currentUserId = user.id;
  return user;
};

// Auth Routes
app.get('/api/auth/auto', (req, res) => {
  if (currentUserId) {
    const user = users.find(u => u.id === currentUserId);
    if (user) {
      return res.json({ user, token: 'demo-token-' + user.id });
    }
  }
  res.status(404).json({ error: 'No user found' });
});

app.post('/api/auth/setup', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }
  const user = getOrCreateUser(username);
  res.json({ user, token: 'demo-token-' + user.id });
});

app.get('/api/auth/me', (req, res) => {
  if (!currentUserId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = users.find(u => u.id === currentUserId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

app.post('/api/auth/logout', (req, res) => {
  currentUserId = null;
  res.json({ success: true });
});

// Generate Routes
app.get('/api/generate/models', async (req, res) => {
  try {
    const response = await fetch(`${ACESTEP_API}/v1/models`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.get('/api/generate/limits', (req, res) => {
  res.json({
    maxDuration: 600,
    maxBatchSize: 4,
    maxQueueSize: 10
  });
});

app.post('/api/generate', async (req, res) => {
  try {
    const params = req.body;
    
    // Transform params to ACE-Step format
    const acestepParams = {
      prompt: params.prompt || params.lyrics,
      caption: params.caption || params.songDescription,
      style: params.style,
      duration: params.duration || 30,
      instrumental: params.instrumental !== false,
      bpm: params.bpm,
      key_scale: params.keyScale,
      time_signature: params.timeSignature,
      inference_steps: params.inferenceSteps || 50,
      guidance_scale: params.guidanceScale || 7.0,
      seed: params.randomSeed ? -1 : (params.seed || 42),
      batch_size: params.batchSize || 1,
    };

    const response = await fetch(`${ACESTEP_API}/release_task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acestepParams)
    });

    const data = await response.json();
    
    // Transform response
    res.json({
      jobId: data.job_id || generateId(),
      status: 'pending',
      params: req.body,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.get('/api/generate/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const response = await fetch(`${ACESTEP_API}/query_result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_ids: [jobId] })
    });
    const data = await response.json();
    
    const jobData = data.results?.[0];
    if (jobData) {
      res.json({
        jobId,
        status: jobData.status || 'pending',
        progress: jobData.progress || 0,
        result: jobData.result ? {
          audioUrls: jobData.result.audio_urls || []
        } : undefined,
        error: jobData.error
      });
    } else {
      res.json({ jobId, status: 'pending' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// Songs Routes (demo)
app.get('/api/songs', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && currentUserId) {
    const userSongs = songs.filter(s => s.user_id === currentUserId);
    res.json({ songs: userSongs });
  } else {
    res.json({ songs: [] });
  }
});

app.get('/api/songs/public', (req, res) => {
  const publicSongs = songs.filter(s => s.is_public);
  res.json({ songs: publicSongs });
});

app.get('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === req.params.id);
  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }
  res.json({ song });
});

app.post('/api/songs', (req, res) => {
  const song = {
    id: generateId(),
    ...req.body,
    user_id: currentUserId,
    created_at: new Date().toISOString(),
    is_public: false,
    tags: []
  };
  songs.push(song);
  res.json({ song });
});

app.patch('/api/songs/:id', (req, res) => {
  const index = songs.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Song not found' });
  }
  songs[index] = { ...songs[index], ...req.body };
  res.json({ song: songs[index] });
});

app.delete('/api/songs/:id', (req, res) => {
  const index = songs.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Song not found' });
  }
  songs.splice(index, 1);
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', acestep_api: ACESTEP_API });
});

// Start server
app.listen(PORT, () => {
  console.log(`Adapter server running on http://localhost:${PORT}`);
  console.log(`Proxying to ACE-Step API at ${ACESTEP_API}`);
});
