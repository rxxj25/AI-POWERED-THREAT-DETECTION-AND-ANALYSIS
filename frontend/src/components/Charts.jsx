import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#94a3b8',
                font: { size: 12, family: 'Inter', weight: '600' },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(2);
                    }
                    return label;
                }
            }
        }
    }
};

export const TrafficChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.time),
        datasets: [
            {
                label: 'Traffic Volume',
                data: data.map(d => d.value),
                borderColor: '#3b82f6',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
                    return gradient;
                },
                tension: 0.4,
                borderWidth: 3,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#3b82f6',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2,
            },
            {
                label: 'Anomalies',
                data: data.map(d => d.isAnomaly ? d.value : null),
                borderColor: '#ef4444',
                backgroundColor: '#ef4444',
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false,
                pointStyle: 'circle',
                pointBorderWidth: 2,
                pointBorderColor: '#ffffff',
            }
        ],
    };

    const options = {
        ...commonOptions,
        scales: {
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.08)',
                    drawBorder: false
                },
                ticks: {
                    color: '#64748b',
                    font: { size: 11, family: 'Inter' },
                    maxRotation: 0
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.08)',
                    drawBorder: false
                },
                ticks: {
                    color: '#64748b',
                    font: { size: 11, family: 'Inter' }
                },
                beginAtZero: true
            }
        }
    };

    return <Line options={options} data={chartData} />;
};

export const DistributionChart = ({ stats }) => {
    const data = {
        labels: ['Normal Traffic', 'Threats Detected'],
        datasets: [
            {
                data: [stats.normal, stats.anomaly],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 3,
                hoverOffset: 8,
                hoverBorderWidth: 4
            },
        ],
    };

    const options = {
        ...commonOptions,
        cutout: '75%',
        plugins: {
            ...commonOptions.plugins,
            legend: {
                ...commonOptions.plugins.legend,
                position: 'bottom',
            },
            tooltip: {
                ...commonOptions.plugins.tooltip,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return <Doughnut data={data} options={options} />;
};
