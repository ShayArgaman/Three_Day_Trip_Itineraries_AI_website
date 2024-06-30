const express = require("express");
const cors = require("cors");

const { fetchImageFromApi } = require("./imageClient");
const {
  connectToDb,
  fetchImageFromDb,
  saveImageInDbFromURL,
} = require("./dbClient");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/img", async (req, res) => {
  const { finishLine } = req.body;

  let imageData = await fetchImageFromDb(finishLine);
  if (imageData) return res.send(imageData);

  const temporaryImageUrl = await fetchImageFromApi({ finishLine });
  await saveImageInDbFromURL(finishLine, temporaryImageUrl);
  imageData = await fetchImageFromDb(finishLine);

  res.send(imageData);
});

const initServer = async () => {
  await connectToDb();
  app.listen(8080, () => console.log("connected"));
};

initServer();
