const Product = require('../models/product');

module.exports.getProducts = async (req,res) => {

    const queryObject = generateQueryObject(req.query,Product);
    const sorterString = getSorterString(req.query);
    const selectorString = getSelectorString(req.query);
    const limit = getLimit(req.query);
    const skip = getSkip(req.query);
    //Filtering, sorting and selecting
    const products = await Product.find(queryObject)
            .sort(sorterString)
            .select(selectorString)
            .limit(limit)
            .skip(skip);
            
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


//Todo Burası genelleştirilecek.
const generateQueryObject = (reqQuery,T) => {
    let queryObject = {};
    Object.keys(T.schema.obj).forEach(key => {
        if(!!reqQuery[key]){
            queryObject = {...queryObject, [key]: filterGeneratorAccordingToType(T.schema.obj[key].type, reqQuery[key])}
        }
    });

    return queryObject;
}


const filterGeneratorAccordingToType = (type, value) => {
    switch(type) {
        case String: 
        return { $regex : value, $options : 'i'};
        case Number : 
        return { $lt : Number(value)};
        case Boolean :
        return value === 'true';
        default :
        return value;
    }
}


//Sorting
const getSorterString = (reqQuery) => {
    const { sort } = reqQuery; 
    return sort?.toString().replace(/,/g,' ')
}

const getSelectorString = (reqQuery) => {
    const { select } = reqQuery; 
    return select?.toString().replace(/,/g,' ')
}
const getLimit = (reqQuery) => {
    const { limit } = reqQuery; 
    return !!limit ? Number(limit) : undefined;
}
const getSkip = (reqQuery) => {
    const { skip } = reqQuery; 
    return !!skip ? Number(skip) : undefined;
}

//Video kalınan dakika 5:05:00 / 9:59:58