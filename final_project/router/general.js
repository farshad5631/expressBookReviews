const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are not provided" });
    }
  
    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  
  module.exports = public_users;

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "List of all books"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Books with isbn"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      res.status(200).json({ books: booksByAuthor });
    } else {
      res.status(404).json({ message: "No books found for the specified author." });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
  
    if (booksByTitle.length > 0) {
      res.status(200).json({ books: booksByTitle });
    } else {
      res.status(404).json({ message: "No books found for the specified title." });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists in the books object
    if (books[isbn]) {
        const reviews = books[isbn].reviews; // Get the reviews for the book
        res.status(200).json({reviews: reviews}); // Send reviews as JSON response
    } else {
        res.status(404).json({message: "Book not found"}); // If the book is not found
    }
});

module.exports.general = public_users;
