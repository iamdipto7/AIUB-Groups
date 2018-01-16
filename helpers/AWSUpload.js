const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

let imgName;

AWS.config.update({
  accessKeyId: 'AKIAJIGT7UL6IA3GH6VA',
  secretAccessKey:'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',
  region: 'ap-south-1'
});

const s0 = new AWS.S3({});
const upload = multer({
  storage: multerS3({
    s3: s0,
    bucket: 'aiub-groups',
    acl: 'public-read',
    metadata: function(req,file,cb) {
      cb(null,{fieldName: file.fieldname});
    },
    key: function(req,file,cb){
      let ext = file.originalname.split(".");
      imgName = Date.now().toString()+"."+ext[1];

      //req.body.image = imgName;
      cb(null,imgName);
    }
  })
})



exports.Upload = upload;
exports.getImageName = function () {
  return imgName;
}
