var keystone = require('keystone');

exports = module.exports = function (req, res, next) {
	var locals = res.locals;

  locals.song = locals.songs.find(song => song.slug === req.params.number);

  if (!locals.song) {
    return next();
  }
  locals.day = parseInt(locals.song.day, 10);

	// Render the view
	var view = new keystone.View(req, res);
	view.render('song');
};

