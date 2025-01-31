const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5555;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware setup
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://cyberrstoreee.web.app",
    "https://cyber-storee.netlify.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
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
    // await client.connect(); // Connect to MongoDB

    const db = client.db("eStore");
    const productCollection = db.collection("products");
    const phoneCollection = db.collection("phones");
    const smartWatchCollection = db.collection("smartWatches");
    const cameraCollection = db.collection("cameras");
    const headphoneCollection = db.collection("headphones");
    const computerCollection = db.collection("computers");
    const consoleCollection = db.collection("consoles");
    const cartCollection = db.collection("cart");
    const userCollection = db.collection("users");
    const orderCollection = db.collection("orders");

    // JWT middleware after database connection but before routes
    function authenticateToken(req, res, next) {
      const token = req.cookies.token;
      if (!token) return res.sendStatus(401);

      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    }

    // jwt related api
    app.post("/jwt", async (req, res) => {
      try {
        const userInfo = req.body;
        // console.log(userInfo);
        const token = jwt.sign(userInfo, ACCESS_TOKEN_SECRET, {
          expiresIn: "24h",
        });

        // Set the jwt as an HTTP-only cookie

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        // console.log(req.cookies.token);
        // console.log("User logged in");
        res.send({ message: "Token set in cookies" });
      } catch (error) {
        console.error("Error generating JWT:", error);
        res.status(500).send({ message: "Failed to create token" });
      }
    });

    app.post("/logout", (req, res) => {
      res.clearCookie("token");
      // console.log("User logged out.");
      res.send({ message: "Logout successful" });
    });

    //get products data
    app.get("/products", async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
    });

    // insert new phone in database
    app.post("/phones", async (req, res) => {
      const product = req.body;
      // console.log(product);
      try {
        const result = await phoneCollection.insertOne(product);
        res.send({ insertedId: result.insertedId });
        // console.log(result);
      } catch (error) {
        console.error("Error adding product", error);
        res.send({ error: "Failed to add product" });
      }
    });

    // insert new smartwatch in database
    app.post("/smartwatches", async (req, res) => {
      const product = req.body;
      // console.log(product);
      try {
        const result = await smartWatchCollection.insertOne(product);
        res.send({ insertedId: result.insertedId });
        // console.log(result);
      } catch (error) {
        console.error("Error adding product", error);
        res.send({ error: "Failed to add product" });
      }
    });

    // insert new camera in database
    app.post("/cameras", async (req, res) => {
      const product = req.body;
      // console.log(product);
      try {
        const result = await cameraCollection.insertOne(product);
        res.send({ insertedId: result.insertedId });
        // console.log(result);
      } catch (error) {
        console.error("Error adding product", error);
        res.send({ error: "Failed to add product" });
      }
    });

    // insert new headphone in database
    app.post("/headphones", async (req, res) => {
      const product = req.body;
      // console.log(product);
      try {
        const result = await headphoneCollection.insertOne(product);
        res.send({ insertedId: result.insertedId });
        // console.log(result);
      } catch (error) {
        console.error("Error adding product", error);
        res.send({ error: "Failed to add product" });
      }
    });

    // insert new computer in database
    app.post("/computers", async (req, res) => {
      const product = req.body;
      // console.log(product);
      try {
        const result = await computerCollection.insertOne(product);
        res.send({ insertedId: result.insertedId });
        // console.log(result);
      } catch (error) {
        console.error("Error adding product", error);
        res.send({ error: "Failed to add product" });
      }
    });

    // insert new console in database
    app.post("/consoles", authenticateToken, async (req, res) => {
      const product = req.body;
      // console.log(product);
      try {
        const result = await consoleCollection.insertOne(product);
        res.send({ insertedId: result.insertedId });
        // console.log(result);
      } catch (error) {
        console.error("Error adding product", error);
        res.send({ error: "Failed to add product" });
      }
    });

    //get products from the phones collection based on status

    app.get("/phones", async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await phoneCollection.find(query).toArray();
      res.send(result);
    });

    // get products from the smartwatches collection based on status

    app.get("/smartWatches", async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await smartWatchCollection.find(query).toArray();
      res.send(result);
    });

    // get products from the cameras collection based on status

    app.get("/cameras", async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await cameraCollection.find(query).toArray();
      res.send(result);
    });

    // get products from the headphones collection based on status

    app.get("/headphones", async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await headphoneCollection.find(query).toArray();
      res.send(result);
    });

    // get products from the computers collection based on status

    app.get("/computers", async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await computerCollection.find(query).toArray();
      res.send(result);
    });

    // get products from the consoles collection based on status

    app.get("/consoles", async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await consoleCollection.find(query).toArray();
      res.send(result);
    });

    // Generic route to fetch product by type and id
    app.get("/:type/:id", async (req, res) => {
      const { type, id } = req.params;

      // Dynamically reference the correct collection based on the type parameter
      let collection;
      if (type === "phone") {
        collection = phoneCollection;
      } else if (type === "smartwatch") {
        collection = smartWatchCollection;
      } else if (type === "camera") {
        collection = cameraCollection;
      } else if (type === "headphone") {
        collection = headphoneCollection;
      } else if (type === "computer") {
        collection = computerCollection;
      } else if (type === "console") {
        collection = consoleCollection;
      } else {
        return res.status(400).send({ message: "Invalid product type" });
      }

      // Query the collection by the product ID
      const query = { _id: new ObjectId(id) };

      try {
        const result = await collection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Product not found" });
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send({ message: "Failed to fetch data" });
      }
    });

    // Add or update cart item based on email and product_id
    app.post("/cart", authenticateToken, async (req, res) => {
      const { email, product_id, quantity, type, variant } = req.body;
      const existingCartItem = await cartCollection.findOne({
        email,
        product_id,
        variant,
      });

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        const result = await cartCollection.updateOne(
          { email, product_id, variant },
          { $set: { quantity: updatedQuantity } }
        );
        return res.send({ message: "Quantity updated successfully", result });
      } else {
        const newItem = { email, product_id, quantity, type, variant };
        const result = await cartCollection.insertOne(newItem);
        return res.send({ message: "Item added to cart successfully", result });
      }
    });

    // update quantities from cart page
    app.put("/cart/update-quantities", authenticateToken, async (req, res) => {
      const { quantities } = req.body;

      try {
        await Promise.all(
          Object.entries(quantities).map(([itemId, quantity]) =>
            cartCollection.updateOne(
              { _id: new ObjectId(itemId), email: req.user.email }, // Convert itemId to ObjectId
              { $set: { quantity } }
            )
          )
        );
        res.status(200).json({ message: "Quantities updated successfully." });
      } catch (error) {
        console.error("Error updating quantities:", error);
        res.status(500).json({ message: "Failed to update quantities." });
      }
    });

    // get cart data
    app.get("/cart", authenticateToken, async (req, res) => {
      const status = req.query.status;
      const query = status ? { status: status } : {};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // get single user cart data

    app.get("/cart/email/:email", authenticateToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();

      if (result.length === 0) {
        return res
          .status(404)
          .send({ message: "No products found for this email." });
      }

      res.send(result);
    });

    // Delete cart item
    app.delete("/cart/:id", authenticateToken, async (req, res) => {
      const { id } = req.params;
      const email = req.user.email;

      try {
        // Remove the cart item with the specific _id for the authenticated user
        const result = await cartCollection.deleteOne({
          _id: new ObjectId(id),
          email: email,
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item deleted successfully" });
      } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Failed to delete cart item" });
      }
    });

    // user info
    app.post("/users", authenticateToken, async (req, res) => {
      const { email, street, city, state, postal, phone, addressTitle } =
        req.body;

      // Find user address by email and title
      const existingAddress = await userCollection.findOne({
        email,
        addressTitle,
      });

      if (existingAddress) {
        // Update existing address
        const updatedData = { street, city, state, postal, phone };

        const result = await userCollection.updateOne(
          { email, addressTitle },
          { $set: updatedData }
        );

        return res.send({
          message: "User data updated successfully",
          result,
        });
      } else {
        // Add new address entry
        const newUser = {
          email,
          street,
          city,
          state,
          postal,
          phone,
          addressTitle,
        };

        const result = await userCollection.insertOne(newUser);
        return res.send({
          message: "User data added successfully",
          result,
        });
      }
    });

    // Get all users
    app.get("/users", authenticateToken, async (req, res) => {
      try {
        const users = await userCollection.find().toArray();

        if (users.length === 0) {
          return res.status(404).send({ message: "No users found" });
        }

        res.send(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res
          .status(500)
          .send({ message: "An error occurred while retrieving users" });
      }
    });

    app.get("/users/email/:email", authenticateToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.find(query).toArray();

      if (result.length === 0) {
        return res
          .status(404)
          .send({ message: "No products found for this email." });
      }

      res.send(result);
    });

    // Delete cart item
    app.delete("/users/:id", authenticateToken, async (req, res) => {
      const { id } = req.params;
      const email = req.user.email;

      try {
        // Remove the cart item with the specific _id for the authenticated user
        const result = await userCollection.deleteOne({
          _id: new ObjectId(id),
          email: email,
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item deleted successfully" });
      } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Failed to delete cart item" });
      }
    });

    // PAYMENT INTENT
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSectet: paymentIntent.client_secret,
      });
    });

    // Move items from cart to order collection
    app.post("/orders", authenticateToken, async (req, res) => {
      try {
        const { email, cartItems } = req.body; // Expecting an array of cart items

        if (!cartItems || cartItems.length === 0) {
          return res.status(400).send({ message: "Cart is empty" });
        }

        // Add order date and status to each item
        const orderItems = cartItems.map((item) => ({
          email,
          product_id: item.product_id,
          quantity: item.quantity,
          type: item.type,
          variant: item.variant,
          orderDate: new Date(),
          status: "Pending", // Default status
        }));

        // Insert into orderCollection
        const result = await orderCollection.insertMany(orderItems);

        // Delete items from cart after moving to orders
        await cartCollection.deleteMany({ email });

        res.send({ message: "Order placed successfully", result });
      } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.get("/orders/email/:email", async (req, res) => {
      try {
        const { email } = req.params;
        console.log("Requested Email:", email); // Check the incoming email parameter

        const orders = await orderCollection.find({ email }).toArray();

        if (!orders.length) {
          return res.status(404).send({ message: "No orders found" });
        }

        res.send(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get all orders
    app.get("/orders", async (req, res) => {
      try {
        const orders = await orderCollection.find().toArray();

        if (!orders.length) {
          return res.status(404).send({ message: "No orders found" });
        }

        res.send(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // conndect to database
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit process on failure
  }
}

// Initiate the connection to MongoDB
connectToDatabase();

// Root route
app.get("/", (req, res) => {
  res.send("eStore is live");
});

// Start the server
app.listen(port, () => {
  console.log(`eStore is live on port ${port}`);
});
