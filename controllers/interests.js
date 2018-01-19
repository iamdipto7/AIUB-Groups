const path = require('path');
const fs = require('fs');

module.exports = function (async, Users, Message, FriendResult) {
  return {
    SetRouting: function (router) {
      router.get('/settings/interests', this.getInterestPage);
      router.post('/settings/interests', this.postInterestsPage);
    },

    getInterestPage: function (req, res) {
      async.parallel([
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
            const arr = [
              {path: 'body.sender', model: 'User'},
              {path: 'body.receiver', model: 'User'}
            ];

            Message.populate(newResult, arr, (err, newResult1) => {
              callback(err, newResult1);
            });
          });
        }
      ], (err, results) => {

        const res1 = results[0];
        const res2 = results[1];

        //console.log(res1.request[0].username);
        res.render('user/interests',{title:'AIUB Groups - Interests', user: req.user, data: res1, chat: res2});
      });
    },

    postInterestsPage: function (req, res) {
      FriendResult.PostRequest(req, res, '/settings/interests');

      async.parallel([
        function (callback) {
          if (req.body.favGroup) {
            Users.update({
              '_id': req.user._id,
              'favGroup.groupName': {$ne: req.body.favGroup}
            }, {
              $push: {favGroup: {
                groupName: req.body.favGroup
              }}
            }, (err, result1) => {
              callback(err, result1);
            });
          }
        }
      ], (err, results) => {
        res.redirect('/settings/interests');
      });
    }
  }
}
