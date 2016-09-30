var keystone = require('keystone');

exports = module.exports = function (req, res, next) {
	var locals = res.locals;
	var view = new keystone.View(req, res);

  keystone.list('Page').model.findOne({
    slug: req.params.slug,
  }).exec((err, result) => {
    if (err || !result) {
      next(err);
    }

    locals.page = result;
    view.render('page');
  });
};

