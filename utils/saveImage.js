const fs = require("fs");
const mime = require("mime");
const { v4: uuidv4 } = require("uuid");

const imagePath = "startup/images/";
const showImagePath = "images/";

module.exports = function (data, imageMime) {
  const imageName = uuidv4();
  let imageExt = mime.getExtension(imageMime);
  let saveImageServerPath = imagePath + imageName + "." + imageExt;
  let saveImageDbPath = showImagePath + imageName + "." + imageExt;

  fs.writeFile(saveImageServerPath, data, (err) => {
    if (err) throw err;
  });

  return saveImageDbPath;
};
