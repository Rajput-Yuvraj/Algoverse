const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for deployment
app.use(cors());

// Update MongoDB connection for production
connectDB();

// Middleware
app.use(express.json());

// Root route - serve signup page (MUST come BEFORE static middleware)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Serve static files from the root directory (AFTER the root route)
app.use(express.static(path.join(__dirname)));

// Add security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Other explicit routes
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for algorithm pages
app.get('/bubble_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'bubble_sort.html'));
});

app.get('/selection_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'selection_sort.html'));
});

app.get('/merge_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'merge_sort.html'));
});

app.get('/sliding_window', (req, res) => {
    res.sendFile(path.join(__dirname, 'sliding_window.html'));
});

app.get('/binary_search', (req, res) => {
    res.sendFile(path.join(__dirname, 'binary_search.html'));
});

app.get('/quick_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'quick_sort.html'));
});

const JWT_SECRET = 'your-secret-key'; // Use environment variable in production

// Authentication routes
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        const token = jwt.sign(
            { userId: user._id }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            message: 'Error creating user' 
        });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ token });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ 
            message: 'Error during signin' 
        });
    }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            message: 'Authentication required' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Access granted to protected route' 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});








