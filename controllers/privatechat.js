module.exports = function (async, Users) {
  return {
    SetRouting: function (router) {
      router.get('/chat', this.getChatPage);
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
    }
  };

}
