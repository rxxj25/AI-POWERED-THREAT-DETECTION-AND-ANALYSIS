import React from 'react';
import { Shield, Activity, BarChart2, Settings, AlertTriangle, Zap } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
    return (
        <div className="sidebar">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="relative">
                    <Shield size={36} className="text-primary" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }} />
                    <div className="absolute inset-0 bg-primary opacity-30 blur-lg"></div>
                </div>
                <div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                        SecureGuard
                    </h1>
                    <div className="text-xs text-gray-500 font-semibold tracking-wider">AI DEFENSE</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
                <NavItem
                    icon={<Activity />}
                    label="Live Monitor"
                    active={activeView === 'monitor'}
                    onClick={() => setActiveView('monitor')}
                />
                <NavItem
                    icon={<BarChart2 />}
                    label="Analytics"
                    active={activeView === 'analytics'}
                    onClick={() => setActiveView('analytics')}
                />
                <NavItem
                    icon={<AlertTriangle />}
                    label="Threat Log"
                    active={activeView === 'threats'}
                    onClick={() => setActiveView('threats')}
                />
                <NavItem
                    icon={<Settings />}
                    label="Settings"
                    active={activeView === 'settings'}
                    onClick={() => setActiveView('settings')}
                />
            </nav>

            {/* System Status */}
            <div className="glass-panel p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-10 blur-2xl rounded-full"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={16} className="text-green-400" />
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">System Status</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
                            <span className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-pulse opacity-75"></span>
                        </div>
                        <span className="text-green-400 text-base font-bold">Online & Protected</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500">Uptime</span>
                            <span className="text-gray-300 font-semibold">99.9%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${active
                ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg'
                : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
            }`}
        style={active ? { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' } : {}}
    >
        <div className={active ? 'scale-110' : ''}>
            {icon}
        </div>
        <span className="font-semibold text-sm">{label}</span>
        {active && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
        )}
    </button>
);

export default Sidebar;
