const contentful = require("contentful-management");

const keys = require('../keys');

//Contentful's own http module
const client = contentful.createClient({
	accessToken: keys.management
});

/*
Gets all entries in space and cleans. Be careful when calling this!
*/
const retrieveAndCleanAllEntries = () =>{
	client.getSpace(keys.spaceid)
	.then((space) => space.getEntries())
	.then((entries) => cleanEntries(entries.items))
	.catch(console.error)

}

const cleanEntries = (entries) => {
	entries.forEach(function(entry){
		const contentType = entry.sys.contentType.sys.id;
		if (contentType === 'subsection'){
			cleanEntry(entry);
		}
	});
}

const retrieveAndCleanSingleEntry = (id) =>{
	client.getSpace(keys.spaceid)
	.then((space) => space.getEntry(id))
	.then((entry) => cleanEntry(entry))
	.catch(console.error)
}

const cleanEntry = (entry) => {
	const body = entry.fields.body['en-US'];
	const newBody = body.replace(/“|”/g, '"');
	entry.fields.body['en-US'] = newBody;
	entry.update();
}

//retrieveAndCleanAllEntries();

retrieveAndCleanSingleEntry('6rbnW3XR0kO4I4MWqEIWOm');