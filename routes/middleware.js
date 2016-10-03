/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
  var locals = res.locals;

  locals.user = req.user;

  keystone.list('NavLink').model.find().sort('order').exec(function (err, results) {
    if (err) {
      return next(err);
    }

    locals.navLinks = results;
    next();
  });
};

exports.initSongs = function (req, res, next) {
  var locals = res.locals;

  keystone.list('Song').model.find({
    state: 'published',
  }).sort('number').exec(function (err, results) {
    if (err || !results.length) {
      return next(err);
    }

    locals.songs = results;
    locals.latestSong = _.last(results);
    next();
  });
}

exports.initErrorHandlers = function (req, res, next) {
  res.notFound = function () {
    res.status(404).render('errors/404');
  };

  next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


exports.userOr404 = function (req, res, next) {
	if (!req.user) {
    res.notFound();
	} else {
		next();
	}
};

exports.notFound = function (req, res) {
  res.status(404).render('404');
}

