const express = require('express');
const connectionDB = require('./config/db');
const UserRoutes = require('./Routes/UserRoutes');
const ProductRoutes = require('./Routes/ProductRoutes');
const CartRoutes = require('./Routes/CartRoutes');
const OrderRoutes = require('./Routes/OrderRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv/config');

connectionDB();
app.use(bodyParser.json());
app.use(cors());
app.use('/Images', express.static('Images'));

app.use('/user', UserRoutes);
app.use('/product', ProductRoutes);
app.use('/cart', CartRoutes);
app.use('/order', OrderRoutes);

app.use('/', (req, res) => {
    res.send({
        message: "v1 running successfully!"
    })
})

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})
