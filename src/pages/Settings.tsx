import React, { useState } from 'react';
import { Settings as SettingsIcon, Map as MapIcon, Sliders, Bell, Shield, User, Save, UploadCloud } from 'lucide-react';
import { cn } from '../utils';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full h-full bg-stone-50 flex flex-col overflow-hidden animate-in fade-in duration-200">
      <div className="p-6 md:px-8 border-b border-stone-200 bg-white">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-600" />
          Settings
        </h1>
        <p className="text-sm text-stone-600 mt-1">Manage your workspace preferences and AI configuration.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 bg-white p-4 overflow-x-auto md:overflow-y-auto shrink-0">
          <nav className="flex md:flex-col gap-2">
            <NavItem 
              icon={MapIcon} 
              label="Map & Workspace" 
              active={activeSection === 'general'} 
              onClick={() => setActiveSection('general')} 
            />
            <NavItem 
              icon={Sliders} 
              label="AI Configuration" 
              active={activeSection === 'ai'} 
              onClick={() => setActiveSection('ai')} 
            />
            <NavItem 
              icon={UploadCloud} 
              label="Data Sync" 
              active={activeSection === 'sync'} 
              onClick={() => setActiveSection('sync')} 
            />
            <NavItem 
              icon={User} 
              label="Account" 
              active={activeSection === 'account'} 
              onClick={() => setActiveSection('account')} 
            />
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-stone-50">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {activeSection === 'general' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <SectionHeader title="Map Preferences" description="Configure how the map behaves by default." />
                
                <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">Default Map Style</div>
                      <div className="text-xs text-stone-500">Choose the default basemap for new projects</div>
                    </div>
                    <select className="bg-stone-50 border border-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2">
                      <option>Satellite (Esri)</option>
                      <option>Streets (OSM)</option>
                      <option>Topographic</option>
                      <option>Dark Canvas</option>
                    </select>
                  </div>

                  <div className="h-px bg-stone-100" />

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">Measurement System</div>
                      <div className="text-xs text-stone-500">Units for area and distance</div>
                    </div>
                    <select className="bg-stone-50 border border-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2">
                      <option>Metric (Meters, Hectares)</option>
                      <option>Imperial (Feet, Acres)</option>
                    </select>
                  </div>
                  
                  <div className="h-px bg-stone-100" />
                  
                  <ToggleOption 
                    title="Snap to geometry" 
                    description="Automatically snap cursor to nearby points and edges while drawing" 
                    defaultChecked={true} 
                  />
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <SectionHeader title="AI Analysis Settings" description="Tune the sensitivity and behavior of the change detection and conflict models." />
                
                <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-stone-900 text-sm">Confidence Threshold</div>
                      <span className="text-emerald-700 font-bold text-sm">85%</span>
                    </div>
                    <div className="text-xs text-stone-500 mb-3">AI detections below this confidence score will not be flagged as conflicts.</div>
                    <input type="range" min="50" max="99" defaultValue="85" className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                  </div>

                  <div className="h-px bg-stone-100" />
                  
                  <ToggleOption 
                    title="Auto-run analysis on import" 
                    description="Automatically trigger AI review when new layers are added to the map" 
                    defaultChecked={true} 
                  />

                  <div className="h-px bg-stone-100" />

                  <ToggleOption 
                    title="Highlight Boundary Overlaps" 
                    description="Visually highlight potential farm boundary encroachments automatically" 
                    defaultChecked={true} 
                  />
                </div>
              </div>
            )}

            {activeSection === 'sync' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <SectionHeader title="Data Synchronization" description="Manage how data is saved and synced to the cloud." />
                
                <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-5">
                  <ToggleOption 
                    title="Cloud Sync" 
                    description="Continuously save changes to your workspace cloud" 
                    defaultChecked={true} 
                  />
                  
                  <div className="h-px bg-stone-100" />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">Default Export Format</div>
                      <div className="text-xs text-stone-500">Format used when downloading layers</div>
                    </div>
                    <select className="bg-stone-50 border border-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2">
                      <option>GeoJSON</option>
                      <option>Shapefile (ZIP)</option>
                      <option>KML</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <SectionHeader title="Account Details" description="Manage your profile and subscription." />
                
                <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold">
                      OM
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">omdhuri48@gmail.com</div>
                      <div className="text-sm text-stone-500">Pro Plan (Billed annually)</div>
                    </div>
                  </div>
                  
                  <div className="h-px bg-stone-100" />
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600">Storage Used</span>
                    <span className="text-sm font-semibold text-stone-900">4.2 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '8.4%' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                {saved ? <span className="flex items-center gap-2"><SettingsIcon className="w-4 h-4 animate-spin" /> Saved</span> : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Preferences</span>}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left whitespace-nowrap",
        active 
          ? "bg-emerald-50 text-emerald-700" 
          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-emerald-600" : "text-stone-400")} />
      {label}
    </button>
  );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-stone-900">{title}</h2>
      <p className="text-sm text-stone-500">{description}</p>
    </div>
  );
}

function ToggleOption({ title, description, defaultChecked }: { title: string, description: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setChecked(!checked)}>
      <div>
        <div className="font-semibold text-stone-900 text-sm">{title}</div>
        <div className="text-xs text-stone-500 mt-0.5">{description}</div>
      </div>
      <div className={cn(
        "w-10 h-6 rounded-full flex items-center p-1 transition-colors shrink-0",
        checked ? "bg-emerald-500" : "bg-stone-300"
      )}>
        <div className={cn(
          "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}
