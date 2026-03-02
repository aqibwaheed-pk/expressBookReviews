const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get all books
public_users.get('/', (req, res) => {
    return res.json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.json(books[isbn]);
    return res.status(404).json({message: "Book not found"});
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const authorBooks = Object.entries(books)
        .filter(([_, book]) => book.author.toLowerCase() === req.params.author.toLowerCase())
        .reduce((acc, [isbn, book]) => ({...acc, [isbn]: book}), {});
    if (Object.keys(authorBooks).length) return res.json(authorBooks);
    return res.status(404).json({message: "No books found for this author"});
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const titleBooks = Object.entries(books)
        .filter(([_, book]) => book.title.toLowerCase() === req.params.title.toLowerCase())
        .reduce((acc, [isbn, book]) => ({...acc, [isbn]: book}), {});
    if (Object.keys(titleBooks).length) return res.json(titleBooks);
    return res.status(404).json({message: "No books found for this title"});
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.json(books[isbn].reviews);
    return res.status(404).json({message: "Book not found"});
});

// Add/update review
public_users.put('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { username, review } = req.body;
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.json({message: "Review added/updated", reviews: books[isbn].reviews});
    }
    return res.status(404).json({message: "Book not found"});
});

// Delete review
public_users.delete('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body;
    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.json({message: "Review deleted"});
    }
    return res.status(404).json({message: "Review not found"});
});

module.exports.general = public_users;