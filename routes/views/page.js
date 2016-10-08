var cache = require('memory-cache');
var keystone = require('keystone');

const NOT_FOUND = Symbol('page not found');


function getPage(slug) {
  return new Promise((resolve, reject) => {
    const page = cache.get(slug);

    if (page !== null) {
      return resolve(page);
    }

    keystone.list('Page').model.findOne({
      slug,
    }).exec().then(page => {
      page = page || NOT_FOUND;
      cache.put(slug, page, 10000);
      resolve(page);
    }, error => reject);
  });
}

exports = module.exports = function (req, res, next) {
	var locals = res.locals;
	var view = new keystone.View(req, res);

  getPage(req.params.slug).then(page => {
    if (page !== NOT_FOUND) {
      locals.page = page;
      view.render('page');
    } else {
      res.notFound();
    }
  }).catch(next);
};

