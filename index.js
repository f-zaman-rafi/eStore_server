const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5555;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Middleware setup
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


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
        const cartCollection = db.collection("cart");




        // jwt related api
        app.post('/jwt', async (req, res) => {
            try {
                const userInfo = req.body;
                console.log(userInfo);
                const token = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {
                    expiresIn: '24h'
                });

                // Set the jwt as an HTTP-only cookie

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000,
                    path: '/',
                    sameSite: 'strict',
                });

                // console.log(req.cookies.token);
                console.log('User logged in');
                res.send({ message: 'Token set in cookies' });
            } catch (error) {
                console.error('Error generating JWT:', error);
                res.status(500).send({ message: 'Failed to create token' });
            }
        });


        app.post('/logout', (req, res) => {
            res.clearCookie('token');
            console.log('User logged out.');
            res.send({ message: 'Logout successful' });
        });




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

        // Add or update cart item based on email and product_id
        app.post('/cart', async (req, res) => {
            const { email, product_id, quantity } = req.body;

            const existingCartItem = await cartCollection.findOne({ email, product_id });

            if (existingCartItem) {
                const updatedQuantity = existingCartItem.quantity + quantity;
                const result = await cartCollection.updateOne(
                    { email, product_id },
                    { $set: { quantity: updatedQuantity } }
                );
                return res.send({ message: "Quantity updated successfully", result });
            } else {
                const newItem = { email, product_id, quantity };
                const result = await cartCollection.insertOne(newItem);
                return res.send({ message: "Item added to cart successfully", result });
            }
        });


        // get cart data
        app.get('/cart', async (req, res) => {

            const status = req.query.status;
            const query = status ? { status: status } : {};
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })

        // get single user cart data

        app.get('/cart/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();

            if (result.length === 0) {
                return res.status(404).send({ message: "No products found for this email." });
            }

            res.send(result);
        });

        // // Check if a specific product exists in the user's cart
        // app.get('/cart/item', async (req, res) => {
        //     const { email, product_id } = req.query;
        //     const query = { email: email, product_id: product_id };
        //     const result = await cartCollection.findOne(query);
        //     res.send(result); // Sends null if not found
        // });

        // // Update quantity of a specific cart item by email and product_id
        // app.put('/cart/updated-quantity', async (req, res) => {
        //     const { email, product_id, quantity } = req.body;
        //     const query = { email: email, product_id: product_id };
        //     const update = {
        //         $set: { quantity: quantity }
        //     };
        //     const result = await cartCollection.updateOne(query, update);
        //     res.send(result);
        // });






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
