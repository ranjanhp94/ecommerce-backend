const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');
const _ = require('lodash');
const { CartItem } = require('../models/cart_item');
const { validateID } = require('../middlewares/utilities');

// GET /users

//POST AKA registration link
router.post('/', (req, res) => {
// TODO security - mass assignment
let body = _.pick(req.body, ['username', 'password', 'email']);
let user = new User(body);
user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth',token).send(user.shortInfo());
    }).catch((err) => {
        res.send(err);
    });
});


// LOGOUT USER

router.delete('/logout', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let token = req.locals.token;
    let activeToken = user.tokens.find(function(inDbToken){
        return inDbToken.token == token;
    });

    user.tokens.id(activeToken._id).remove();
    user.save().then((user) => {
        res.send();
    }).catch((err) => {
        res.send(err);
    });
});


//nested routes

// list all the items in the cart 
// GET user/cart_items
router.get('/cart_items', authenticateUser, (req, res) => {
// let user = req.locals.user;
// res.send(user.cartItems);
res.send(req.locals.user.cartItems);
});


// add to the cart 
// POST users/cart_ items
router.post('/cart_items', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let body = _.pick(req.body, ['product', 'quantity']);
    let cartItem = new CartItem(body);
    let inCart = user.cartItems.find(function(item){
        // if you want to compare 2 objects ids we need to use the equals method
        return item.product.equals(cartItem.product);
    });
    
    if(inCart){
        inCart.quantity = inCart.quantity + cartItem.quantity;
    } else {
        user.cartItem.push(cartItem);
    }
    user.save().then((user) => {
        res.send({
            cartItem,
            notice: 'Successfully added the product to the cart'
        })
    }).catch((err) => {
        res.send(err);
    });
});

// update the quantity
// PUT users/cart_items/:cart_item_id

router.put('/cart_items/:id', validateID, authenticateUser, (req, res) => {
    let cartItemId = req.params.id;
    let user = req.locals.user;
    let body = _.pick(req.body, ['quantity']);
    let inCart = user.cartItems.id(cartItemId);
    inCart.quantity = body.quantity;
    user.save().then((user) => {
        res.send({
            cartItem: inCart,
            notice: 'Successfully update the quantity of the product'
        });
    }).catch((err) => {
        res.send(err);
    });
});

// delete the item
// DELETE users/cart_items/:cart_item_id

router.delete('/cart_items/:id', validateID, authenticateUser, (req, res) => {
    let cartItemId = req.params.id; 
    let user = req.locals.user; 
    user.cartItems.id(cartItemId).remove(); 
    user.save().then((user) => {
        res.send({
            notice: 'Successfully removed the product from the cart'
        });
    }).catch((err) => {
        res.send(err); 
    });
});


// testing url
router.get('/orders', authenticateUser, (req, res) => {
    // let user = req.locals.user;
    // Order.find({user: user._id});
    // console.log(req.header('x-auth'));
    // console.log(req.query.token);
    res.send('listing all the orders of the user');
});

module.exports = {
    usersController: router
}