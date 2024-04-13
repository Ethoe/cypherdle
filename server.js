const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Create a new cache instance (with a TTL of 24 hours)
const cache = new NodeCache({ stdTTL: 24 * 60 * 60 });

// Function to fetch new quotes and update the cache
const fetchAndCacheQuotes = async () => {
    try {
        const response = await axios.get('https://zenquotes.io/api/today');
        const quotes = response.data;

        // Store quotes in cache with the key 'quotes'
        cache.set('quotes', quotes);

        console.log('Quotes cached:', quotes);
    } catch (error) {
        console.error('Error fetching and caching quotes:', error);
    }
};

// Initial fetch and cache quotes when the server starts
fetchAndCacheQuotes();

// Schedule a task to fetch and cache quotes daily at 00:00 UTC
cron.schedule('0 0 * * *', () => {
    fetchAndCacheQuotes();
}, {
    timezone: 'UTC'
});

// Endpoint to retrieve cached quotes
app.get('/api/quotes', (req, res) => {
    try {
        // Retrieve quotes from cache
        const quotes = cache.get('quotes');

        if (!quotes) {
            return res.status(404).json({ error: 'Quotes not found in cache' });
        }

        res.json(quotes);
    } catch (error) {
        console.error('Error retrieving quotes from cache:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
