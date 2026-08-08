const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [searchMarker, setSearchMarker] = useState<{lat: number, lon: number, label: string} | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);`;

const replacement1 = `  const [searchMarker, setSearchMarker] = useState<{lat: number, lon: number, label: string} | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [initialConflictId, setInitialConflictId] = useState<string | null>(null);
  const [initialAction, setInitialAction] = useState<'view' | 'edit' | null>(null);`;

content = content.replace(target1, replacement1);

const target2 = `  const handleNavigateToConflict = (c: Conflict) => {
    setActiveTab('map');
    // In a real app we'd pass the selected conflict to the map workspace via state/context
  };`;

const replacement2 = `  const handleNavigateToConflict = (c: Conflict, action: 'view' | 'edit' = 'view') => {
    setInitialConflictId(c.id);
    setInitialAction(action);
    setActiveTab('map');
  };`;

content = content.replace(target2, replacement2);

const target3 = `          searchMarker={searchMarker}
        />`;

const replacement3 = `          searchMarker={searchMarker}
          initialConflictId={initialConflictId}
          initialAction={initialAction}
          clearInitialConflict={() => {
            setInitialConflictId(null);
            setInitialAction(null);
          }}
        />`;

content = content.replace(target3, replacement3);

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
