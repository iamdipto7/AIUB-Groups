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
        },
        function (callback) {
          Group.aggregate([{
            $group: {
              _id: "$department"
            }
          }],(err, newResult)=>{
            callback(err, newResult);
          });
        }
      ], (err,results) => {
        const res1 = results[0];
        const res2 = results[1];
        console.log(res2);

        const dataChunk = [];
        const chunkSize = 3;

        for (let i = 0; i < res1.length; i+=chunkSize) {
          dataChunk.push(res1.slice(i,i+chunkSize));
        }

        const departmentSort = _.sortBy(res2,'_id');
        //console.log(dataChunk);
        res.render('home',{title:'AIUB Groups | Home', user: req.user, data: dataChunk, department: departmentSort});
      })
    }
  };
}
