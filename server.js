const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Optional if using .env for DB URI

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/personal_budget', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Budget Schema with validation
const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    value: { type: Number, required: true },
    color: { 
        type: String, 
        required: true, 
        match: /^#[0-9A-Fa-f]{6}$/ // Validate hexadecimal color
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

// Serve static files
app.use('/', express.static('public'));

// GET endpoint - fetch budget data from MongoDB
app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find();
        res.json(budgetData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budget data', error });
    }
});

// POST endpoint - add new budget entry
app.post('/budget', async (req, res) => {
    const { title, value, color } = req.body;
    try {
        const newBudget = new Budget({ title, value, color });
        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(400).json({ message: 'Error adding budget data', error });
    }
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});