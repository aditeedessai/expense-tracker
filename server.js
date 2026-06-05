const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to process incoming JSON payloads and host frontend views
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data repository
let transactions = [
    { id: 1, text: 'Salary', amount: 45000 },
    { id: 2, text: 'Groceries', amount: -2500 }
];


// API Endpoints
app.get('/api/transactions', (req, res) => {
    res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
    const { text, amount } = req.body;
    
    if (!text || !amount) {
        return res.status(400).json({ error: 'Please provide both text and an amount.' });
    }

    const newTransaction = {
        id: Date.now(),
        text,
        amount: parseFloat(amount)
    };

    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

app.delete('/api/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    transactions = transactions.filter(t => t.id !== id);
    res.json({ success: true, message: 'Transaction removed successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server running smoothly at http://localhost:${PORT}`);
});
