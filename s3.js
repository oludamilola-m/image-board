const aws = require("aws-sdk");
const fs = require("fs");
const axios = require("axios");
const uuid = require("uuid");

let secrets;
if (process.env.NODE_ENV == "production") {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
  accessKeyId: secrets.AWS_KEY,
  secretAccessKey: secrets.AWS_SECRET,
});

// files in amazon are called OBJ
//OBJ are called KEYS

exports.upload = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  if (imageUrl) {
    axios({
      method: "get",
      url: imageUrl,
      responseType: "stream",
    }).then((response) => {
      const mimetype = response.headers["content-type"];
      if (!mimetype.includes("image")) {
        return res.sendStatus(422);
      }

      const size = response.headers["content-length"];
      const filename = uuid.v4(); //https://www.npmjs.com/package/uuid

      const promise = uploadToS3(filename, response.data, mimetype, size);
      //get an obj which is a promise
      promise
        .then(() => {
          console.log("it is working!");
          req.filename = filename;
          next();
        })
        .catch((err) => {
          console.log("i was here three", err);
          res.status(422).json({ error: "could not upload image" });
        });
    });
  } else {
    if (!req.file) {
      console.log(
        "req.file is not there for some reason and we cannot continue"
      );
      return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    const promise = uploadToS3(
      filename,
      fs.createReadStream(path),
      mimetype,
      size
    );

    promise
      .then(() => {
        console.log("it is working!");
        req.filename = filename;
        next();
      })
      .catch((err) => {
        res.status(422).json({ error: "could not upload image" });
      });
  }
};

function uploadToS3(filename, body, mimetype, size) {
  return s3
    .putObject({
      Bucket: "spicedling",
      //ACL: access control list
      ACL: "public-read",
      Key: filename,
      Body: body,
      ContentType: mimetype,
      ContentLength: size,
    })
    .promise();
}

exports.delete = (fileName) => {
  var params = {
    Bucket: "spicedling",
    Key: fileName,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject();
      } else {
        resolve(data);
      }
    });
  });
};

// to delete images : read use s3.delete images
