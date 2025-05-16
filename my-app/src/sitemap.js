// scripts/generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const sitemap = new SitemapStream({ hostname: 'https://plog.dev' });

const writeStream = createWriteStream('./public/sitemap.xml');
sitemap.pipe(writeStream);

//React Apps