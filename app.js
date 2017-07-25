const contentful = require("contentful");
const express = require("express");
const logger = require("morgan");
const app = express();
const keys = require('./keys');
const marked = require('marked');
const path = require('path');
const frameguard = require('frameguard');

app.set('secret', keys.secret); 

//Logs things in console
app.use(logger('short'));

//Contentful's own http module
const client = contentful.createClient({
	space: keys.spaceid,
	accessToken: keys.delivery_key,
});

//Third party parses MD to HTML
marked.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartypants:  true,
});

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

app.use(express.static(path.join(__dirname, 'build')));

app.get('/hello', function (req, res, next) {
	res.send('Hello');
});

app.get('/api/contents', function(req,res,next){
	//if(!refererAllowed(req)) return res.status(403).end();

	if(!refererAllowed(req)){
		const baseReferer = getBaseReferer(req);
		res.status(403).send({ error: "The base referer we received is: " + baseReferer });
	}
	getTableOfContents().then(function(tableOfContents){
		res.json(tableOfContents);
	});
});

app.get('/api/textbook', function(req, res, next){
	//if(!refererAllowed(req)) return res.status(403).end();
	if(!refererAllowed(req)){
		const baseReferer = getBaseReferer(req);
		res.status(403).send({ error: "The base referer we received is: " + baseReferer });
	}
	getFullTextbook().then(function(fullTextbookHTML){
		res.json(fullTextbookHTML)
	});
});

app.get('/api/:id', function(req, res, next){
	//if(!refererAllowed(req)) return res.status(403).end();

	if(!refererAllowed(req)){
		const baseReferer = getBaseReferer(req);
		res.status(403).send({ error: "The base referer we received is: " + baseReferer });
	}
	const name = req.params.id;

	getEntry(name).then(function(html){
		res.json(html);
	}).catch(function(e){
		res.json(e);
	});
});

app.get('*', function (req, res, next) {
	//if(!refererAllowed(req)) return res.status(403).end();	
	/*
	if(!referrerAllowed(req)){
		const baseReferer = getBaseReferer(req);
		res.status(403).send({ error: "The base referer we received is: " + baseReferer });
	}
	*/
	const baseReferer = getBaseReferer(req);
	if(baseReferer != null){
		res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + baseReferer);
	}

	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8081, function(){
	console.log('Listening on route 8081!');
});


const convertMarkdownToHTML = (text) =>{
	return marked(text).replace(/&amp;/g,'&');
}
const getEntry = (entryId) =>
{
	return client.getEntry(entryId).then(function(entry){
		const info = entry.fields;
		const title = info.title;
		const body = info.body;
		const bodyHTML = convertMarkdownToHTML(body);
		return bodyHTML;
	}).catch(function(e){
		return e;
	});
}

const getTableOfContents = () =>
{
	//unfortunately, getentry does not allow use of the include parameter so we will use getEntries
	return client.getEntries({'sys.id': keys.textbook_id, include: 2}).then(function(response){
		const theTextbook = response.items[0];
		const chapters = theTextbook.fields.chapters;

		const tableOfContents = [];

		chapters.forEach(function(chapter){
			const chapterTitle = chapter.fields.title;
			const chapterId = chapter.sys.id;

			const subsections = chapter.fields.subsection.map(function(s){
				return {title: s.fields.title};
			});

			tableOfContents.push(
				{
					title: chapterTitle,
					id: chapterId,
					subsections
				}
			);

		});
		return tableOfContents;

	}).catch(function(e){
		return e;
	});
}

const getFullTextbook = () => {
	//unfortunately, getentry does not allow use of the include parameter so we will use getEntries
	return client.getEntries({'sys.id': keys.textbook_id, include: 2}).then(function(response){
		const theTextbook = response.items[0];
		const chapters = theTextbook.fields.chapters;

		const fullTextbookHTML = [];

		chapters.forEach(function(chapter){
			const chapterBody = convertMarkdownToHTML(chapter.fields.body);
			fullTextbookHTML.push(chapterBody);

			chapter.fields.subsection.forEach(function(subsec){
				const subsectionBody = convertMarkdownToHTML(subsec.fields.body);
				fullTextbookHTML.push(subsectionBody);
			});

		});
		return fullTextbookHTML;
	});
}

