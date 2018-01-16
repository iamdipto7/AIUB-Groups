module.exports = function (async, Users, Message) {
  return {
    SetRouting: function (router) {
      router.get('/chat/:name', this.getChatPage);
      router.post('/chat/:name', this.chatPostPage);
    },

    getChatPage: function(req, res) {
      async.parallel([
        function (callback) {
          Users.findOne({'username': req.user.username})
              .populate('request.userId')
              .exec((err,result) => {
                callback(err,result);
              });
        }
      ], (err, results) => {

        const res1 = results[0];
        //console.log(res1.request[0].username);
        res.render('private/privatechat', {title: 'AIUB Groups - Private Chat', user: req.user, data: res1});
      });
    },

    chatPostPage: function (req, res, next) {
      const params = req.params.name.split('.');
      const nameParams = params[0];
      const nameRegex = new RegExp("^"+nameParams.toLowerCase(), "i");

      async.waterfall([
        function (callback) {
          if (req.body.message) {
            Users.findOne({'username':{$regex: nameRegex}}, (err, data) => {
              callback(err, data);
            });
          }
        },

        function (data, callback) {
          if (req.body.message) {
            const newMessage = new Message();
            newMessage.sender = req.user._id;
            newMessage.receiver = data._id;
            newMessage.senderName = req.user.username;
            newMessage.receiverName = data.username;
            newMessage.message = req.body.message;
            newMessage.userImage = req.user.userImage;
            newMessage.createdAt = new Date();

            newMessage.save((err, result) => {
              if (err) {
                return next(err);
              }
              callback(err, result);
            })
          }
        }
      ], (err, results) => {
        res.redirect('/chat/'+req.params.name);
      })
    }
  };

}
