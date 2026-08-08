const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// Replace the entire cursor block
content = content.replace(/\.tracing-cursor[\s\S]*?\}\s*$/m, '');

const newCursorCss = `
.tracing-cursor,
.tracing-cursor.leaflet-container,
.tracing-cursor .leaflet-grab,
.tracing-cursor .leaflet-interactive,
.tracing-cursor .leaflet-dragging,
.tracing-cursor * {
  cursor: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSd3aGl0ZScgc3Ryb2tlPSdibGFjaycgc3Ryb2tlLXdpZHRoPScyJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjxwYXRoIGQ9J00yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6Jy8+PHBhdGggZD0nbTE1IDUgNCA0Jy8+PC9zdmc+") 2 22, crosshair !important;
}
`;

fs.writeFileSync('src/index.css', content + newCursorCss);
console.log("Done");
