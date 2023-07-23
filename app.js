const express = require('express');
const session = require('express-session');
const app = express();
const faker = require('faker');

// Set up Pug as the template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Sample data (replace this with your database or data source)
const clothingItems = [];
for (let i = 0; i < 10; i++) {
    clothingItems.push({
        id: i + 1,
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        image: faker.image.imageUrl(200, 200, 'fashion', true, true),
    });
}

// Express session middleware
app.use(
    session({
        secret: 'your_secret_key_here',
        resave: false,
        saveUninitialized: false,
    })
);

// Route for displaying the list of clothing items
app.get('/', (req, res) => {
    res.render('index', { title: 'Clothing Store', clothingItems, cart: req.session.cart || [] });
});


// Route for displaying the details of a specific clothing item
app.get('/clothing/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const clothingItem = clothingItems.find((item) => item.id === id);
    if (!clothingItem) {
        res.status(404).send('Clothing item not found.');
    } else {
        res.render('clothing_detail', { title: clothingItem.name, clothingItem });
    }
});

// Route for adding items to the shopping cart
app.post('/cart/add/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const clothingItem = clothingItems.find((item) => item.id === id);
    if (!clothingItem) {
        res.status(404).send('Clothing item not found.');
    } else {
        req.session.cart = req.session.cart || [];
        req.session.cart.push(clothingItem);
        res.redirect('/');
    }
});

// Route for removing items from the shopping cart
app.post('/cart/remove/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (!req.session.cart || req.session.cart.length === 0) {
        res.redirect('/cart');
    } else {
        req.session.cart = req.session.cart.filter((item) => item.id !== id);
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
