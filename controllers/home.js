'use strict';

module.exports = function (async, Group, _) {
  return {
    SetRouting: function (router) {
      router.get('/home',this.homePage);
    },
    homePage: function (req,res) {

      async.parallel([
        function (callback) {
          Group.find({},(err,result) => {
            callback(err,result);
          })
        }
      ], (err,results) => {
        const res1 = results[0];

        const dataChunk = [];
        const chunkSize = 3;

        for (let i = 0; i < res1.length; i+=chunkSize) {
          dataChunk.push(res1.slice(i,i+chunkSize));
        }
        console.log(dataChunk);
        res.render('home',{title:'AIUB Groups | Home',data: dataChunk});
      })
    }
  };
}
