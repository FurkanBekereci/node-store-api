const Product = require('../models/product');

module.exports.getProducts = async (req,res) => {

    const queryObject = generateQueryObject(req.query,Product);
    const sorterString = getSorterString(req.query);
    const selectorString = getSelectorString(req.query);
    const { limit , skip } = getPage(req.query);
    
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

//#region Filtering
//Todo Burası genelleştirilecek.
const generateQueryObject = (reqQuery,T) => {
    const {filters} = reqQuery;
    let queryObject = {};
    const modelList = Object.keys(T.schema.obj);
    console.log("filter:", filters);
    if(!filters) return {};
    if(filters.lenght == 0) return {};
    
    
    filters.forEach(filter => {
        if(modelList.indexOf(filter['field']) == -1) return;
        const generatedQuery = generateQueryFromFilter(filter);
        if(!generatedQuery) return;

        queryObject = {...queryObject, ...generatedQuery};
    });
    
    
    console.log("queryObject:",queryObject);

    return queryObject;
}

// Object.keys(T.schema.obj).forEach(key => {
    //     if(!!filter[key]){
    //         const value = filterGeneratorAccordingToType(filter[key])
    //         if(!!value)
    //         queryObject = {...queryObject, ...value}
    //     }
    // });


const generateQueryFromFilter = ({type = 'and',field,operator,value }) => {

    console.log("type:",type);
    console.log("field:",field);
    console.log("operator:",operator);
    console.log("value:",value);

    if((Array.isArray(operator) && !Array.isArray(value)) || ((!Array.isArray(operator)) && Array.isArray(value)))
        return undefined;

    if(Array.isArray(operator) && Array.isArray(value)){
        if(operator.length != value.length) return undefined;

        const fieldQueryArray = [];
        for (let i = 0; i < operator.length; i++) {
            const op = operator[i];
            const val = value[i];
            const fieldQueryElement = mapQueryTypeWithOperatorAndValue(op,val) || {};
            fieldQueryArray.push({[field]: {...fieldQueryElement}})
        }
        type = `$${type}`;
        return { [type] : fieldQueryArray }

    }
    else{
        const singlefieldQueryElement = mapQueryTypeWithOperatorAndValue(operator,value);
        return !!singlefieldQueryElement ? { [field] : singlefieldQueryElement } : undefined;
    }
      
}

const mapQueryTypeWithOperatorAndValue = (operator,value) => { 
    switch (operator) {
        case 'equals':
            return value;
        case 'notEquals':
            return {'$ne' : value};
        case 'greaterThan':
            return {'$gt' : value};
        case 'greaterThanOrEquals':
            return {'$gte' : value};
        case 'lessThan':
            return {'$lt' : value};
        case 'lessThanOrEquals':
            return {'$lte' : value};
        case 'in':
            return {'$in' : value};
        case 'notIn':
            return {'$nin' : value};
        case 'between':
            return { '$lt' : value , '$gt' : value};
        case 'betweenOrEquals':
            return {'$lte' : value , '$gte' : value};
        case 'startsWith':
            return {'$regex' : `^${value}.*`};
        case 'endsWith':
            return { '$regex' : `${value}` + "$"};
        case 'contains' : 
            return { '$regex' : value };
        case 'isTrue':
            return value === 'true';
        case 'isFalse':
            return value === 'false';
        case 'isEmpty':
            return { '$exist' : true , '$size' : 0 };
        case 'isNotEmpty':
            return { '$exist' : true , '$not' :  { '$size' : 0}};
        case 'isNull' : 
            return { '$exist' : false};
        case 'isNotNull' : 
            return { '$exist' : true}
        case 'isNullOrEmpty' : 
            return { '$or' : [{'$exist' : false}, {'$exist' : true, '$size' : 0 }]}

        default:
            return undefined;
    }

}

//#endregion

//#region Sorting
const getSorterString = (reqQuery) => {
    const { sort } = reqQuery; 
    return sort?.toString().replace(/,/g,' ')
}
//#endregion

//#region Select field
const getSelectorString = (reqQuery) => {
    const { select } = reqQuery; 
    return select?.toString().replace(/,/g,' ')
}
//#endregion

//#region Set page
const getPage = (reqQuery) => {
    const limit = Number(reqQuery.limit) || 200;
    const page = Number(reqQuery.page) || 1;
    const skip = (page - 1 ) * limit;
    return { skip , limit}
}
//#endregion

//Video kalınan dakika 5:05:00 / 9:59:58