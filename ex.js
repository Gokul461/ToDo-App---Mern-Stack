const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Define the Mongoose Schema and Model
const todoschema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: String,
});

const todomodel = mongoose.model('Todo', todoschema);

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/mera-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

// POST route to create a new to-do
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newtodo = new todomodel({ title, description });
        await newtodo.save(); // Await the save operation
        res.status(201).json(newtodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// GET route to retrieve all to-dos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todomodel.find(); // Fetch todos from MongoDB
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
