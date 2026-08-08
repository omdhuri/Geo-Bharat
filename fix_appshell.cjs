const fs = require('fs');
let content = fs.readFileSync('src/components/AppShell.tsx', 'utf8');

// Remove Desktop Conflicts NavItem
content = content.replace(
  "          <NavItem icon={ShieldAlert} label=\"Conflicts\" active={activeTab === 'conflicts'} onClick={() => setActiveTab('conflicts')} badge={pendingReviewsCount > 0 ? pendingReviewsCount : undefined} />\n",
  ""
);

// Add the badge to the Review NavItem instead
content = content.replace(
  "          <NavItem icon={CheckSquare} label=\"Review\" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />",
  "          <NavItem icon={CheckSquare} label=\"Review\" active={activeTab === 'review'} onClick={() => setActiveTab('review')} badge={pendingReviewsCount > 0 ? pendingReviewsCount : undefined} />"
);

// Remove Mobile Conflicts NavItem
content = content.replace(
  "          <MobileNavItem icon={ShieldAlert} label=\"Conflicts\" active={activeTab === 'conflicts'} onClick={() => setActiveTab('conflicts')} badge={pendingReviewsCount > 0 ? pendingReviewsCount : undefined} />\n",
  ""
);

// Add the badge to the Review MobileNavItem instead
content = content.replace(
  "          <MobileNavItem icon={CheckSquare} label=\"Review\" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />",
  "          <MobileNavItem icon={CheckSquare} label=\"Review\" active={activeTab === 'review'} onClick={() => setActiveTab('review')} badge={pendingReviewsCount > 0 ? pendingReviewsCount : undefined} />"
);

fs.writeFileSync('src/components/AppShell.tsx', content);
console.log("Done");
