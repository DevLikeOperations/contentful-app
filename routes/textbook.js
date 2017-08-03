var express = require('express');
const path = require('path');

var router = express.Router();

const ALLOWED_BY = new Set([
  'https://crisistextline.instructure.com/',
  'https://home.crisistextline.org/',
  'https://gsd-sendgrid.cs18.force.com/',
  'https://crisistextline.okta.com/',
  'https://ctlpreview.oktapreview.com/',
]);

const refererAllowed = (req) => {
	const baseReferer = getBaseReferer(req);
	return ALLOWED_BY.has(baseReferer);
}

const getBaseReferer = (req) => {
	const referer = req.header('Referer');
	if(referer == null){
		return null;
	}
	const regEx = /^(.*?)\.(com|org)\//g;
	const baseReferer = referer.match(regEx) ? referer.match(regEx)[0] : null;
	return baseReferer;
}

const checkReferer = (req, res, next) =>{
	if(!refererAllowed(req)){
		return res.status(403).end();	
	}else{
		return next();
	}
}

router.get('*', checkReferer,  function (req, res, next) {
	const baseReferer = getBaseReferer(req);
	if(baseReferer != null){
		res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + baseReferer);
	}
	
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = router;