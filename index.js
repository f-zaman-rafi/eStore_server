const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const port = process.env.PORT || 5555; // Default port if not specified in environment variables
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Middleware setup
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies


// MongoDB connection URI
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-esohqc9-shard-00-00.okia5sv.mongodb.net:27017,ac-esohqc9-shard-00-01.okia5sv.mongodb.net:27017,ac-esohqc9-shard-00-02.okia5sv.mongodb.net:27017/?ssl=true&replicaSet=atlas-mrsszx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;


// Create a new MongoClient instance
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, // Use Stable API version
        strict: true, // Enable strict mode to avoid deprecated features
        deprecationErrors: true, // Show deprecation warnings as errors
    },
});


// Function to connect to MongoDB
async function connectToDatabase() {
    try {

        await client.connect(); // Connect to MongoDB

        const db = client.db("eStore");
        const productCollection = db.collection("products");
        const phoneCollection = db.collection("phones");
        const smartWatchCollection = db.collection("smartWatches");
        const cameraCollection = db.collection("cameras");
        const headphoneCollection = db.collection("headphones");
        const computerCollection = db.collection("computers");
        const consoleCollection = db.collection("consoles");

        //get products data
        app.get('/products', async (req, res) => {
            const products = await productCollection.find().toArray();
            res.send(products);
        })
        // insert new phone in database
        app.post('/phones', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await phoneCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })
        // insert new smartwatch in database
        app.post('/smartwatches', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await smartWatchCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })
        // insert new camera in database
        app.post('/cameras', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await cameraCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })
        // insert new headphone in database
        app.post('/headphones', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await headphoneCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })
        // insert new computer in database
        app.post('/computers', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await computerCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })
        // insert new console in database
        app.post('/consoles', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await consoleCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })

        //get products from the phones collection based on status

        app.get('/phones', async (req, res) => {
            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await phoneCollection.find(query).toArray();
            res.send(result);
        })

        // get products from the smartwatches collection based on status

        app.get('/smartWatches', async (req, res) => {
            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await smartWatchCollection.find(query).toArray();
            res.send(result);
        })

        // get products from the cameras collection based on status

        app.get('/cameras', async (req, res) => {
            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await cameraCollection.find(query).toArray();
            res.send(result);
        })

        // get products from the headphones collection based on status

        app.get('/headphones', async (req, res) => {
            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await headphoneCollection.find(query).toArray();
            res.send(result);
        })

        // get products from the computers collection based on status

        app.get('/computers', async (req, res) => {
            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await computerCollection.find(query).toArray();
            res.send(result);
        })

        // get products from the consoles collection based on status

        app.get('/consoles', async (req, res) => {
            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await consoleCollection.find(query).toArray();
            res.send(result)
        })


        // Generic route to fetch product by type and id
        app.get('/:type/:id', async (req, res) => {
            const { type, id } = req.params;

            // Dynamically reference the correct collection based on the type parameter
            let collection;
            if (type === 'phone') {
                collection = phoneCollection;
            } else if (type === 'smartwatch') {
                collection = smartWatchCollection;
            } else if (type === 'camera') {
                collection = cameraCollection;
            } else if (type === 'headphone') {
                collection = headphoneCollection;
            } else if (type === 'computer') {
                collection = computerCollection;
            } else if (type === 'console') {
                collection = consoleCollection;
            } else {
                return res.status(400).send({ message: 'Invalid product type' });
            }

            // Query the collection by the product ID
            const query = { _id: new ObjectId(id) };

            try {
                const result = await collection.findOne(query);
                if (result) {
                    res.send(result);
                } else {
                    res.status(404).send({ message: 'Product not found' });
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
                res.status(500).send({ message: 'Failed to fetch data' });
            }
        });


        // const phoneCollection = db.collection("phones");
        // const smartWatchCollection = db.collection("smartWatches");
        // const cameraCollection = db.collection("cameras");
        // const headphoneCollection = db.collection("headphones");
        // const computerCollection = db.collection("computers");
        // const consoleCollection = db.collection("consoles");


        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit process on failure
    }
}

// Initiate the connection to MongoDB
connectToDatabase();

// Root route
app.get('/', (req, res) => {
    res.send('eStore is live');
});

// Start the server
app.listen(port, () => {
    console.log(`eStore is live on port ${port}`);
});
