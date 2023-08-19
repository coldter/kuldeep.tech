/*
 * algolia https://www.algolia.com/doc/guides/getting-started/quick-start/tutorials/quick-start-with-the-api-client/javascript/?client=javascript
 */

// For the default version
const algoliaSearch = require('algoliasearch');

const appID = 'OJXEZRLO4G';
const indexName = 'kuldeep-dot-tech';
const adminKey = process.env.ALGOLIA_ADMIN_KEY;
const indexFile = '../../public/index.json';

const client = algoliaSearch(appID, adminKey);
const index = client.initIndex(indexName);
const indexJson = require(indexFile);

index
  .saveObjects(indexJson, {
    autoGenerateObjectIDIfNotExist: true,
  })
  .then(({ objectIDs }) => {
    console.log(objectIDs);
  });
