import express from 'express';
import { MongoClient } from 'mongodb';
import methodOverride from 'method-override';

const app = express();
const port = 3000;


const uri = "mongodb://127.0.0.1";
let db;

(async function() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log('Connected to MongoDB.');
        db = client.db("bhumi");

    } catch (err) {
        console.error('Error occurred while connecting to MongoDB:', err);
    }
})();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.set('views', 'views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.send(' ');
});


app.get('/addUser', (req, res) => {
    res.render('addUser');
});


app.post('/api/v1/users', async(req, res) => {
    const { name } = req.body;

    const newUser = {
        name,
    };

    
    const collection = db.collection('users');
    collection.insertOne(newUser, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error saving to database');
            return;
        }

        if (result.ops && result.ops.length > 0) {
            console.log('Saved to database:', result.ops[0]);
        } else {
            console.log('Saved to database, but ops array is empty.');
        }
    });

    res.redirect('/api/v1/users');
});



app.get('/api/v1/users', async (req, res) => {
    try {
        const collection = db.collection('users');
        const users = await collection.find({}).toArray();
        res.render("users", { users });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching from database');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
