const mongoose = require("mongoose");
const axios = require("axios");

// schemas
const imageSchema = new mongoose.Schema({
  finishLine: String,
  imageUrl: String,
  data: Buffer,
});

const Image = mongoose.model("Image", imageSchema);

// Function to connect to MongoDB
module.exports.connectToDb = () =>
  mongoose
    .connect(// ADD HERE YOUR mongodb details
            "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority", // ADD HERE YOUR mongodb details
    )// ADD HERE YOUR mongodb details
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

module.exports.saveImageInDbFromURL = async (finishLine, imageUrl) => {
  console.log("=================>", finishLine, imageUrl);
  const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" });

  const newImage = new Image({
    finishLine,
    imageUrl,
    data: Buffer.from(data, "binary"),
  });

  await newImage.save();

  console.log("image saved succesfully");
};

module.exports.fetchImageFromDb = async (finishLine) => {
  const { data } = (await Image.findOne({ finishLine })) ?? {};
  console.log("return iamge from db or null");
  return data;
};
