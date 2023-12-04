const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app } = require("./app");

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)
    .then(() => {
        console.log(`connected to database`);
    }).catch((err) => {
        console.log(`error to connect to database`);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`the server is running on port ${PORT}`);
})
 
