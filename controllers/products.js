const Product = require('../models/product');

module.exports.getProducts = async (req,res) => {
    console.log("Keys:",Object.keys(Product.schema.obj));

    let queryObject = {};
    Object.keys(Product.schema.obj).forEach(key => {
        if(!!req.query[key]){
            queryObject = {...queryObject, [key]: req.query[key]}
        }
    });
    console.log("Query obj: ", queryObject);

    const products = await Product.find(queryObject);
    res.status(200).json({nbHits: products.length, products : products})
}
module.exports.insertProduct = async (req,res) => {
    res.send("Eklemeden selamlar");
}
module.exports.getProductById = async (req,res) => {
    res.send("Tek üründen selamlar");
}
module.exports.updateProduct = async (req,res) => {
    res.send("Ürün güncellemeden selamla");
}
module.exports.deleteProduct = async (req,res) => {
    res.send("Ürün silmeden selamlar");
}
module.exports.editProduct = async (req,res) => {
    res.send("Ürün güncellemeden selamlararara");
}
module.exports.getProductStatic = async (req,res) => {
    const products = await Product.find({featured : true});
    res.status(200).json({nbHits: products.length, products : products})
}

//Video kalınan dakika 4:20:51 / 9:59:58