const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// Remove the existing broken cursor css block
content = content.replace(/@layer utilities \{\s*\.tracing-cursor[\s\S]*?\}\s*\}/g, '');

const newCursorCss = `
.tracing-cursor,
.tracing-cursor.leaflet-container,
.tracing-cursor .leaflet-grab,
.tracing-cursor .leaflet-interactive,
.tracing-cursor .leaflet-dragging,
.tracing-cursor * {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E") 2 22, crosshair !important;
}
`;

fs.writeFileSync('src/index.css', content + newCursorCss);
console.log("Done");
