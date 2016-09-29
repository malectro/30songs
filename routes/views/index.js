var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('init', function (next) {
		keystone.list('NavLink').model.find().sort('order').exec(function (err, results) {
      if (err) {
        return next(err);
      }

      locals.navLinks = results;
      next();
    });
  });

	view.on('init', function (next) {
		keystone.list('Song').model.findOne({
      state: 'published',
    }).sort('number').limit(1).exec(function (err, result) {
      if (err || !result) {
        return next(err);
      }

      locals.song = result;
      next();
    });
  });

	// Render the view
	view.render('index');
};

