const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const dataFilePath = './data.json';
let books = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8')) || [];

// Helper function to save books to file
const saveBooks = () => fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2));

// Create a New Book
app.post('/books', (req, res) => {
    const newBook = req.body;
    if (!newBook.book_id || !newBook.title || !newBook.author || !newBook.genre || !newBook.year || !newBook.copies) {
        return res.status(400).json({ error: 'All book attributes are required.' });
    }
    if (books.some(book => book.book_id === newBook.book_id)) {
        return res.status(400).json({ error: 'Book with this ID already exists.' });
    }
    books.push(newBook);
    saveBooks();
    res.status(201).json(newBook);
});

// Retrieve All Books
app.get('/books', (req, res) => res.json(books));

// Retrieve a Specific Book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find(book => book.book_id === req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.json(book);
});

// Update Book Information
app.put('/books/:id', (req, res) => {
    const book = books.find(book => book.book_id === req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    Object.assign(book, req.body);
    saveBooks();
    res.json(book);
});

// Delete a Book
app.delete('/books/:id', (req, res) => {
    const index = books.findIndex(book => book.book_id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Book not found.' });
    books.splice(index, 1);
    saveBooks();
    res.json({ message: 'Book deleted successfully.' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
