import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB.'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    name: String
});

const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('views', 'views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.send('Welcome to the root route. ');
});


app.get('/addUser', (req, res) => {
    res.render('addUser');
});


app.post('/api/v1/users', async(req, res) => {
    const { name } = req.body;

    const newUser = new User({
        name
    });
    try{
    const savedUser = await newUser.save();
    console.log('Saved to database:', savedUser);

    res.redirect('/api/v1/users');
  } catch (err) {
    console.error('Error saving to database:', err);
    res.status(500).send('Error saving to database');
  }
});

// GET route using Mongoose Model
app.get('/api/v1/users', async (req, res) => {
  try {
    // Fetch all users from the database using the Mongoose model
    const users = await User.find({});
    res.render('users', { users });
  } catch (err) {
    console.error('Error fetching from database:', err);
    res.status(500).send('Error fetching from database');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

