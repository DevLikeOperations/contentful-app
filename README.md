# contentful-app

Using node@6.2.2

Make sure to npm install -g create-react-app

To build, call 'npm run build' in the 'front' directory and copy the compiled 'build' folder into the root directory.

To use Contentful's API, you'll need a keys.js file in your root directory that looks like this:
```
const SPACE_ID = {space id};
const DELIVERY = {delivery api key};
const PREVIEW = {preview api key};
const MANAGEMENT = '{management api key};

module.exports = {
	spaceid: SPACE_ID,
	delivery_key: DELIVERY,
	preview: PREVIEW,
	management: MANAGEMENT
};
```
