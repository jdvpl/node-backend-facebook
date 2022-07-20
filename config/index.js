const mongoose = require("mongoose");

const dbConection = async () => {
  try {
    // opciones {autoIndex:false,}
    await mongoose.connect(process.env.MONGODBCOONECTION, {
      useNewUrlParser: true,
    });
    console.log("Db conected");
  } catch (error) {
    throw new Error(`Database failed`);
  }
};

module.exports = { dbConection };
