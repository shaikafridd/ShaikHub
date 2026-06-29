const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({ region: "ap-south-1" });

const s3 = new AWS.S3();

const S3_BUCKET = process.env.S3_BUCKET || "shaikhubbucket";

module.exports = { s3, S3_BUCKET };