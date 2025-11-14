import { MongoClient } from 'mongodb';
import { createRequire } from 'module';  // ← add this
const require = createRequire(import.meta.url);  // ← add this
const config = require('./dbConfig.json');  // ← add this

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

const db = client.db('startup');
const users = db.collection('users');
const scores = db.collection('scores');

// Test connection
(async function testConnection() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
})();

// USER FUNCTIONS
export function getUser(username) {
  return users.findOne({ username });
}

export function addUser(user) {
  return users.insertOne(user);
}

export function updateUser(user) {
  return users.updateOne({ username: user.username }, { $set: user });
}

// SCORE FUNCTIONS
export function addScore(scoreDoc) {
  return scores.insertOne(scoreDoc);
}

export function getHighScores() {
  return scores
    .find({})
    .sort({ score: -1 })
    .limit(10)
    .toArray();
}
