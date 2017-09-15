const contentful = require("contentful-management");

const keys = require('../keys');

//Contentful's own http module
const client = contentful.createClient({
	accessToken: keys.management
});

/*
Gets all entries in space and cleans. 

TODO: avoid rate limiting.
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
		console.log('test');
	});

}




const retrieveAndCleanSingleEntry = (id) =>{
	client.getSpace(keys.spaceid)
	.then((space) => space.getEntry(id))
	.then((entry) => cleanEntry(entry))
	.catch(console.error)
}

const cleanEntry = (entry) => {
	if(!entry.fields.body){
		return;
	}
	//const body = entry.fields.body[keys.locale];
	//const newBody = body.replace(/“|”/g, '"');
	//entry.fields.body[keys.locale] = newBody;
	//entry.update();
	entry.publish();


}

retrieveAndCleanAllEntries();

//retrieveAndCleanSingleEntry('6rbnW3XR0kO4I4MWqEIWOm');