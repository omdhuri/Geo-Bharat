const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

if (!content.includes('favicon.svg')) {
  content = content.replace(
    '<title>GeoBharat AI</title>',
    '<title>GeoBharat AI</title>\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
  );
  fs.writeFileSync('index.html', content);
}
