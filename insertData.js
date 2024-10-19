const mongoose = require('mongoose');

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/esport-data';

// Game Schema
const gameSchema = new mongoose.Schema({
  name: String,
  thumbnail: String
});

// Player Schema
const playerSchema = new mongoose.Schema({
  name: String,
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  picture: String,
  details: {
    role: String,
    rank: String,
    statistics: {
      matchesPlayed: Number,
      wins: Number,
      losses: Number
    }
  }
});

const Game = mongoose.model('Game', gameSchema);
const Player = mongoose.model('Player', playerSchema);

// Games data
const gamesData = [
  {
    name: "League of Legends",
    thumbnail: "/lol.jpg"
  },
  {
    name: "Dota 2",
    thumbnail: "/dota.jpg"
  },
  {
    name: "CS:GO",
    thumbnail: "/csgo.jpg"
  },
  {
    name: "Valorant",
    thumbnail: "/valo.jpg"
  }
];

// Players data
const playersData = [
  {
    name: "Faker",
    picture: "https://example.com/pictures/faker.jpg",
    details: {
      role: "Mid Laner",
      rank: "Challenger",
      statistics: {
        matchesPlayed: 1500,
        wins: 1200,
        losses: 300
      }
    }
  },
  {
    name: "Dendi",
    picture: "https://example.com/pictures/dendi.jpg",
    details: {
      role: "Mid Laner",
      rank: "Immortal",
      statistics: {
        matchesPlayed: 2000,
        wins: 1300,
        losses: 700
      }
    }
  },
  {
    name: "s1mple",
    picture: "https://example.com/pictures/s1mple.jpg",
    details: {
      role: "AWPer",
      rank: "Global Elite",
      statistics: {
        matchesPlayed: 1800,
        wins: 1400,
        losses: 400
      }
    }
  },
  {
    name: "TenZ",
    picture: "https://example.com/pictures/tenz.jpg",
    details: {
      role: "Duelist",
      rank: "Radiant",
      statistics: {
        matchesPlayed: 1100,
        wins: 900,
        losses: 200
      }
    }
  }
];

// Function to insert data
const insertData = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    // Insert games
    const games = await Game.insertMany(gamesData);
    console.log('Games inserted:', games);

    // Map game IDs to players
    playersData[0].gameId = games[0]._id; // Faker is from League of Legends
    playersData[1].gameId = games[1]._id; // Dendi is from Dota 2
    playersData[2].gameId = games[2]._id; // s1mple is from CS:GO
    playersData[3].gameId = games[3]._id; // TenZ is from Valorant

    // Insert players
    const players = await Player.insertMany(playersData);
    console.log('Players inserted:', players);

    console.log('Data insertion completed successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the insertion
insertData();
