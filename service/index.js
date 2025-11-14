import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import * as DB from './database.js';

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const authCookieName = 'token';

// AUTH MIDDLEWARE
async function verifyAuth(req, res, next) {
  const token = req.cookies?.[authCookieName];
  if (!token) return res.status(401).send({ msg: 'Unauthorized' });

  const user = await DB.getUserByToken(token);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });

  req.username = user.username;
  next();
}

// ROUTES

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).send({ msg: 'Missing username or password' });

  const existing = await DB.getUser(username);
  if (existing) return res.status(409).send({ msg: 'User exists' });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username,
    passwordHash,
    bestScore: 0,
    token: uuidv4(),
  };

  await DB.addUser(user);

  res.cookie(authCookieName, user.token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.send({ username });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};

  const user = await DB.getUser(username);
  if (!user) return res.status(401).send({ msg: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).send({ msg: 'Invalid credentials' });

  user.token = uuidv4();
  await DB.updateUser(user);

  res.cookie(authCookieName, user.token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.send({ username });
});

// Logout
app.post('/api/logout', async (req, res) => {
  const token = req.cookies?.[authCookieName];
  if (token) {
    const user = await DB.getUserByToken(token);
    if (user) {
      delete user.token;
      await DB.updateUser(user);
    }
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  const scores = await DB.getHighScores();
  res.json(scores);
});

// Submit Score
// Submit Score
app.post('/api/score', verifyAuth, async (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number') return res.status(400).send({ msg: 'score must be number' });

  const username = req.username;

  // Get current user
  const user = await DB.getUser(username);
  if (!user) return res.status(404).send({ msg: 'User not found' });

  // Update bestScore if new score is higher
  const bestScore = Math.max(user.bestScore || 0, score);
  user.bestScore = bestScore;
  await DB.updateUser(user);

  // Return top 10 users sorted by bestScore
  const leaderboard = await DB.getHighScores(); // modify getHighScores to return users with bestScore
  res.json(leaderboard);
});

// Status
app.get('/api/status', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, _req, res, _next) => {
  res.status(500).json({ type: err.name, message: err.message });
});

app.listen(port, () => console.log(`Service listening on port ${port}`));
