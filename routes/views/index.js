var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

  locals.song = locals.latestSong;
  locals.day = parseInt(locals.song.day, 10);

	// Render the view
	view.render('index');
};

