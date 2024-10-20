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

// Define the PendingPlayer schema
const pendingPlayerSchema = new mongoose.Schema({
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
const PendingPlayer = mongoose.model('PendingPlayer', pendingPlayerSchema);

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

// API route to insert a new player
app.post('/api/player', async (req, res) => {
  const { name, gameId, picture, details } = req.body;

  try {
    const newPlayer = new Player({
      name,
      gameId,
      picture,
      details
    });

    await newPlayer.save();
    res.status(201).json({ message: 'Player inserted successfully', player: newPlayer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API route to add a pending player
app.post('/api/pending-player', async (req, res) => {
  const { name, gameId, picture, details } = req.body;

  try {
    const newPendingPlayer = new PendingPlayer({
      name,
      gameId,
      picture,
      details
    });

    await newPendingPlayer.save();
    res.status(201).json({ message: 'Pending player added successfully', player: newPendingPlayer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API route to get all pending players
app.get('/api/pending-players', async (req, res) => {
  try {
    const pendingPlayers = await PendingPlayer.find();
    res.json(pendingPlayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API route to approve a pending player
app.post('/api/approve-player/:pendingPlayerId', async (req, res) => {
  try {
    const pendingPlayer = await PendingPlayer.findById(req.params.pendingPlayerId);

    if (!pendingPlayer) {
      return res.status(404).json({ message: 'Pending player not found' });
    }

    const newPlayer = new Player({
      name: pendingPlayer.name,
      gameId: pendingPlayer.gameId,
      picture: pendingPlayer.picture,
      details: pendingPlayer.details
    });

    await newPlayer.save();
    await PendingPlayer.findByIdAndDelete(req.params.pendingPlayerId);

    res.status(201).json({ message: 'Player approved and added to the database', player: newPlayer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
