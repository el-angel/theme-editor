const path = require('path');

const ghpages = require('gh-pages');

const buildDir = path.resolve(__dirname, '../build');

ghpages.publish(buildDir, () => {
  console.log('🎉 published');
});
