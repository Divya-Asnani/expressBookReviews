const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let isbn in books) {
    if (books[isbn].author === author) {
      matchingBooks.push(books[isbn]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push(books[isbn]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books by this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// TASK 10 - AXIOS GET ALL BOOKS
async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// TASK 11 - AXIOS ISBN
async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get('http://localhost:5000/isbn/' + isbn);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// TASK 12 - AXIOS AUTHOR
async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get('http://localhost:5000/author/' + encodeURIComponent(author));
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// TASK 13 - AXIOS TITLE
async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get('http://localhost:5000/title/' + encodeURIComponent(title));
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports.general = public_users;
