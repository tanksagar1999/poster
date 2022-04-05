const mongoose = require("mongoose");

exports.mongo_connection = () => {
  mongoose.set("debug", true);
  try {
    console.log(process.env.DB_MONGO_URL);
    mongoose.connect(
      process.env.DB_MONGO_URL || 'mongodb+srv://testimonials:testimonials@cluster0.tkuln.mongodb.net/devsTree?retryWrites=true&w=majority',
      { useNewUrlParser: true, useFindAndModify: false,useUnifiedTopology: true },
      function (err, db) {
        if (err) {
          console.log("MongoDB Database Connection Error", err);
        } else {
          console.log("MongoDB Connection Done!!");
        }
      }
    );
  } catch (e) {
    console.log("MongoDB Connection Error");
  }
};
