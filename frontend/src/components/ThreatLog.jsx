import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, Shield, X, Clock, Target } from 'lucide-react';

const ThreatLog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');

    // Mock threat data
    const threats = [
        { id: 1, time: '2026-01-09 11:45:23', type: 'DoS Attack', severity: 'critical', source: '192.168.1.105', confidence: 98.5, status: 'blocked' },
        { id: 2, time: '2026-01-09 11:32:17', type: 'Port Scan', severity: 'high', source: '10.0.0.45', confidence: 95.2, status: 'blocked' },
        { id: 3, time: '2026-01-09 11:18:44', type: 'SQL Injection', severity: 'critical', source: '172.16.0.89', confidence: 99.1, status: 'blocked' },
        { id: 4, time: '2026-01-09 10:55:12', type: 'Brute Force', severity: 'high', source: '192.168.1.78', confidence: 97.3, status: 'blocked' },
        { id: 5, time: '2026-01-09 10:41:08', type: 'Probe', severity: 'medium', source: '10.0.0.123', confidence: 89.7, status: 'monitored' },
        { id: 6, time: '2026-01-09 10:22:35', type: 'R2L Attack', severity: 'high', source: '172.16.0.201', confidence: 94.8, status: 'blocked' },
        { id: 7, time: '2026-01-09 09:58:19', type: 'DoS Attack', severity: 'critical', source: '192.168.1.150', confidence: 99.5, status: 'blocked' },
        { id: 8, time: '2026-01-09 09:33:47', type: 'Port Scan', severity: 'medium', source: '10.0.0.67', confidence: 87.2, status: 'monitored' },
        { id: 9, time: '2026-01-09 09:12:55', type: 'U2R Attack', severity: 'high', source: '172.16.0.45', confidence: 96.4, status: 'blocked' },
        { id: 10, time: '2026-01-09 08:47:22', type: 'Probe', severity: 'low', source: '192.168.1.234', confidence: 82.1, status: 'logged' },
    ];

    const filteredThreats = threats.filter(threat => {
        const matchesSearch = threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            threat.source.includes(searchTerm);
        const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
        return matchesSearch && matchesSeverity;
    });

    const severityConfig = {
        critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🔴' },
        high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: '🟠' },
        medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: '🟡' },
        low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '🔵' }
    };

    const statusConfig = {
        blocked: { color: 'text-red-400', bg: 'bg-red-500/20' },
        monitored: { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        logged: { color: 'text-blue-400', bg: 'bg-blue-500/20' }
    };

    return (
        <div className="main-content">
            {/* Header */}
            <header className="mb-8">
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                    Threat Log
                </h2>
                <p className="text-gray-400 text-lg">Comprehensive threat history and security alerts</p>
            </header>

            {/* Summary Cards */}
            <div className="dashboard-grid mb-8">
                <StatCard title="Total Threats" value={threats.length} icon="🛡️" color="red" gridSpan={3} />
                <StatCard title="Blocked" value={threats.filter(t => t.status === 'blocked').length} icon="🚫" color="orange" gridSpan={3} />
                <StatCard title="Critical" value={threats.filter(t => t.severity === 'critical').length} icon="⚠️" color="red" gridSpan={3} />
                <StatCard title="Avg Confidence" value="94.3%" icon="🎯" color="green" gridSpan={3} />
            </div>

            {/* Filters and Search */}
            <div className="glass-panel p-6 mb-6">
                <div className="flex gap-4 items-center flex-wrap">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by threat type or IP address..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Severity Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                        >
                            <option value="all">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Threat Table */}
            <div className="glass-panel card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="p-4 font-semibold">Timestamp</th>
                                <th className="p-4 font-semibold">Threat Type</th>
                                <th className="p-4 font-semibold">Severity</th>
                                <th className="p-4 font-semibold">Source IP</th>
                                <th className="p-4 font-semibold">Confidence</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredThreats.map((threat) => (
                                <tr key={threat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-500" />
                                            <span className="font-mono text-sm text-gray-300">{threat.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={16} className={severityConfig[threat.severity].color} />
                                            <span className="font-semibold">{threat.type}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${severityConfig[threat.severity].bg} ${severityConfig[threat.severity].border} ${severityConfig[threat.severity].color}`}>
                                            <span>{severityConfig[threat.severity].icon}</span>
                                            {threat.severity.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-mono text-sm text-gray-300">{threat.source}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent"
                                                    style={{ width: `${threat.confidence}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold">{threat.confidence}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusConfig[threat.status].bg} ${statusConfig[threat.status].color}`}>
                                            {threat.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredThreats.length === 0 && (
                        <div className="text-center py-12">
                            <Shield size={48} className="mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400">No threats found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, gridSpan = 3 }) => {
    const colorClasses = {
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
    };

    return (
        <div className="glass-panel card" style={{ gridColumn: `span ${gridSpan}` }}>
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">{title}</div>
                    <div className={`text-4xl font-black ${colorClasses[color]?.split(' ')[0] || 'text-white'}`}>
                        {value}
                    </div>
                </div>
                <div className="text-5xl opacity-50">{icon}</div>
            </div>
        </div>
    );
};

export default ThreatLog;
