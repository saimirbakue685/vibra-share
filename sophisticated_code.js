/* sophisticated_code.js */

// This code creates a complex online ordering system for a restaurant
// with multiple menus, items, and customizable options

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Set up server
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define schemas and models using Mongoose
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const menuSchema = new mongoose.Schema({
  name: String,
  items: [{
    name: String,
    price: Number,
    options: [{
      name: String,
      choices: [String],
    }],
  }],
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [{
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    options: [String],
    quantity: Number,
  }],
  total: Number,
});

const User = mongoose.model('User', userSchema);
const Menu = mongoose.model('Menu', menuSchema);
const MenuItem = mongoose.model('MenuItem', menuSchema);
const Order = mongoose.model('Order', orderSchema);

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling CORS
app.use(cors());

// Route for user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  user.save()
    .then(() => {
      res.status(200).json({ message: 'User registered successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to register user' });
    });
});

// Route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Failed to authenticate' });
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      if (user.password === password) {
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Incorrect password' });
      }
    }
  });
});

// Route for retrieving menus
app.get('/menus', (req, res) => {
  Menu.find()
    .then((menus) => {
      res.status(200).json({ menus });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve menus' });
    });
});

// Route for placing an order
app.post('/order', (req, res) => {
  const { userId, items } = req.body;

  const order = new Order({ user: userId, items, total: 0 });

  // Calculate total price
  Promise.all(items.map((item) => {
    return Menu.findById(item.menu)
      .then((menu) => {
        const menuItem = menu.items.find((i) => i._id.toString() === item.item);
        if (!menuItem) {
          throw new Error('Invalid menu item ID');
        }

        const totalPrice = item.options.reduce((total, option) => {
          const optionPrice = menuItem.options.reduce((price, opt) => {
            if (opt.name === option) {
              return opt.price;
            }
            return price;
          }, 0);
          return total + optionPrice;
        }, menuItem.price);

        order.total += totalPrice;
      });
  }))
    .then(() => {
      order.save()
        .then(() => {
          res.status(200).json({ message: 'Order placed successfully', orderId: order._id });
        })
        .catch((err) => {
          res.status(500).json({ error: 'Failed to place order' });
        });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});