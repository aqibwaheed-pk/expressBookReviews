const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// Get the full book list
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = {};
    for (let key in books) {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    }
    return res.status(200).json(result);
});

// Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = {};
    for (let key in books) {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    }
    return res.status(200).json(result);
});

// Get reviews of a book
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;