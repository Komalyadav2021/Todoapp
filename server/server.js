require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const validateTodo = require('./validateTodo');
const Todo = require('./todo.model');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use values from .env
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected");
});

// Routes (same as before)
todoRoutes.route('/').get((req, res) => {
    Todo.find()
        .then(todos => res.json(todos))
        .catch(err => res.status(400).json('Error: ' + err));
});

// add todo
todoRoutes.route('/add').post(validateTodo, (req, res) => {
    const todo = new Todo({ 
        title: req.body.title,
        due_date: req.body.due_date ? new Date(req.body.due_date) : null,
        created_at: req.body.created_at || new Date(),
        completed: false
    });

    todo.save()
        .then(() => res.json('Todo added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// udpate the todo
todoRoutes.route('/update/:id').post(validateTodo, (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => {
            todo.title = req.body.title;
            if (typeof req.body.completed === 'boolean') {
                todo.completed = req.body.completed;
            }
            if (req.body.due_date) {
                todo.due_date = new Date(req.body.due_date);
            }
            return todo.save();
        })
        .then(() => res.json('Todo updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// delete the todo
todoRoutes.route('/:id').delete((req, res) => {
    const deletedId = req.params.id;

    Todo.findByIdAndDelete(deletedId)
        .then((deletedTodo) => {
            if (!deletedTodo) {
                return res.status(404).json('Todo not found');
            }

            // Log the deleted ID for backup/debugging (not sent to client)
            console.log(`Deleted Todo ID (internal log): ${deletedId}`);

            res.json('Todo deleted!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
});
