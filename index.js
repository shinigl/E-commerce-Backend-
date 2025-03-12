const express = require("express")
const app = express();
const dotenv=require("dotenv")
const mongoose = require("mongoose")
const rateLimit = require("express-rate-limit")

const userRoutes = require("./routes/user.route")
const productRoutes = require("./routes/product.route")
const cartRouter = require("./routes/cart.route")
const couponRouter = require("./routes/coupon.route")
const orderRouter = require("./routes/order.route")
const wishlistRouter = require("./routes/wishlist.route")

const authMiddleware = require("./middlewares/authMiddleware")

const cookieParser = require("cookie-parser")
const cors = require("cors")

dotenv.config();
const portNo = process.env.PORT_NO;
const DB_URL = process.env.DB_URL;

const limiter=rateLimit({
    windowMs:1*60*1000, // 1 min  in  millisecond
    limit:100
})

const corsOptions={
    origin:'http://127.0.0.1:5500'
}

//Global Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(limiter)

// Modular routes
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/product",authMiddleware, productRoutes)
app.use("/api/v1/cart",authMiddleware,cartRouter)
app.use("/api/v1/wishlist",authMiddleware,wishlistRouter)
app.use("/coupon",authMiddleware,couponRouter)
app.use("/api/v1/order",authMiddleware,orderRouter)

mongoose
    .connect(DB_URL)
    .then(() => console.log(`DB Connected successfully`))
    .catch(err => console.error("ERROR While Connecting DataBase", err))

app.listen(portNo, () => console.log(`eComm services are up and running at port ${portNo}`))
