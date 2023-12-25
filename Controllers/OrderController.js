const User = require('../Models/UserModel');
const Cart = require('../Models/CartModel');
const Order = require('../Models/OrderModel');
const dateConverter = require('../config/dateConverter');
const Products = require('../config/data');
const verifyUser = require('../config/verifyUser');
require('dotenv/config');

module.exports.PLACE_ORDER = async (req, res) => {
    const { userId, userCart, address, landMark, city, postalCode } = req.body;
    let orderId, orderInvoice;
    try {
        await User.findById(userId)
            .exec()
            .then((userResponse) => {
                if (userResponse) {
                    Order.findOne({}, {}, { sort: { '_id': -1 } }).select('orderId orderInvoice')
                        .exec()
                        .then((orderResponse) => {
                            if (orderResponse) {                                
                                const orderInvoice = orderResponse?.orderInvoice?.toString().split('-');
                                const increInvoice = (parseInt(orderInvoice[1]) + 1).toString().padStart(4, '0');
                                orderId = (orderResponse?.orderId + 1);
                                for (let i = 0; i < userCart.length; i++) {
                                    const order = new Order({
                                        orderId: orderId,
                                        userId: userId,
                                        productId: userCart[i].productId,
                                        quantity: userCart[i].quantity,
                                        address: address,
                                        landMark: landMark,
                                        city: city,
                                        postalCode: postalCode,
                                        delivered: false,
                                        deleteOrder: false,
                                        orderInvoice: process.env.INV_PRE + increInvoice + "-" + orderId.toString().substr(-4),
                                    }).save();
                                }
                            } else {
                                orderId = process.env?.START_ORDER;
                                orderInvoice = "0000";
                                const increInvoice = (parseInt(orderInvoice) + 1).toString().padStart(4, '0');
                                for (let i = 0; i < userCart.length; i++) {
                                    const order = new Order({
                                        orderId: orderId,
                                        userId: userId,
                                        productId: userCart[i].productId,
                                        quantity: userCart[i].quantity,
                                        address: address,
                                        landMark: landMark,
                                        city: city,
                                        postalCode: postalCode,
                                        delivered: false,
                                        deleteOrder: false,
                                        orderInvoice: process.env.INV_PRE + increInvoice + "-" + orderId.toString().substr(-4),
                                    }).save();
                                }
                            }
                            Cart.deleteMany({ userId: userId })
                                .exec()
                                .then((userCartResponse) => {
                                    console.log('userCartResponse', userCartResponse);
                                })

                            res.status(200).json({
                                message: "Order placed successfully!",
                                orderId: orderId
                            })
                        })
                }
                else {
                    res.status(404).json({
                        message: "User not found!"
                    })
                }
            })
    }
    catch (error) {
        console.log('error in place order controller', error);
    }
}

module.exports.GET_ALL_ORDER = async (req, res) => {
    const userId = req.params.userId;
    const arr = [];    
    try {
        await verifyUser(userId)
            .then(async (verificationResponse) => {
                if (verificationResponse) {
                    await Order.find({ deleteOrder: false })
                        .populate('userId', '_id firstName lastName phoneNumber email')
                        .exec()
                        .then((orderResponse) => {
                            if (orderResponse.length > 0) {
                                for (let i = 0; i < orderResponse.length; i++) {
                                    const orderProduct = [];
                                    const orderQuantity = [];
                                    const orderPrice = [];
                                    const order = orderResponse?.
                                        filter((item) => item?.orderId === orderResponse[i]?.orderId);

                                    order.map((orderItem) => {
                                        let product = Products.find((item) => item?.id === orderItem?.productId);
                                        orderProduct.push(product);
                                        orderQuantity.push(orderItem.quantity);
                                        orderPrice.push(product.productPrice);
                                    })
                                    let obj = {
                                        orderId: orderResponse[i]?.orderId,
                                        orderInvoice: orderResponse[i]?.orderInvoice,
                                        product: orderProduct,
                                        quantity: orderQuantity,
                                        productPrice: orderPrice,
                                        total: (orderPrice.map((v, i) => v * orderQuantity[i]).reduce((x, y) => x + y, 0)),
                                        username: orderResponse[i]?.userId?.firstName + " " + orderResponse[i]?.userId?.lastName,
                                        phoneNumber: orderResponse[i]?.userId?.phoneNumber,
                                        email: orderResponse[i]?.userId?.email,
                                        address: orderResponse[i]?.address,
                                        landMark: orderResponse[i]?.landMark,
                                        city: orderResponse[i]?.city,
                                        postalCode: orderResponse[i]?.postalCode,
                                        orderDate: dateConverter(orderResponse[i]?.createdAt),
                                        orderDelivered: orderResponse[i]?.delivered,
                                        deleteOrder: orderResponse[i]?.deleteOrder
                                    }

                                    arr.push(obj);
                                }
                                const userOrders = [...new Map(arr.map(v => [v.orderId, v])).values()];
                                res.status(200).send(userOrders);
                            }
                        })
                }
                else {
                    res.status(400).json({
                        message: "Invalid request!"
                    })
                }
            })
    }
    catch (error) {
        console.log('error in getting all the order', error);
    }
}

