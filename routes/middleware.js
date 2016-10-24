/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var cache = require('memory-cache');
var _ = require('lodash');
var keystone = require('keystone');


function getAllData() {
  return new Promise((resolve, reject) => {
    const data = cache.get('all-data');

    if (data) {
      return resolve(data);
    }

    Promise.all([
      keystone.list('NavLink').model.find().sort('order').exec(),
      keystone.list('Song').model.find().sort('number').exec(),
      keystone.list('Page').model.findOne({
        slug: 'about',
      }).exec(),
    ]).then(([links, songs, aboutPage]) => {
      const data = {
        links, songs, aboutPage,
        publicSongs: songs.filter(song => song.state === 'published'),
      };
      cache.put('all-data', data, 10000);
      resolve(data);
    }).catch(reject);
  });
}


exports.initCache = function (req, res, next) {
  if (!req.path.startsWith('/keystone')) {
    res.set('Cache-Control', 'public, max-age=60');
  }
  next();
};

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
  var locals = res.locals;

  locals.user = req.user;

  getAllData().then(({links, songs, publicSongs, aboutPage}) => {
    locals.navLinks = links;
    locals.songs = req.user ? songs : publicSongs;
    locals.latestSong = _.last(songs);
    locals.aboutText = (aboutPage && aboutPage.description) || '30 days 30 songs is a playlist of songs written and recorded by musicians for a Trump-free America.';
    locals.maxCount = 40;
    /*
    locals.maxCount = (count => {
      for (let max = 30; max < 70; max += 10) {
        if (count < max + 1) {
          return max;
        }
      }

      return 70;
    })(publicSongs.length);
    */
    locals.logoSuffix = locals.maxCount === 30 ? '' : `-${locals.maxCount}`;

    next();

  }).catch(error => {
    next(error);
  });
};

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


exports.cacheResponse = function (req, res, next) {
  const previousResponse = cache.get(req.url);

  if (previousResponse) {
    res.send(previousResponse);
  }
};

