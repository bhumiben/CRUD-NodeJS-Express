import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    name: String,
    type: String,
    posted_by: mongoose.Schema.Types.ObjectId,
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
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'usersecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log('Local Strategy Start:', username, password);
        try {
            const users = await Users.findOne({ username: username });
            console.log('Found User:', users);
            if (!users || !bcrypt.compareSync(password, users.password)) {
                console.log('Invalid Username or Password');
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            console.log('User Authenticated');
            return done(null, users);
        } catch (err) {
            console.log('Error in Local Strategy:', err);
            return done(err);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};


app.get('/addUser', ensureAuthenticated, (req, res) => {
    res.render('addUser');
});

app.post('/api/v1/users', async (req, res) => {
    const { name } = req.body;

    const newUser = new User({ name });

    try {
        const savedUser = await newUser.save();
        console.log('Saved to database:', savedUser);
        res.redirect('/api/v1/users');
    } catch (err) {
        console.error('Error saving to database:', err);
        res.status(500).send('Error saving to database');
    }
});

app.get('/api/v1/users', ensureAuthenticated, async (req, res) => {
    try {
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
        console.log('New User:', newUsers);
        await newUsers.save();
        console.log('User saved successfully.');
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
    console.log('User Authenticated:', req.user);
    const token = jwt.sign({ id: req.user.id }, 'Hello123$', { expiresIn: '1h' });
    console.log('Generated Token:', token);
    res.redirect('/addUser');
});


app.get('/index', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Error during logout');
        }
        res.redirect('/index');
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
