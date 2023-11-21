const Cart = require('../Models/CartModel');
const data = require('../config/data');

module.exports.ADD_TO_USER_CART = (async (req, res) => {
    const { productId, userId, quantity } = req.body;
    try {
        const productIndex = data.findIndex((item) => item?.id === productId);
        if (productIndex >= 0) {
            const cart = new Cart({
                productId: productId,
                userId: userId,
                quantity: quantity
            }).save();

            cart
                .then((response) => {
                    res.status(201).json({
                        message: 'Added to cart successfully!',
                        cart: {
                            _id: response._id,
                            productId: response.productId,
                            userId: response.userId,
                            quantity: response.quantity
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    catch (error) {
        console.log('error in add to user cart controller', error);
    }
})


module.exports.GET_USER_CART = (async (req, res) => {
    const userId = req.params.userId;
    const userCart = [];
    try {
        await Cart.find({ userId: userId })
            .exec()
            .then((cartResponse) => {
                if (cartResponse.length > 0) {
                    for (let i = 0; i < cartResponse.length; i++) {
                        let product = data.find((item) => item.id === cartResponse[i]?.productId);
                        let obj = {
                            _id: cartResponse[i]?._id,
                            productId:product?.id,
                            productName: product?.productName,
                            productImage: product?.productImage,
                            productPrice: product?.productPrice,
                            quantity: cartResponse[i]?.quantity
                        }
                        userCart.push(obj);
                    }
                }
                res.json(userCart);
            })
    }
    catch (error) {
        console.log('error in get user cart controller', error);
    }
})

module.exports.ADD_QUANTITY_OF_CART = async (req, res) => {
    const cartId = req.params.cartId;    
    try {
        await Cart.findByIdAndUpdate(cartId, { $inc: { 'quantity': 1 } }, { new: true })
            .exec()
            .then((cartResponse) => {
                if (cartResponse) {
                    res.status(200).send({
                        message: "Updated Successfully"
                    });
                }
            })
    }
    catch (error) {
        console.log('error in add quantity controller', error);
    }
}

module.exports.REMOVE_QUANTITY_OF_CART = async (req, res) => {
    const cartId = req.params.cartId;
    try {
        await Cart.findById(cartId)
            .exec()
            .then(async (cartResponse) => {
                if (cartResponse.quantity === 1) {
                    await Cart.deleteOne({ _id: cartId })
                        .then((deleteCartResponse) => {
                            if (deleteCartResponse) {
                                res.status(200).send({
                                    message: "Deleted Successfully"
                                });
                            }
                        })
                }
                await Cart.findByIdAndUpdate(cartId, { $inc: { 'quantity': -1 } }, { new: true })
                    .exec()
                    .then((cartResponse) => {
                        if (cartResponse) {
                            res.status(200).send({
                                message: "Updated Successfully"
                            });
                        }
                    })
            })
    }
    catch (error) {
        console.log('error in remove quantity of cart', error);
    }
}

module.exports.DELETE_CART = async (req, res) => {
    const cartId = req.params.cartId;
    try {
        await Cart.deleteOne({ _id: cartId })
            .then((deleteCartResponse) => {
                if (deleteCartResponse) {
                    res.status(200).send({
                        message: "Deleted Successfully"
                    });
                }
            })
    }
    catch (error) {
        console.log('error in delete cart controller', error);
    }
}