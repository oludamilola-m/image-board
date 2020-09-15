const aws = require("aws-sdk");
const fs = require("fs");

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
  if (!req.file) {
    console.log(
      "req.file is not ther for somne reason and we cannot contitnue"
    );
    return res.sendStatus(500);
  }
  const { filename, mimetype, size, path } = req.file;

  const promise = s3
    .putObject({
      Bucket: "spicedling",
      //ACL: access control list
      ACL: "public-read",
      Key: filename,
      Body: fs.createReadStream(path),
      ContentType: mimetype,
      ContentLength: size,
    })
    .promise();
  //get an obj which is a promise
  promise
    .then(() => {
      console.log("it is working!");
      next();
    })
    .catch((err) => {
      res.status(422).json({ error: "could not upload image" });
    });
};

// to delete images : read use s3.delete images
