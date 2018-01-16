'use strict';

module.exports = function () {
  return {
    logout: (req,res) => {
      req.logout();
      req.session.destroy((err) => {
        res.redirect('/');
      });
    }
  };
}
