const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get all books
public_users.get('/', async (req, res) => {
    try {
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const allBooks = await getBooks;
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const getBookByIsbn = new Promise((resolve, reject) => {
            const isbn = req.params.isbn;
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });
        const book = await getBookByIsbn;
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const authorBooks = Object.entries(books)
                .filter(([_, book]) => book.author.toLowerCase() === req.params.author.toLowerCase())
                .reduce((acc, [isbn, book]) => ({...acc, [isbn]: book}), {});
            
            if (Object.keys(authorBooks).length > 0) {
                resolve(authorBooks);
            } else {
                reject("No books found for this author");
            }
        });
        const result = await getBooksByAuthor;
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const titleBooks = Object.entries(books)
                .filter(([_, book]) => book.title.toLowerCase() === req.params.title.toLowerCase())
                .reduce((acc, [isbn, book]) => ({...acc, [isbn]: book}), {});
            
            if (Object.keys(titleBooks).length > 0) {
                resolve(titleBooks);
            } else {
                reject("No books found for this title");
            }
        });
        const result = await getBooksByTitle;
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({message: error});
    }
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