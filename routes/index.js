
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { presenter: true });
};

exports.view = function(req, res) {
  res.render('index', { presenter: false});
}

exports.present = function(req, res) {
  res.render('index', { presenter: true});
}