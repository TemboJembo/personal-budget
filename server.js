// Budget API

const express = require('express');
const cors = require('cors');
const app = express();

const fs = require('fs');
const path = require('path');

const port = 3000;

app.use(cors());

app.use('/', express.static('public'));

app.get('/budget', (req, res) => {
    const filePath = path.join(__dirname, 'new-file.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        try {
            const budget = JSON.parse(data);
            res.json(budget);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});