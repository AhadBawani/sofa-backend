const User = require('../Models/UserModel');

module.exports.SIGNUP_USER = (async (req, res) => {
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    try {
        if (phoneNumber === process.env?.START_ORDER && password === process.env?.ADMIN_KEY) {
            await User.findOne({ type: "Admin" })
                .exec()
                .then((userResponse) => {
                    if (userResponse) {
                        res.status(400).json({
                            message: "user already exists!"
                        })
                    }
                    else {
                        const user = new User({
                            firstName: firstName,
                            lastName: lastName,
                            phoneNumber: phoneNumber,
                            email: email,
                            password: password,
                            type: "Admin"
                        }).save();

                        user
                            .then((response) => {
                                res.status(201).json({
                                    message: 'User created successfully!',
                                    user: {
                                        _id: response._id,
                                        username: response.username,
                                        phoneNumber: response.phoneNumber,
                                        type: response.type
                                    }
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            await User.findOne({ phoneNumber: phoneNumber })
                .exec()
                .then((userResponse) => {
                    if (userResponse) {
                        res.status(400).json({
                            message: "user already exists!"
                        })
                    }
                    else {
                        const user = new User({
                            firstName: firstName,
                            lastName: lastName,
                            phoneNumber: phoneNumber,
                            email: email,
                            password: password,
                            type: "User"
                        }).save();

                        user
                            .then((response) => {
                                res.status(201).json({
                                    message: 'User created successfully!',
                                    user: {
                                        _id: response._id,
                                        username: response.username,
                                        phoneNumber: response.phoneNumber,
                                        type: response.type
                                    }
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    catch (error) {
        console.log('Error in Signup controller', error);
    }
});


module.exports.LOGIN_USER = (async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        await User.findOne({ phoneNumber: phoneNumber })
            .exec()
            .then((userResponse) => {
                if (userResponse) {
                    if (userResponse.password === password) {
                        res.status(200).json({
                            _id: userResponse._id,
                            firstName: userResponse.firstName,
                            lastName: userResponse.lastName,
                            phoneNumber: userResponse.phoneNumber,
                            email: userResponse.email,
                            type:userResponse.type
                        })
                    }
                    else {
                        res.status(400).json({
                            message: "Incorrect Password!"
                        })
                    }
                }
                else {
                    res.status(404).send({
                        message: "User not found!"
                    })
                }
            })
    }
    catch (error) {
        console.log('Error in login controller', error);
    }
})

module.exports.GET_USER_BY_ID = async (req, res) => {
    const userId = req.params.userId;

    try {
        await User.findById(userId)
            .select('_id firstName lastName email phoneNumber type')
            .then((userResponse) => {
                res.status(200).json(userResponse);
            })
    }
    catch (error) {
        console.log('error in user get by id controller', error);
    }
}