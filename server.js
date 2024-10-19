const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/esport-data';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the Game schema
const gameSchema = new mongoose.Schema({
  name: String,
  thumbnail: String
});

// Define the Player schema
const playerSchema = new mongoose.Schema({
  name: String,
  gameId: mongoose.Schema.Types.ObjectId,
  picture: String,
  details: {
    role: String,
    rank: String,
    statistics: Object
  }
});

const Game = mongoose.model('Game', gameSchema);
const Player = mongoose.model('Player', playerSchema);

// API route to get all games
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API route to get players for a specific game
app.get('/api/players/:gameId', async (req, res) => {
  try {
    const players = await Player.find({ gameId: req.params.gameId });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API route to get detailed player information
app.get('/api/player/:playerId', async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
