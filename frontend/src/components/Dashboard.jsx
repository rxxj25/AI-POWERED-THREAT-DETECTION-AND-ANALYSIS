import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, AlertOctagon, ShieldCheck, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { TrafficChart, DistributionChart } from './Charts';

const API_URL = 'http://localhost:8000';

const Dashboard = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ normal: 0, anomaly: 0 });
    const [currentStatus, setCurrentStatus] = useState('SAFE');
    const [modelAccuracy, setModelAccuracy] = useState('...');
    const [latestThreat, setLatestThreat] = useState(null);

    useEffect(() => {
        axios.get(API_URL).then(res => setModelAccuracy(res.data.model_accuracy)).catch(e => console.error(e));
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(runSimulationStep, 2000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const runSimulationStep = async () => {
        try {
            const simRes = await axios.get(`${API_URL}/simulate`);
            const features = simRes.data.features;

            const predRes = await axios.post(`${API_URL}/predict`, { features });
            const result = predRes.data;

            const newPoint = {
                time: new Date().toLocaleTimeString(),
                value: Math.random() * 100,
                isAnomaly: result.prediction !== 'normal',
                details: result
            };

            setHistory(prev => [...prev.slice(-19), newPoint]);

            if (result.prediction === 'normal') {
                setStats(s => ({ ...s, normal: s.normal + 1 }));
                setCurrentStatus('SAFE');
            } else {
                setStats(s => ({ ...s, anomaly: s.anomaly + 1 }));
                setCurrentStatus('THREAT DETECTED');
                setLatestThreat(newPoint);
            }

        } catch (error) {
            console.error("Simulation error", error);
            setIsRunning(false);
        }
    };


    const totalPackets = stats.normal + stats.anomaly;
    const threatPercentage = totalPackets > 0 ? ((stats.anomaly / totalPackets) * 100).toFixed(1) : 0;

    return (
        <div className="main-content">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Network Security Center
                    </h2>
                    <p className="text-gray-400 text-lg">Real-time AI-powered threat detection and analysis</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="glass-panel px-6 py-3 flex items-center gap-3">
                        <Activity size={20} className="text-accent" />
                        <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Model Accuracy</div>
                            <div className="text-2xl font-bold text-accent">
                                {typeof modelAccuracy === 'number' ? (modelAccuracy * 100).toFixed(2) + '%' : modelAccuracy}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                    >
                        {isRunning ? (
                            <>
                                <Pause size={20} />
                                <span>Stop Monitoring</span>
                            </>
                        ) : (
                            <>
                                <Play size={20} />
                                <span>Start Monitoring</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Status Banner */}
            <div
                className={`glass-panel p-8 mb-8 flex items-center justify-between transition-all duration-500 ${currentStatus === 'SAFE'
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-red-500/30 bg-red-500/10'
                    }`}
                style={{
                    boxShadow: currentStatus === 'SAFE'
                        ? '0 0 30px rgba(16, 185, 129, 0.2)'
                        : '0 0 30px rgba(239, 68, 68, 0.3)'
                }}
            >
                <div className="flex items-center gap-6">
                    {currentStatus === 'SAFE' ? (
                        <div className="relative">
                            <ShieldCheck size={64} className="text-green-500" />
                            <div className="absolute inset-0 bg-green-500 opacity-20 blur-xl rounded-full"></div>
                        </div>
                    ) : (
                        <div className="relative">
                            <AlertOctagon size={64} className="text-red-500 animate-bounce" />
                            <div className="absolute inset-0 bg-red-500 opacity-20 blur-xl rounded-full"></div>
                        </div>
                    )}
                    <div>
                        <div className="text-sm tracking-widest text-gray-400 uppercase mb-2">System Status</div>
                        <div className={`text-5xl font-black ${currentStatus === 'SAFE' ? 'text-green-500' : 'text-red-500'}`}>
                            {currentStatus}
                        </div>
                        {latestThreat && currentStatus !== 'SAFE' && (
                            <div className="text-sm text-red-300 mt-2">
                                Last detected: {latestThreat.time}
                                <span className="ml-3">Confidence: {(latestThreat.details.confidence * 100).toFixed(1)}%</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-1">{totalPackets}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Total Analyzed</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-4xl font-bold mb-1 ${threatPercentage > 10 ? 'text-red-400' : 'text-green-400'}`}>
                            {threatPercentage}%
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Threat Rate</div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
                {/* Traffic Graph - Full Width on Top */}
                <div className="glass-panel card" style={{ gridColumn: 'span 12' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={24} className="text-primary" />
                            <h3 className="text-xl font-bold">Network Traffic Analysis</h3>
                        </div>
                        <div className="text-sm text-gray-400">Last 20 data points</div>
                    </div>
                    <div className="h-64">
                        <TrafficChart data={history} />
                    </div>
                </div>

                {/* Stats Cards Row */}
                <StatCard
                    title="Normal Traffic"
                    value={stats.normal}
                    icon={<ShieldCheck size={28} />}
                    color="green"
                    gridSpan={4}
                />
                <StatCard
                    title="Threats Detected"
                    value={stats.anomaly}
                    icon={<AlertTriangle size={28} />}
                    color="red"
                    gridSpan={4}
                />
                <StatCard
                    title="Detection Rate"
                    value={`${threatPercentage}%`}
                    icon={<Activity size={28} />}
                    color="blue"
                    gridSpan={4}
                />

                {/* Distribution Chart */}
                <div className="glass-panel card" style={{ gridColumn: 'span 5' }}>
                    <h3 className="text-lg font-semibold mb-6">Attack Distribution</h3>
                    <div className="h-48 flex justify-center items-center">
                        <DistributionChart stats={stats} />
                    </div>
                    <div className="mt-8 space-y-4">
                        <StatRow label="Total Packets" value={totalPackets} mono />
                        <StatRow label="Normal Traffic" value={stats.normal} color="text-green-400" mono />
                        <StatRow label="Intrusions" value={stats.anomaly} color="text-red-400" mono />
                    </div>
                </div>

                {/* Activity Log */}
                <div className="glass-panel card" style={{ gridColumn: 'span 7' }}>
                    <h3 className="text-lg font-semibold mb-6">Recent Activity Log</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                    <th className="p-3 font-semibold">Timestamp</th>
                                    <th className="p-3 font-semibold">Status</th>
                                    <th className="p-3 font-semibold">Confidence</th>
                                    <th className="p-3 font-semibold">Classification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.slice().reverse().slice(0, 8).map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono text-sm text-gray-300">{item.time}</td>
                                        <td className="p-3">
                                            <span className={`status-badge ${item.isAnomaly ? 'status-danger' : 'status-safe'}`}>
                                                {item.isAnomaly ? 'THREAT' : 'NORMAL'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item.isAnomaly ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${item.details.confidence * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {(item.details.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-gray-400 capitalize">
                                            {item.details.prediction}
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">
                                            <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
                                            <div>No activity yet. Start monitoring to begin analysis.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, gridSpan = 3 }) => {
    const colorClasses = {
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <div className="glass-panel card" style={{ gridColumn: `span ${gridSpan}` }}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-3">{title}</div>
                    <div className={`text-5xl font-black ${colorClasses[color].split(' ')[0]}`}>
                        {value}
                    </div>
                </div>
                <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const StatRow = ({ label, value, color = 'text-white', mono = false }) => (
    <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={`text-xl font-bold ${color} ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
);

export default Dashboard;
