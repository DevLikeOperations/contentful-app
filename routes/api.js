const express = require('express');
const markymark = require('markymark');
const contentful = require("contentful");
const keys = require('../keys');


var router = express.Router();

const convertMarkdownToHTML = (text) =>{
	return markymark(text).replace(/&amp;/g,'&');
}

//Third party parses MD to HTML
markymark.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartypants:  true,
});

//Contentful's own http module
const client = contentful.createClient({
	space: keys.textbook_space_id,
	accessToken: keys.textbook_delivery_key,
});

const communityClient = contentful.createClient({
	space: keys.community_space_id,
	accessToken: keys.community_delivery_key,
});


router.get('/contents', function(req,res,next){
	getTableOfContents().then(function(tableOfContents){
		res.json(tableOfContents);
	});
});

router.get('/textbook', function(req, res, next){
	getFullTextbook().then(function(fullTextbookHTML){
		res.json(fullTextbookHTML)
	});
});

router.get('/:id', function(req, res, next){
	const id = req.params.id;

	getEntry(id).then(function(html){
		res.json(html);
	}).catch(function(e){
		res.json(e);
	});
});

router.get('/community/newsletters', function(req,res,next){
	getCommunityNewsletters().then(function(newslettersOrderedByDate){
		res.json(newslettersOrderedByDate);
	}).catch(function(e){
		res.json(e);
	});
	
});

router.get('/community/newsletters/:newsletterId', function(req, res, next){
	const newsletterId = req.params.newsletterId;
	getCommunityEntry(newsletterId).then(function(newsletterHTML){
		res.json(newsletterHTML);
	}).catch(function(e){
		res.json(e);
	});
});

router.get('/community/:articleId', function(req,res,next){
	const articleId = req.params.articleId;
	getCommunityEntry(articleId).then(function(articleHTML){
		res.json(articleHTML);
	}).catch(function(e){
		res.json(e);
	});
});
const getCommunityEntry = (entryId) => {
	return communityClient.getEntry(entryId).then(function(entry){
		const info = entry.fields;
		const title = info.title;
		const body = info.body;
		const bodyHTML = convertMarkdownToHTML(body);
		return {title, body:bodyHTML};
	}).catch(function(e){
		return e;
	});
}

const getCommunityNewsletters = () => {
	return communityClient.getEntries({'content_type': 'newsletter', 'order' : 'fields.date'}).then(function(response){
		const newsletters = response.items.map(function(newsletter){
			return {title: newsletter.fields.title, id: newsletter.sys.id};
		});
		return newsletters;
	}).catch(function(e){
		return e;
	})
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


module.exports = router;