'use strict';

module.exports = function (async, Group, _, Users, Logout, Message, FriendResult) {
  return {
    SetRouting: function (router) {
      router.get('/home',this.homePage);
      router.post('/home', this.postHomePage);

      router.get('/logout',Logout.logout);
    },
    homePage: function (req,res) {

      async.parallel([
        function (callback) {
          Group.find({},(err,result) => {
            callback(err,result);
          })
        },
        function (callback) {
          Group.aggregate([{
            $group: {
              _id: "$department"
            }
          }],(err, newResult)=>{
            callback(err, newResult);
          });
        },

        function (callback) {
          Users.findOne({'username': req.user.username})
              .populate('request.userId')
              .exec((err,result) => {
                callback(err,result);
              });
        },

        function (callback) {
          const nameRegex = new RegExp("^"+req.user.username.toLowerCase(), "i");
          Message.aggregate([
            {$match: {$or:[{"senderName":nameRegex},
            {"receiverName":nameRegex}]}},
            {$sort:{"createdAt":-1}},
            {
              $group: {"_id":{
                "last_message_between": {
                  $cond: [
                    {
                      $gt: [
                        {$substr: ["$senderName", 0, 1]},
                        {$substr: ["$receiverName", 0, 1]}
                      ]
                    },

                    {$concat: ["$senderName", " and ", "$receiverName"]},
                    {$concat: ["$receiverName", " and ", "$senderName"]}

                  ]
                }
              }, "body": {$first:"$$ROOT"}
              }
            }
          ], (err, newResult) => {
            callback(err, newResult);
          });
        }
      ], (err,results) => {
        const res1 = results[0];
        const res2 = results[1];
        const res3 = results[2];
        const res4 = results[3];
        //console.log(res2);

        const dataChunk = [];
        const chunkSize = 3;

        for (let i = 0; i < res1.length; i+=chunkSize) {
          dataChunk.push(res1.slice(i,i+chunkSize));
        }

        const departmentSort = _.sortBy(res2,'_id');
        //console.log(dataChunk);
        res.render('home',{title:'AIUB Groups | Home', user: req.user, chunks: dataChunk, department: departmentSort, data: res3, chat: res4});
      })
    },
    postHomePage: function (req,res) {
      async.parallel([
        function (callback) {
          Group.update({
            '_id': req.body.id,
            'members.username': {$ne: req.user.username}
          }, {
            $push: {members: {
              username: req.user.username,
              email: req.user.email
            }}
          }, (err, count) => {
            console.log(count);
            callback(err, count);
          });

          FriendResult.PostRequest(req, res, '/home');
        }
      ], (err, results) => {
        res.redirect('/home');
      });
    }
  };
}
