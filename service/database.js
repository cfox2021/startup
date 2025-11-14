const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

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
function getUser(username) {
  return users.findOne({ username });
}

function getUserByToken(token) {
  return users.findOne({ token });
}

async function addUser(user) {
  await users.insertOne(user);
}

async function updateUser(user) {
  await users.updateOne({ username: user.username }, { $set: user });
}

// SCORE FUNCTIONS
async function addScore(scoreDoc) {
  await scores.insertOne(scoreDoc);
}

function getHighScores() {
  return scores
    .find({})
    .sort({ score: -1 })
    .limit(10)
    .toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addScore,
  getHighScores,
};