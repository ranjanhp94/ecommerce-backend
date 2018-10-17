const express = require('express');
// const { ObjectID } = require('mongodb');
const router = express.Router();

const { validateID } = require('../middlewares/utilities');
const { authenticateUser, authorizeUser } = require('../middlewares/authentication');
const { Category } = require('../models/category');  // on db for operations
const { Product } = require('../models/product');

// middlewares
// const validateID = function(req, res, next){
//     let id = req.params.id;
//     if(!ObjectID.isValid(id)){
//         res.send({
//             notice: 'Invalid Object id'
//         });
//     } else {
//         next();
//     }
// }

// index(show all)
router.get('/', (req,res) => {
    Category.find().then((categories) => {
        res.send(categories);
    }).catch((err) => {
        res.send(err);
    });
});

// show
router.get('/:id', validateID, (req, res) => {
    let id = req.params.id; 
    Category.findById(id).then((category) => {
        res.send(category); 
    });
});

// create
router.post('/', authenticateUser, authorizeUser, (req, res) => {
    let body = req.body;
    let category = new Category(body);
    category.save().then((category) => {
        res.send({
            category,
            notice: 'successfully created the category'
        })
    }).catch((err) => {
        res.send(err);
    });
});

// update
router.put('/:id', validateID, authenticateUser, authorizeUser, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Category.findByIdAndUpdate({_id: id}, { $set : body}, { new: true , runValidators: true}).then((category) => {
        if(!category){
            res.send({
                notice: 'category not found'
            });
        }
        res.send({
            category,
            notice: 'Successfully updated the category'
        });
    });
});

// delete
router.delete('/:id', validateID, authenticateUser, authorizeUser, (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id).then((category) => {
        if(category) {
            res.send(category);
        } else {
            res.send({
                notice: 'category not found'
            });
        }
    }).catch((err) => {
        res.send(err);
    });
});

// show all products belonging to category model
router.get('/:id/products', validateID, (req, res) => {
    let id = req.params.id;
    // Product.find({category: id}).then((products) => {
    //     res.send(products);
    // }).catch((err) => {
    //     res.send(err);
    // });
    // creating our own static method
    Product.findByCategory(id).then((products) => {
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});


module.exports = {
    categoriesController: router
}