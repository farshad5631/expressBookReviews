const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};


const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user exists and credentials are correct
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const accessToken = jwt.sign({ data: username }, "access", { expiresIn: "1h" });

        // Store token in session
        req.session.authorization = { accessToken };

        return res.status(200).json({ message: "Login successful", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get the ISBN from the URL
    const review = req.query.review; // Get the review from the query parameters

    // Validate user session
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.session.authorization.data; // Retrieve username from the session

    // Validate book existence
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book with the given ISBN not found" });
    }

    // Initialize reviews object if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Modify or add review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: books[isbn].reviews[username] ? "Review modified successfully" : "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Extract the ISBN from the URL

    // Validate user session
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.session.authorization.data; // Retrieve the username from the session

    // Validate book existence
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book with the given ISBN not found" });
    }

    // Check if the user has a review for the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for the user to delete" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