module.exports.DELIVERED_ORDER = async (req, res) => {
    const userId = req.params.userId;
    const orderId = req.body.orderId;
    try {
        verifyUser(userId)
            .then(async (verificationResponse) => {
                if (verificationResponse) {
                    await Order.updateMany({ orderId: orderId }, { $set: { delivered: true } })
                        .exec()
                        .then((deliveredResponse) => {
                            if (deliveredResponse.acknowledged) {
                                res.status(200).json({
                                    message: "Updated Successfully!"
                                })
                            }
                        })
                }
                else {
                    res.status(400).json({
                        message: "Invalid request!"
                    })
                }
            })
    }
    catch (error) {
        console.log('error in delivered order controller', error);
    }
}

module.exports.DELETE_ORDER = async (req, res) => {
    const userId = req.params.userId;
    const orderId = req.body.orderId;
    try {
        verifyUser(userId)
            .then(async (verificationResponse) => {
                if (verificationResponse) {
                    await Order.updateMany({ orderId: orderId }, { $set: { deleteOrder: true } })
                        .exec()
                        .then((deliveredResponse) => {
                            if (deliveredResponse.acknowledged) {
                                res.status(200).json({
                                    message: "Updated Successfully!"
                                })
                            }
                        })
                }
                else {
                    res.status(400).json({
                        message: "Invalid request!"
                    })
                }
            })
    }
    catch (error) {
        console.log('error in delete order controller', error);
    }
}

module.exports.GET_USER_ORDER_BY_ID = async (req, res) => {
    const userId = req.params.userId;
    const arr = [];
    try {
        await User.findById(userId)
            .exec()
            .then(async (userResponse) => {
                if (userResponse) {
                    await Order.find({ userId: userId, deleteOrder: false })
                        .populate('userId', '_id firstName lastName phoneNumber email')
                        .exec()
                        .then((orderResponse) => {
                            if (orderResponse.length > 0) {
                                for (let i = 0; i < orderResponse.length; i++) {
                                    const orderProduct = [];
                                    const orderQuantity = [];
                                    const orderPrice = [];
                                    const order = orderResponse?.
                                        filter((item) => item?.orderId === orderResponse[i]?.orderId);

                                    order.map((orderItem) => {
                                        let product = Products.find((item) => item?.id === orderItem?.productId);
                                        orderProduct.push(product);
                                        orderQuantity.push(orderItem.quantity);
                                        orderPrice.push(parseInt(product.productPrice));
                                    })
                                    let obj = {
                                        orderId: orderResponse[i]?.orderId,
                                        orderInvoice: orderResponse[i]?.orderInvoice,
                                        product: orderProduct,
                                        quantity: orderQuantity,
                                        productPrice: orderPrice,
                                        total: (orderPrice.map((v, i) => v * orderQuantity[i]).reduce((x, y) => x + y, 0)),
                                        username: orderResponse[i]?.userId?.firstName + " " + orderResponse[i]?.userId?.lastName,
                                        phoneNumber: orderResponse[i]?.userId?.phoneNumber,
                                        email: orderResponse[i]?.userId?.email,
                                        address: orderResponse[i]?.address,
                                        landMark: orderResponse[i]?.landMark,
                                        city: orderResponse[i]?.city,
                                        postalCode: orderResponse[i]?.postalCode,
                                        orderDate: dateConverter(orderResponse[i]?.createdAt),
                                        orderDelivered: orderResponse[i]?.delivered,
                                        deleteOrder: orderResponse[i]?.deleteOrder
                                    }

                                    arr.push(obj);
                                }
                                const userOrders = [...new Map(arr.map(v => [v.orderId, v])).values()];
                                res.status(200).send(userOrders);
                            }
                            else {
                                res.status(200).send({
                                    message: "No users orders!"
                                })
                            }
                        })
                }
                else {
                    res.status(404).send({
                        message: "User not found!"
                    })
                }
            })
    }
    catch (error) {
        console.log('error in user order by id', error);
    }
}