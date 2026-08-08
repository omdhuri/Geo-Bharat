import { ReactNode } from 'react';
import { Layers, Map as MapIcon, ShieldAlert, CheckSquare, Activity, Settings, Bell, Search, Hexagon, User } from 'lucide-react';
import { cn } from '../utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

function NavItem({ icon: Icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-16 transition-colors relative group",
        active ? "text-emerald-600 border-l-2 border-emerald-600 bg-stone-100/50" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/30 border-l-2 border-transparent"
      )}
      title={label}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
      {badge ? (
        <span className="absolute top-2 right-3 w-4 h-4 bg-rose-500 text-[9px] text-stone-900 flex items-center justify-center rounded-full font-bold">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function MobileNavItem({ icon: Icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
        active ? "text-emerald-600 border-t-2 border-emerald-600 bg-stone-100/30" : "text-stone-600 hover:text-stone-900 border-t-2 border-transparent"
      )}
      title={label}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-[10px] font-medium tracking-wide hidden sm:block">{label}</span>
      {badge ? (
        <span className="absolute top-1 sm:right-1/4 right-2 w-3.5 h-3.5 bg-rose-500 text-[8px] text-stone-900 flex items-center justify-center rounded-full font-bold">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default function AppShell({ 
  children, 
  activeTab, 
  setActiveTab,
  pendingReviewsCount,
  onSearch
}: { 
  children: ReactNode, 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  pendingReviewsCount: number,
  onSearch?: (query: string) => void
}) {
  return (
    <div className="flex h-[100dvh] w-full bg-stone-50 text-stone-900 overflow-hidden font-sans flex-col md:flex-row">
      
      {/* Left Sidebar (Desktop) */}
      <nav className="hidden md:flex w-16 h-full bg-white border-r border-stone-200 flex-col items-center py-4 z-50 shadow-xl shrink-0">
        <div className="mb-8 text-emerald-600">
          <Hexagon className="w-8 h-8 fill-emerald-600/20 stroke-2" />
        </div>
        
        <div className="flex flex-col gap-2 flex-1 w-full">
          <NavItem icon={MapIcon} label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <NavItem icon={Layers} label="Layers" active={activeTab === 'layers'} onClick={() => setActiveTab(activeTab === 'layers' ? 'map' : 'layers')} />
          <NavItem icon={ShieldAlert} label="Conflicts" active={activeTab === 'conflicts'} onClick={() => setActiveTab('conflicts')} badge={pendingReviewsCount > 0 ? pendingReviewsCount : undefined} />
          <NavItem icon={CheckSquare} label="Review" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />
          <NavItem icon={Activity} label="Changes" active={activeTab === 'changes'} onClick={() => setActiveTab('changes')} />
        </div>

        <div className="mt-auto flex flex-col gap-2 w-full">
          <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-14 shrink-0 bg-white/90 backdrop-blur border-b border-stone-200 flex items-center px-4 justify-between z-40">
          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="text-base md:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-1 md:gap-2">
              GeoBharat <span className="text-emerald-600 font-black">AI</span>
            </h1>
            <div className="hidden md:block h-4 w-px bg-stone-200 mx-2" />
            <span className="hidden md:block text-xs text-stone-600 font-medium tracking-wide uppercase">From Pixels to Property Intelligence</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
              <input 
                type="text" 
                placeholder="Search map..." 
                className="bg-stone-100/50 border border-stone-300 rounded-md py-1.5 pl-9 pr-4 text-sm w-48 md:w-64 focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-stone-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearch) {
                    onSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              <button className="text-stone-600 hover:text-stone-900 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-400 flex items-center justify-center text-sm font-bold text-stone-900 shadow-sm overflow-hidden">
                <User className="w-4 h-4 text-stone-800" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden shrink-0 h-14 sm:h-16 bg-white border-t border-stone-200 flex justify-around items-center z-50">
          <MobileNavItem icon={MapIcon} label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <MobileNavItem icon={Layers} label="Layers" active={activeTab === 'layers'} onClick={() => setActiveTab(activeTab === 'layers' ? 'map' : 'layers')} />
          <MobileNavItem icon={ShieldAlert} label="Conflicts" active={activeTab === 'conflicts'} onClick={() => setActiveTab('conflicts')} badge={pendingReviewsCount > 0 ? pendingReviewsCount : undefined} />
          <MobileNavItem icon={CheckSquare} label="Review" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />
          <MobileNavItem icon={Activity} label="Changes" active={activeTab === 'changes'} onClick={() => setActiveTab('changes')} />
        </nav>
      </div>
    </div>
  );
}
