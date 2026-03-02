const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"});
    }
    if (users[username]) {
        return res.status(409).json({message: "User already exists"});
    }
    users[username] = password;
    return res.status(200).json({message: "User successfully registered"});
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let result = {};
    Object.keys(books).forEach(key => {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    });
    return res.status(200).json(result);
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let result = {};
    Object.keys(books).forEach(key => {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    });
    return res.status(200).json(result);
});

// Get reviews of a book
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Add or update a book review
public_users.put('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { review, username } = req.body;
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    books[isbn].reviews[username] = review;
    return res.status(200).json({
        message: "Review added/updated",
        reviews: books[isbn].reviews
    });
});

// Delete a book review
public_users.delete('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body;
    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({message: "Review not found"});
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted"});
});

module.exports.general = public_users;