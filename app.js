
var contentful = require("contentful");
var showdown = require("showdown");
var express = require("express");
var logger = require("morgan");
var app = express();
var keys = require('./keys');
var cors = require('cors');

//Logs things in console
app.use(logger('short'));

app.use(cors());

//Contentful's own http module
var client = contentful.createClient({
	space: keys.spaceid,
	accessToken: keys.delivery_key,
});

//Third party parses MD to HTML
var converter = new showdown.Converter();


//Maps our contentID to a chapterNumber for our route unless we want to just use contentID
var TableOfContents = {
	"TESTING": 'GsCzOMyOEmWAGcQI2S8a4',
	'1': '',
	'2': '',
	'3': '',
	'4': '',
	'5': '',
	'6': '',
};



var get_chapter = (chapter_number) =>
{
	return client.getEntries({'sys.id': TableOfContents.TESTING}).then(function(res){
		var info = res.items[0].fields;
		var title = info.title;
		var body = info.body;

		var bodyHTML = converter.makeHtml(body);

		return bodyHTML;	
	}).catch(function(e){
		return e;
	});
};

app.get('/:num', function(req, res, next){
	var chapter_number = req.params.num;

	get_chapter(chapter_number).then(function(chapterHTML){
		res.json(chapterHTML);
	}).catch(function(e){
		res.json(e);
	});
});


app.listen(8000, function(){
	console.log('Listening on route 8000!');
});