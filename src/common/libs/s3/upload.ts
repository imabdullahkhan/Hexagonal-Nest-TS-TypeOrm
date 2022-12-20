const AWS = require('aws-sdk');
const { storage } = require('../config/app');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: storage.key,
  secretAccessKey: storage.secret,
});

const uploadFile = (filePath, key) => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    s3.upload(
      {
        Key: key,
        Body: fileContent,
        ACL: 'public-read',
        Bucket: storage.bucket,
        ContentType: 'application/pdf',
      },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

module.exports = {
  uploadFile,
};
