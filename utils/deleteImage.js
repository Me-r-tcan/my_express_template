const fs = require("fs");

const imagePath = "startup/";

module.exports = function (filename) {
  let image = imagePath + filename;

  fs.unlink(image, (err) => {
    if (err) {
      return;
    }

    //file removed
  });
};
