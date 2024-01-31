const Router = require('express').Router();

const bookHelper = require('../helper/booksHelper');


const getAllBook = async (req, res) => {
    try {
        const response = await bookHelper.getAllBook();
        return res.status(200).json({ message: "Success get detail book", status: 200, data: response });
    } catch (err) {
        console.log(err.message, "<<error")
    }
}

const getBookById = async (req, res) => {
    try {
        const {id} = req?.params;
        const response = await bookHelper.getBookById(id);
        return res.status(200).json({ message: "Success get detail book", status: 200, data: response });
    }catch (err) {
        console.log(err.message, "<<error")
    }
}

const postBook = async (req, res) => {
    try {
        const response = await bookHelper.addBook(req?.body);
        return res.status(200).json({ message: "Success add book", status: 200});
    }catch (err) {
        console.log(err.message, "<<error")
    }
}

const updateBook = async (req, res) => {
    try {
        const {id} = req?.params;
        const response = await bookHelper.updateBook(req?.body, id);
        return res.status(200).json({ message: "Success Update book", status: 200});
    }catch (err) {
        console.log(err.message, "<<error")
    }
}

const deleteBook = async (req, res) => {
    try {
        const {id} = req?.params;
        const response = await bookHelper.deleteBook(id);
        return res.status(200).json({ message: "Success Delete book", status: 200});
    }catch (err) {
        console.log(err.message, "<<error delete")
    }
}

Router.get('/',getAllBook );
Router.get('/:id',getBookById );
Router.post('/', postBook);
Router.patch('/:id', updateBook);
Router.delete('/:id', deleteBook)

module.exports = Router;