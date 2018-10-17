// const { mongoose } = require('../../config/db');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const categorySchema = new Schema({
    name: {
        type: String,
        require: true // server side validation
    }
});

const Category = mongoose.model('Category', categorySchema); // creating model name

module.exports = {
    Category
}

// create a new category
// let category = new Category({name: 'gardening'});
// category.save().then((category)=>{
//     console.log(category);
// }).catch((err) => {cd ful
//     console.log(err);
// });

// find all categories
// Category.find().then((categories)=>{
//     console.log(categories);
// }).catch((err)=>{
//     console.log(err);
// });

// find category of an id
// Category.findById('5ba0f3a8ee74571d1a7374e7').then((category) => {
//     console.log(category);
// }).catch((err)=>{
//     console.log(err);
// });

// find all categories by name
// Category.find({name: 'Electronics'}).then((categories) => {
//     console.log(categories);
// }).catch((err)=>{
//     console.log(err);
// });

// find one category by name
// Category.findOne({name: 'washing'}).then((category) => {
//     if(category){
//         console.log(category);
//     } else {
//         console.log('no category found');
//     }
// });

// update a category's name
// 2 step process, first find and then update

// Category.findOneAndUpdate({_id: '5ba22c4897da7c15e4e99c4f'},{ $set: {name: 'furniture'}}, { new: true })
// .then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// });

// Category.find().then((categories)=>{
// console.log('listing categories', categories.length);
// for(let i = 0; i < categories.length; i++){
//     console.log(i+1 + '.', categories[i].name);
// }
// }).catch((err)=>{
//     console.log(err);
// });

// find the first record from the categories collection and change the name to groceries

// Category.findOneAndUpdate({_id: '5ba0f3a8ee74571d1a7374e7'},{ $set: {name: 'groceries'}}, { new: true })
// .then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// });

// delete

// Category.findOneAndDelete({ _id: '5ba22c4897da7c15e4e99c4f'}).then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// });