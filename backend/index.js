const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());



app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const shopRouter = require('./routes/shop');

app.use(shopRouter.router);

app.listen(3000, () => console.log("http://localhost:3000"));
