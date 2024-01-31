const _ = require('lodash');
const MySQL = require('promise-mysql2');
const fileName = 'server/service/database.js';


const db = 'book_store';

const ConnectionPool = MySQL.createPool({
    host: process.env.MYSQL_CONFIG_HOST || 'localhost',
    user: process.env.MYSQL_CONFIG_USER || 'root',
    password: process.env.MYSQL_CONFIG_PASSWORD || '',
    database: process.env.MYSQL_CONFIG_DATABASE || 'book_store',
    port: process.env.MYSQL_CONFIG_PORT || '3306',
    connectionLimit: process.env.MYSQL_CONFIG_CONNECTION_LIMIT || '1'
})

const __constructQueryResult = (query) => {
    const result = [];
    if (!_.isEmpty(query[0])) {
      query[0].forEach((item) => {
        const key = Object.keys(item);
  
        const object = {};
        key.forEach((data) => {
          object[data] = item[data];
        });    
        result.push(object);
      });
    }
    
    return result;
};

const getAllData = async () => {
    try {
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
            `SELECT 
                books.books_id AS "books_id",
                books.title AS "title", 
                books.synopsis AS "synopsis",
                books.publisher AS "publisher",
                CONCAT( '[', 
                    GROUP_CONCAT( 
                        CONCAT( '{ "author_id": ', author.author_id, ', "first_name": "', author.author_name,'" }' ) ORDER BY author.author_id
                            SEPARATOR ',' ),
                ']' ) AS "author",
                category.category_name AS "category_name"
                FROM books 
                LEFT JOIN book_author 
                ON books.books_id = book_author.books_id 
                LEFT JOIN author 
                ON book_author.author_id = author.author_id 
                LEFT JOIN category 
                ON books.category_id = category.category_id 
                WHERE books.is_deleted=0
                GROUP BY books.books_id, books.title, books.synopsis, books.publisher, category.category_name`
                );

        await poolConnection.connection.release();
        const result = __constructQueryResult(query);

        return Promise.resolve(result);
    } catch (error){
        console.log([fileName, 'Get All Book', 'ERROR'], {
            message: { info: `${err}` }
          });
        return Promise.resolve([]);
    }
};

const getDataById = async (id) => {
    try{
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
        `SELECT 
        books.books_id AS "books_id",
        books.title AS "title", 
        books.synopsis AS "synopsis",
        books.publisher AS "publisher",
        CONCAT( '[', 
            GROUP_CONCAT( 
                CONCAT( '{ "author_id": ', author.author_id, ', "first_name": "', author.author_name,'" }' ) ORDER BY author.author_id
                    SEPARATOR ',' ),
        ']' ) AS "author",
        category.category_name AS "category_name"
        FROM books 
        LEFT JOIN book_author 
        ON books.books_id = book_author.books_id 
        LEFT JOIN author 
        ON book_author.author_id = author.author_id 
        LEFT JOIN category 
        ON books.category_id = category.category_id 
        WHERE books.is_deleted=0 AND books.books_id=${id}
        GROUP BY books.books_id, books.title, books.synopsis, books.publisher, category.category_name;`
        );

        await poolConnection.connection.release();
        const result = query;

        return Promise.resolve(result[0]);
    }catch (error){
        console.log([fileName, 'Get All Data', 'ERROR'], {
            message: { info: `${error}` }
          });
        return Promise.resolve([]);
    }
}

const addBook = async (dataObject) => {
    const {title, synopsis, publisher, category_id} = dataObject;
    const isDeleted = 0
    try {
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
        `INSERT INTO books (title, synopsis, publisher, category_id, is_deleted)
        VALUES (?,?,?,?,?)`, [title, synopsis, publisher, category_id, isDeleted]
        );

        await poolConnection.connection.release();
        const result = query;

        return Promise.resolve(result);

    }catch(error) {
        console.log([fileName, 'Add book', 'ERROR'], {
            message: { info: `${error}` }
          });
        return Promise.resolve([]);
    }
}

const updateBook = async (dataObject, id) => {
    try {
        const {title, synopsis, publisher, category_id} = dataObject;
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
        `UPDATE books SET title=?, synopsis=?, publisher=?, category_id=? WHERE books_id=${id};`,
        [title, synopsis, publisher, category_id]
        );

        await poolConnection.connection.release();
        const result = query;

        return Promise.resolve(result);

    }catch(error) {
        console.log([fileName, 'Update Book', 'ERROR'], {
            message: { info: `${error}` }
          });
        return Promise.resolve([]);
    }
}

const deleteBook = async (id) => {
    try {
        const poolConnection = await ConnectionPool.getConnection();
        const query = await poolConnection.query(
        `UPDATE books SET is_deleted=1 WHERE books_id=${id};`
        );

        await poolConnection.connection.release();
        const result = query;

        return Promise.resolve(result);

    }catch(error) {
        console.log([fileName, 'Delete book', 'ERROR'], {
            message: { info: `${error}` }
          });
        return Promise.resolve([]);
    }
}

// category
// SELECT books.title, category.category_name FROM books LEFT JOIN category ON books.category_id = category.category_id
//SELECT books.title, author.author_name FROM books INNER JOIN book_author ON books.books_id = book_author.books_id INNER JOIN author ON book_author.author_id = author.author_id WHERE books.books_id=10

module.exports = {
    getAllData,
    getDataById,
    addBook,
    updateBook,
    deleteBook
}