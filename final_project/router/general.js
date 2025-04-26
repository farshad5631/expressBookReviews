const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
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

// Get the book list available in the shop using async-await
public_users.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://farshadkalh1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/booksdb");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Get book details based on ISBN using async-await
public_users.get("/isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;

    try {
        // Fetch book details from the database (replace URL if needed)
        const response = await axios.get(`https://farshadkalh1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/booksdb/${isbn}`);

        // Send the book details
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found", error: error.message });
    }
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

// Get book details based on Author using async-await
public_users.get("/author/:author", async (req, res) => {
    const { author } = req.params;

    try {
        // Fetch book details from the database (modify URL as needed)
        const response = await axios.get("https://farshadkalh1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai");

        // Filter books based on the author's name
        const booksByAuthor = Object.values(response.data).filter(book => book.author === author);

        if (booksByAuthor.length > 0) {
            res.status(200).json({ books: booksByAuthor });
        } else {
            res.status(404).json({ message: "No books found for the specified author." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error: error.message });
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

// Get book details based on Title using async-await
public_users.get("/title/:title", async (req, res) => {
    const { title } = req.params;

    try {
        // Fetch book details from the database (modify URL if needed)
        const response = await axios.get("https://farshadkalh1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai");

        // Filter books based on the title
        const booksByTitle = Object.values(response.data).filter(book => book.title === title);

        if (booksByTitle.length > 0) {
            res.status(200).json({ books: booksByTitle });
        } else {
            res.status(404).json({ message: "No books found for the specified title." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error: error.message });
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
