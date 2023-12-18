const User = require('../Models/UserModel');

const verifyUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        await User.findOne({ _id: userId, type: "Admin" })
            .exec()
            .then(response => {
                if (response) {
                    resolve(response);
                }
                else {
                    reject(response);
                }
            })
            .catch(error => {
                reject(response);
            })
    })
}

module.exports = verifyUser;