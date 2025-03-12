const { log } = require("console");
const productModel = require("../models/product.model");
const UserModel = require("../models/user.model")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
dotenv.config()
const productCreate = async (req, res, next) => {
    try {
        const data = await productModel.create(req.body);
        res.json({
            success: true,
            message: "Product Created Successfully",
            ProductId: data._id
        })
    } catch (err) {
        next(err)
    }
}

const productLists = async (req, res, next) => {
    try {

     

        const pageNo = req.query.pageNo || 1
        const itemPerPage = req.query.pageSize || 10
        const searchKey = req.query.searchKey || "";

        const searchQuery = {
            $or: [
                {
                    title: new RegExp(searchKey, 'gi')
                },
                {
                    description: new RegExp(searchKey, 'gi')
                },
                {
                    tags: {
                        $in: [searchKey]
                    }
                }
            ]

        }


        const totalProduct = await productModel
            .find(searchQuery)
            .countDocuments()

        const itemToSkip = (pageNo - 1) * 10
        const products = await productModel
            .find(
                searchQuery,
                {
                    title: 1,
                    price: 1,
                    description: 1,
                    thumbnail: 1
                })
            .skip(itemToSkip)
            .limit(itemPerPage)
        res.json({
            success: true,
            message: "Lists Api",
            totalProduct: totalProduct,
            results: products
        })
    } catch (err) {
        next(err)
    }
}

const productDetail = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            res.status(400).json({
                success: true,
                massage: "Product not found",
            })
            return
        }
        res.json({
            success: true,
            massage: "Product Detail Api",
            data: product
        })
    } catch (err) {
        next(err)
    }
}
const addReview = async (req, res, next) => {
    // const userDetailsFromDb = await UserModel.findById(req.body.userId)
    // console.log(userDetailsFromDb);
    /**
     * add array in data base
     */
    // const items=[{},{},{}];
    // $push:{
    //     reviews:{
    //         $each:items
    //     }
    // }
    await productModel.findByIdAndUpdate(req.body.productId,
        {
            $push: {
                reviews: {
                    rating: req.body.review.rating,
                    comment: req.body.review.comment,
                    reviewerName: `${req.user.firstName} ${req.user.lastName}`,
                    reviewerEmail: req.user.email
                }
            }
        }
    )
    try {
        res.json({
            success: true,
            message: "Review added Successfully"
        })
    } catch (err) {
        next(err)
    }
}

const productController = {
    productCreate,
    productLists,
    productDetail,
    addReview
}
module.exports = productController