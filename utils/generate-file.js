const fs = require('fs');

// Creating folder if one does not exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Output directory does not exist. Creating directory.');
  } else {
    console.log('Output directory already exists.');
  }
}

// writing files
const writeFile = (dir, name, fileContent) => {
  ensureDir(dir);
  return new Promise((resolve, reject) => {
    fs.writeFile(`${dir}/${name}.html`, fileContent, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        ok: true,
        message: 'File created!'
      });
    });
  });
};

module.exports = writeFile;
