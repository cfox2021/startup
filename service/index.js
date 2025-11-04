import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); 

const users = {};    
const sessions = {}; 

function verifyAuth(req, res, next) {
  const token = req.cookies?.token;
  const username = token && sessions[token];
  if (username) {
    req.username = username;
    return next();
  }
  res.status(401).send({ msg: 'Unauthorized' });
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).send({ msg: 'Missing username or password' });
  if (users[username]) return res.status(409).send({ msg: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  users[username] = { passwordHash, bestScore: 0 };
  res.status(200).send({ username });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user) return res.status(401).send({ msg: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).send({ msg: 'Invalid credentials' });

  const token = uuidv4();
  sessions[token] = username;
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
  res.status(200).send({ username });
});

app.post('/api/logout', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    delete sessions[token];
    res.clearCookie('token');
  }
  res.status(204).end();
});

app.get('/api/leaderboard', (req, res) => {
  const list = Object.entries(users)
    .map(([username, u]) => ({ username, bestScore: u.bestScore }))
    .sort((a,b) => b.bestScore - a.bestScore)
    .slice(0, 10);
  res.json(list);
});

app.post('/api/score', verifyAuth, (req, res) => {
  const { score } = req.body || {};
  if (typeof score !== 'number') return res.status(400).send({ msg: 'score must be number' });

  const username = req.username;
  const user = users[username];
  if (score > user.bestScore) user.bestScore = score;

  res.json({ username, bestScore: user.bestScore });
});

app.get('/api/quote', async (req, res) => {
  try {
    const r = await fetch('https://api.quotable.io/random');
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ msg: 'Quote service failed' });
  }
});

app.get('/api/status', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  res.status(500).json({ type: err.name, message: err.message });
});

app.listen(port, () => console.log(`Service listening on port ${port}`));
