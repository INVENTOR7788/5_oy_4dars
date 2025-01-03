const express = require("express");
const mongoose = require("mongoose");
const { Z_SYNC_FLUSH } = require("zlib");
const router = express.Router();


const BookSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    author: { type: String, required: true }, 
    publicationYear: { type: Number }, 
    pages: { type: Number }, 
    copiesAvailable: { type: Number, default: 1 },
  });
  

  const Book = mongoose.model("Book", BookSchema);

  router.post("/books", async (req, res) => {
    try {
      const { title, author, publicationYear, pages, copiesAvailable } = req.body;
      const newBook = new Book({ title, author, publicationYear, pages, copiesAvailable });
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
  router.get("/books", async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  

  router.get("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
      if (!book) return res.status(404).json({ message: "Kitob topilmadi" });
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
  router.put("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updatedBook) return res.status(404).json({ message: "Kitob topilmadi" });
      res.status(200).json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
  router.delete("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) return res.status(404).json({ message: "Kitob topilmadi" });
      res.status(200).json({ message: "Kitob muvaffaqiyatli o'chirildi" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
 
  