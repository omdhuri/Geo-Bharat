import React, { useState } from 'react';
import { Upload, X, File, Database, Globe } from 'lucide-react';
import { cn } from '../utils';

export default function ImportModal({ onClose }: { onClose: () => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startImport();
    }
  };

  const startImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-stone-50/60 backdrop-blur-sm z-[100] flex items-center justify-center pointer-events-auto">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
         <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-100/30">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" /> Import Data
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
         </div>

         <div className="p-6 space-y-6">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors relative",
                dragActive ? "border-emerald-500 bg-emerald-50/50" : "border-stone-300 hover:border-emerald-500/50 hover:bg-stone-50"
              )}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    startImport();
                  }
                }}
                accept=".geojson,.json,.kml,.shp,.zip"
              />
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-stone-900 font-bold mb-1">Click to upload or drag and drop</h4>
              <p className="text-xs text-stone-500">GeoJSON, KML, SHP (zip), or CSV (max. 100MB)</p>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">Other Sources</div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 font-medium text-sm transition-colors">
                  <Globe className="w-4 h-4" /> Connect WFS/WMS
                </button>
                <button className="flex items-center justify-center gap-2 p-3 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 font-medium text-sm transition-colors">
                  <File className="w-4 h-4" /> Use Example Data
                </button>
              </div>
            </div>
         </div>

         {importing && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
             <div className="text-stone-900 font-bold">Processing Spatial Data...</div>
             <div className="text-stone-500 text-sm mt-1">Extracting features and topology</div>
           </div>
         )}
      </div>
    </div>
  );
}
