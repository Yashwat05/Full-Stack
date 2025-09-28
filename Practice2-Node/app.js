
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for playing cards
let cards = [
    { id: 1, suit: "Hearts", value: "Ace" },
    { id: 2, suit: "Spades", value: "King" },
    { id: 3, suit: "Diamonds", value: "Queen" }
];

// Counter for generating unique IDs
let nextId = 4;

// GET /cards - Retrieve all cards
app.get('/cards', (req, res) => {
    res.status(200).json(cards);
});

// GET /cards/:id - Retrieve a specific card by ID
app.get('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const card = cards.find(c => c.id === cardId);
    
    if (!card) {
        return res.status(404).json({ 
            error: 'Card not found',
            message: `No card found with ID ${cardId}` 
        });
    }
    
    res.status(200).json(card);
});

// POST /cards - Create a new card
app.post('/cards', (req, res) => {
    const { suit, value } = req.body;
    
    // Validate required fields
    if (!suit || !value) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            message: 'Both suit and value are required' 
        });
    }
    
    // Validate suit
    const validSuits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    if (!validSuits.includes(suit)) {
        return res.status(400).json({ 
            error: 'Invalid suit',
            message: `Suit must be one of: ${validSuits.join(', ')}` 
        });
    }
    
    // Validate value
    const validValues = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    if (!validValues.includes(value)) {
        return res.status(400).json({ 
            error: 'Invalid value',
            message: `Value must be one of: ${validValues.join(', ')}` 
        });
    }
    
    // Create new card
    const newCard = {
        id: nextId++,
        suit,
        value
    };
    
    cards.push(newCard);
    res.status(201).json(newCard);
});

// PUT /cards/:id - Update a specific card
app.put('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const cardIndex = cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
        return res.status(404).json({ 
            error: 'Card not found',
            message: `No card found with ID ${cardId}` 
        });
    }
    
    const { suit, value } = req.body;
    
    // Validate required fields
    if (!suit || !value) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            message: 'Both suit and value are required' 
        });
    }
    
    // Validate suit and value (same validation as POST)
    const validSuits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const validValues = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    
    if (!validSuits.includes(suit)) {
        return res.status(400).json({ 
            error: 'Invalid suit',
            message: `Suit must be one of: ${validSuits.join(', ')}` 
        });
    }
    
    if (!validValues.includes(value)) {
        return res.status(400).json({ 
            error: 'Invalid value',
            message: `Value must be one of: ${validValues.join(', ')}` 
        });
    }
    
    // Update the card
    cards[cardIndex] = { id: cardId, suit, value };
    res.status(200).json(cards[cardIndex]);
});

// DELETE /cards/:id - Delete a specific card
app.delete('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const cardIndex = cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
        return res.status(404).json({ 
            error: 'Card not found',
            message: `No card found with ID ${cardId}` 
        });
    }
    
    const deletedCard = cards[cardIndex];
    cards.splice(cardIndex, 1);
    
    res.status(200).json({
        message: `Card with ID ${cardId} removed`,
        card: deletedCard
    });
});

// GET /cards/suit/:suit - Get all cards of a specific suit
app.get('/cards/suit/:suit', (req, res) => {
    const suit = req.params.suit;
    const suitCards = cards.filter(c => c.suit.toLowerCase() === suit.toLowerCase());
    
    if (suitCards.length === 0) {
        return res.status(404).json({ 
            message: `No cards found for suit: ${suit}` 
        });
    }
    
    res.status(200).json(suitCards);
});

// GET /cards/value/:value - Get all cards of a specific value
app.get('/cards/value/:value', (req, res) => {
    const value = req.params.value;
    const valueCards = cards.filter(c => c.value.toLowerCase() === value.toLowerCase());
    
    if (valueCards.length === 0) {
        return res.status(404).json({ 
            message: `No cards found for value: ${value}` 
        });
    }
    
    res.status(200).json(valueCards);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        message: 'Something went wrong!' 
    });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}` 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🃏 Playing Card API server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET    /cards           - Get all cards`);
    console.log(`   GET    /cards/:id       - Get card by ID`);
    console.log(`   POST   /cards           - Create new card`);
    console.log(`   PUT    /cards/:id       - Update card by ID`);
    console.log(`   DELETE /cards/:id       - Delete card by ID`);
    console.log(`   GET    /cards/suit/:suit - Get cards by suit`);
    console.log(`   GET    /cards/value/:value - Get cards by value`);
});

module.exports = app;
