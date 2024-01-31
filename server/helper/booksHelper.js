const database = require('../service/database');


const getAllBook = async () => {
    const books = await database.getAllData();
    return Promise.resolve(books)
}

const getBookById = async (id) => {
    const book = await database.getDataById(id);
    return Promise.resolve(book);
}

const addBook = async (dataObject) => {
    const book = await database.addBook(dataObject);
    return Promise.resolve(book)
}

const updateBook = async (dataObject, id) => {
    const book = await database.updateBook(dataObject, id);
    return Promise.resolve(book)
}

const deleteBook = async (id) => {
    const book = await database.deleteBook(id);
    return Promise.resolve(book)
}

module.exports = {
    getAllBook,
    getBookById,
    addBook,
    updateBook,
    deleteBook
}