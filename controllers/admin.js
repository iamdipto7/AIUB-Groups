'use strict';
const fs = require('fs');
const path = require('path');

module.exports = function (formidable,Group,aws) {
  return {
    SetRouting: function (router) {
      router.get('/dashboard',this.adminPage);

      router.post('/uploadFile', this.uploadFile);
      router.post('/dashboard',this.adminPostPage);
    },
    adminPage: function (req,res) {
      res.render('admin/dashboard');
    },
    adminPostPage: function (req,res) {
      const newGroup = new Group();
      console.log(req.body);
      newGroup.name = req.body.group;
      newGroup.department = req.body.department;
      newGroup.image = req.body.upload;
      newGroup.save((err)=>{
        res.render('admin/dashboard');
      });
    },
    uploadFile: function (req,res) {
      const form = new formidable.IncomingForm();
      form.uploadDir = path.join(__dirname,'../public/uploads');

      form.on('file',(field,file)=>{
        fs.rename(file.path,path.join(form.uploadDir,file.name),(err)=>{
          if (err) {
            throw err;
          }
          else {
            console.log('File rename successfully');
          }
        })
      });
      form.on('error',(err)=>{
        console.log(err);
      });
      form.on('end', () => {
        console.log('File upload is successful');
      });
      form.parse(req);
    }
  };
};
