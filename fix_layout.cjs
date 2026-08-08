const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const oldHeader = `      {/* Floating Header */}
      <div className={cn(
        "absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-10 flex flex-col lg:flex-row justify-between items-start lg:items-start pointer-events-none gap-2 transition-all duration-300",
        isLayersTabMobile ? "opacity-0 md:opacity-100" : "opacity-100"
      )}>
        
        {/* Project Context */}
        <div className={cn(
          "bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg p-2 md:p-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-6 transition-all duration-300 lg:w-auto max-w-[85vw]",`;

const newHeader = `      {/* Floating Header */}
      <div className={cn(
        "absolute inset-0 pointer-events-none z-10 transition-all duration-300",
        isLayersTabMobile ? "opacity-0 md:opacity-100" : "opacity-100"
      )}>
        
        {/* Project Context */}
        <div className={cn(
          "absolute top-2 left-2 md:top-4 md:left-4",
          "bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg p-2 md:p-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-6 transition-all duration-300 lg:w-auto max-w-[calc(100vw-80px)] md:max-w-[85vw]",`;

content = content.replace(oldHeader, newHeader);

const oldRightControls = `        {/* Right side controls */}
        <div className="flex items-start gap-1 md:gap-2 shrink-0 self-end lg:self-auto mt-2 lg:mt-0">`;

const newRightControls = `        {/* Right side controls */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-start gap-1 md:gap-2 shrink-0">`;

content = content.replace(oldRightControls, newRightControls);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
