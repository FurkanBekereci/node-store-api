require('express-async-errors')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const productRoutes = require('./routes/products');
//middleware
app.use(express.urlencoded({extended : false}));
app.use(express.json());

//routes
//Home
app.get('/' , (req,res) => {
    res.send('<h1>Store Api</h1><a href="/api/v1/products">Go to products</a>')
})
//products
app.use('/api/v1/products', productRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const server = app.listen(PORT , () => {
    console.log(`Server is listening on port ${PORT}`);
})
module.exports = server;


