const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const path = require('path'); // Import the path module
// const User = require('./path-to-user-model'); // Replace with the actual path to your User model file

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mongo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
});

const User = mongoose.model('User', userSchema);

const exampleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Add this line
    username: { type: String, required: true }, // Add this line
    image: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
});

const ExampleModel = mongoose.model('Example', exampleSchema);


// User login endpoint
// User login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username, password: password });

        if (user) {
            res.json({ message: 'Login successful', username: user.username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;

        const newUser = new User({
            username: username,
            password: password,
            email: email,
            phone: phone,
        });

        await newUser.save();

        res.json({ success: true, redirect: '/login.html' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// app.post('/add-data', upload.single('image'), async (req, res) => {
//     try {
//         const { name, age } = req.body;
//         const imagePath = req.file ? req.file.path : '';
//         const { latitude, longitude } = req.body;

//         const newData = new ExampleModel({
//             name: name,
//             age: age,
//             image: imagePath,
//             latitude: latitude,
//             longitude: longitude,
//         });

//         await newData.save();

//         res.json({ message: 'Data added successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Update the add-data route in server.js
app.post('/add-data', upload.single('image'), async (req, res) => {
    try {
        const { name, category, username } = req.body;
        const imagePath = req.file ? req.file.path : '';
        const { latitude, longitude } = req.body;

        const newData = new ExampleModel({
            name: name,
            category: category,
            username: username,
            image: imagePath,
            latitude: latitude,
            longitude: longitude,
        });

        await newData.save();

        res.json({ message: 'Data added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/map.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'map.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
