const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb+srv://mjpp:mjpp@cluster1.zdgfwuu.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});
// parse incoming request bodies in a middleware before your handlers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create a schema for the user model
const userSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    name: String,
    cutStatus: Boolean
});

const User = mongoose.model('User', userSchema);

// create a route to handle the POST request
app.post('/users', (req, res) => {
    const { code, name, cutStatus } = req.body;

    // create a new user document
    const newUser = new User({
        code,
        name,
        cutStatus
    });

    // save the user to the database
    newUser.save((error) => {
        if (error) {
            // send an error response if there is a problem
            res.status(500).send(error);
        } else {
            // send a success response
            res.send('User saved successfully!');
        }
    });
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
