import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Clock, Target, BarChart3, PieChart } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const Analytics = () => {
    // Generate mock historical data
    const generateHistoricalData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            day,
            normal: Math.floor(Math.random() * 500) + 800,
            threats: Math.floor(Math.random() * 100) + 20
        }));
    };

    const [historicalData] = useState(generateHistoricalData());

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { size: 12, family: 'Inter', weight: '600' },
                    padding: 20,
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderWidth: 1,
                padding: 12
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(148, 163, 184, 0.08)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 11, family: 'Inter' } }
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.08)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 11, family: 'Inter' } },
                beginAtZero: true
            }
        }
    };

    // Historical Trends Line Chart
    const trendData = {
        labels: historicalData.map(d => d.day),
        datasets: [
            {
                label: 'Normal Traffic',
                data: historicalData.map(d => d.normal),
                borderColor: '#10b981',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                borderWidth: 3
            },
            {
                label: 'Threats Detected',
                data: historicalData.map(d => d.threats),
                borderColor: '#ef4444',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
                    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.01)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }
        ]
    };

    // Attack Type Distribution Bar Chart
    const attackTypes = {
        labels: ['DoS', 'Probe', 'R2L', 'U2R', 'Normal'],
        datasets: [{
            label: 'Incidents',
            data: [245, 187, 93, 45, 1830],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(249, 115, 22, 0.8)',
                'rgba(234, 88, 12, 0.8)',
                'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
                '#ef4444',
                '#f59e0b',
                '#f97316',
                '#ea580c',
                '#10b981'
            ],
            borderWidth: 2
        }]
    };

    // Time Distribution Doughnut Chart
    const timeDistribution = {
        labels: ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-24)', 'Night (0-6)'],
        datasets: [{
            data: [320, 450, 280, 150],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(167, 139, 250, 0.8)',
                'rgba(99, 102, 241, 0.8)'
            ],
            borderColor: ['#3b82f6', '#8b5cf6', '#a78bfa', '#6366f1'],
            borderWidth: 3,
            hoverOffset: 8
        }]
    };

    const doughnutOptions = {
        ...chartOptions,
        cutout: '70%',
        scales: {}
    };

    return (
        <div className="main-content">
            {/* Header */}
            <header className="mb-8">
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Analytics Dashboard
                </h2>
                <p className="text-gray-400 text-lg">Historical data and threat intelligence analysis</p>
            </header>

            {/* Summary Stats */}
            <div className="dashboard-grid mb-8">
                <StatCard
                    title="Total Analyzed"
                    value="12.4K"
                    icon={<BarChart3 size={28} />}
                    color="blue"
                    change="+12.5%"
                    gridSpan={3}
                />
                <StatCard
                    title="Avg Response Time"
                    value="142ms"
                    icon={<Clock size={28} />}
                    color="green"
                    change="-8.3%"
                    gridSpan={3}
                />
                <StatCard
                    title="Detection Rate"
                    value="98.7%"
                    icon={<Target size={28} />}
                    color="purple"
                    change="+2.1%"
                    gridSpan={3}
                />
                <StatCard
                    title="False Positives"
                    value="1.3%"
                    icon={<Activity size={28} />}
                    color="orange"
                    change="-0.5%"
                    gridSpan={3}
                />
            </div>

            {/* Charts Grid */}
            <div className="dashboard-grid">
                {/* Historical Trends */}
                <div className="glass-panel card" style={{ gridColumn: 'span 8' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={24} className="text-primary" />
                            <h3 className="text-xl font-bold">7-Day Trend Analysis</h3>
                        </div>
                        <span className="text-sm text-gray-400">Last 7 days</span>
                    </div>
                    <div className="h-80">
                        <Line data={trendData} options={chartOptions} />
                    </div>
                </div>

                {/* Time Distribution */}
                <div className="glass-panel card" style={{ gridColumn: 'span 4' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <Clock size={24} className="text-accent" />
                        <h3 className="text-xl font-bold">Attack Time Distribution</h3>
                    </div>
                    <div className="h-80 flex items-center justify-center">
                        <Doughnut data={timeDistribution} options={doughnutOptions} />
                    </div>
                </div>

                {/* Attack Types */}
                <div className="glass-panel card" style={{ gridColumn: 'span 12' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <PieChart size={24} className="text-warning" />
                        <h3 className="text-xl font-bold">Attack Type Distribution</h3>
                    </div>
                    <div className="h-64">
                        <Bar data={attackTypes} options={chartOptions} />
                    </div>
                </div>

                {/* Top Insights */}
                <div className="glass-panel card" style={{ gridColumn: 'span 6' }}>
                    <h3 className="text-lg font-semibold mb-6">Key Insights</h3>
                    <div className="space-y-4">
                        <InsightRow
                            icon="🔴"
                            text="DoS attacks increased by 15% this week"
                            severity="high"
                        />
                        <InsightRow
                            icon="🟡"
                            text="Peak attack times: 3-5 PM daily"
                            severity="medium"
                        />
                        <InsightRow
                            icon="🟢"
                            text="Response time improved by 8% "
                            severity="low"
                        />
                        <InsightRow
                            icon="🔵"
                            text="98.7% of threats blocked successfully"
                            severity="info"
                        />
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="glass-panel card" style={{ gridColumn: 'span 6' }}>
                    <h3 className="text-lg font-semibold mb-6">Performance Metrics</h3>
                    <div className="space-y-5">
                        <MetricBar label="Detection Accuracy" value={98.7} color="green" />
                        <MetricBar label="System Uptime" value={99.9} color="blue" />
                        <MetricBar label="Threat Coverage" value={96.3} color="purple" />
                        <MetricBar label="Response Speed" value={94.5} color="cyan" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, change, gridSpan = 3 }) => {
    const colorClasses = {
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    };

    const isPositive = change?.startsWith('+');
    const isNegative = change?.startsWith('-');

    return (
        <div className="glass-panel card" style={{ gridColumn: `span ${gridSpan}` }}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
                {change && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400' :
                            isNegative ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                        }`}>
                        {change}
                    </span>
                )}
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">{title}</div>
            <div className={`text-4xl font-black ${colorClasses[color].split(' ')[0]}`}>
                {value}
            </div>
        </div>
    );
};

const InsightRow = ({ icon, text, severity }) => {
    const severityColors = {
        high: 'border-red-500/30 bg-red-500/5',
        medium: 'border-yellow-500/30 bg-yellow-500/5',
        low: 'border-green-500/30 bg-green-500/5',
        info: 'border-blue-500/30 bg-blue-500/5'
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${severityColors[severity]}`}>
            <span className="text-2xl">{icon}</span>
            <span className="text-sm text-gray-300">{text}</span>
        </div>
    );
};

const MetricBar = ({ label, value, color }) => {
    const colors = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        cyan: 'bg-cyan-500'
    };

    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-bold text-white">{value}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colors[color]} transition-all duration-1000`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Analytics;
