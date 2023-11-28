import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import 'dotenv/config';

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
    
    const usersSchema = new mongoose.Schema({
        username: String,
        password: String
    });
    
    const User = mongoose.model('User', userSchema);
    const Users = mongoose.model('Users', usersSchema);
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'usersecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const users = await Users.findOne({ username: username });
            if (!users || !bcrypt.compareSync(password, users.password)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, users);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((users, done) => {
    done(null, users.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const users = await Users.findById(id);
        done(null, users);
    } catch (err) {
        done(err);
    }
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

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUsers = new Users({ username, password: hashedPassword });
        console.log('New User:', newUsers); // Add this line
        await newUsers.save();
        console.log('User saved successfully.'); // Add this line
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    console.log('Login successful. Redirecting to');
    res.redirect('/index');
});
app.get('/index', (req, res) => {
    res.render('index');
});


app.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error('Error during logout:', err);
      }
      res.redirect('/index');
  });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
