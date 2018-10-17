const express = require('express');
const router = express.Router();

const { validateID } = require('../middlewares/utilities');
const { authenticateUser, authorizeUser } = require('../middlewares/authentication');
const { Product } = require('../models/product');

// middlewares // utilities


// index
router.get('/', (req,res) => {
    Product.find().then((products) => {
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});

// show
router.get('/:id', validateID, (req,res) => {
    let id = req.params.id;

    Product.findById(id).populate('category', 'name').then((product) => {
        res.send(product)
    }).catch((err) => {
        res.send(err);
    });
});

// create 
router.post('/', authenticateUser, authorizeUser, (req,res) => {
    let body = req.body;
    let product = new Product(body);
    product.save().then((product) => {
        res.send({
            product,
            notice: 'successfully created the product'
        })
    }).catch((err) => {
        res.send(err);
    });
});

// update
router.put('/:id', validateID, authenticateUser, authorizeUser, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate({_id: id}, { $set : body}, { new: true , runValidators: true}).then((product) => {
        if(!product){
            res.send({
                notice: 'product not found'
            });
        }

        res.send({
            product,
            notice: 'Successfully updated the product'
        });
    });
});

// delete
router.delete('/:id', validateID, authenticateUser, authorizeUser, (req, res) => {
    let id = req.params.id;
    Product.findByIdAndRemove(id).then((product) => {
        if(product) {
            res.send(product);
        } else {
            res.send({
                notice: 'Product not found'
            });
        }
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = {
    productsController : router
}