const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');

// Set up Pug as the template engine
app.set('view engine', 'pug');
app.set('views', './views');

// get products from backend
let clothingItems = [];
fetch('http://localhost:3001/api/products')
    .then((response) => response.json())
    .then((data) => {
        clothingItems = data;
    })
    .catch((error) => console.log(error));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Express session middleware
app.use(
    session({
        secret: 'your_secret_key_here',
        resave: false,
        saveUninitialized: false,
    })
);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Route for displaying the list of clothing items
app.get('/', (req, res) => {
    res.render('index', { title: 'Clothing Store', clothingItems, cart: req.session.cart || [] });
});


// Route for displaying the details of a specific clothing item
app.get('/clothing/:id', (req, res) => {
    const id = req.params.id;
    const clothingItem = clothingItems.find((item) => item._id === id);
    if (!clothingItem) {
        res.status(404).send('Clothing item not found.');
    } else {
        res.render('clothing_detail', { title: clothingItem.name, clothingItem });
    }
});
// Route for adding items to the shopping cart
app.post('/cart/add', (req, res) => {
    const id = req.body.id;
    const quantity = isNaN(parseInt(req.body.quantity)) ? 1 : parseInt(req.body.quantity);

    const clothingItem = clothingItems.find((item) => item._id === id);
    if (!clothingItem) {
        res.status(404).send('Clothing item not found.');
    } else {
        req.session.cart = req.session.cart || [];

        // Check if the item is already in the cart
        const existingItem = req.session.cart.find((item) => item._id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            clothingItem.quantity = quantity;
            req.session.cart.push(clothingItem);
        }

        res.redirect('/');
    }
});

// Route for updating the quantity of items in the cart
app.post('/cart/update/:id', (req, res) => {
    const id = req.params.id;
    const quantity = parseInt(req.body.quantity);
    if (quantity <= 0) {
        // If the quantity is set to zero or a negative value, remove the item from the cart
        req.session.cart = req.session.cart.filter((item) => item._id !== id);
    } else {
        // Otherwise, update the quantity for the item in the cart
        const item = req.session.cart.find((item) => item._id === id);
        if (item) {
            item.quantity = quantity;
        }
    }
    res.redirect('/cart');
});


// Route for removing items from the shopping cart
app.post('/cart/remove/:id', (req, res) => {
    const id = req.params.id;
    if (!req.session.cart || req.session.cart.length === 0) {
        res.redirect('/cart');
    } else {
        req.session.cart = req.session.cart.filter((item) => item._id !== id);
        res.redirect('/cart');
    }
});



// Route for displaying the shopping cart
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Shopping Cart', cart: req.session.cart || [] });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
