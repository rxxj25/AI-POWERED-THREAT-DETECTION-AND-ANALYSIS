import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Activity, Save, RotateCcw } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        // Notifications
        emailAlerts: true,
        criticalOnly: false,
        soundEnabled: true,

        // Security
        autoBlock: true,
        logAllTraffic: true,
        retentionDays: 30,

        // Display
        darkMode: true,
        animations: true,
        compactView: false,

        // Model
        confidenceThreshold: 85,
        scanInterval: 2000,
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        // Simulate save
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        setSettings({
            emailAlerts: true,
            criticalOnly: false,
            soundEnabled: true,
            autoBlock: true,
            logAllTraffic: true,
            retentionDays: 30,
            darkMode: true,
            animations: true,
            compactView: false,
            confidenceThreshold: 85,
            scanInterval: 2000,
        });
        setSaved(false);
    };

    return (
        <div className="main-content">
            {/* Header */}
            <header className="mb-8">
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    System Settings
                </h2>
                <p className="text-gray-400 text-lg">Configure your security preferences and system behavior</p>
            </header>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Notifications */}
                <SettingsSection icon={<Bell size={24} />} title="Notifications" color="blue">
                    <ToggleSetting
                        label="Email Alerts"
                        description="Receive email notifications for detected threats"
                        checked={settings.emailAlerts}
                        onChange={(val) => handleChange('emailAlerts', val)}
                    />
                    <ToggleSetting
                        label="Critical Threats Only"
                        description="Only notify for critical severity threats"
                        checked={settings.criticalOnly}
                        onChange={(val) => handleChange('criticalOnly', val)}
                    />
                    <ToggleSetting
                        label="Sound Notifications"
                        description="Play alert sound when threats are detected"
                        checked={settings.soundEnabled}
                        onChange={(val) => handleChange('soundEnabled', val)}
                    />
                </SettingsSection>

                {/* Security */}
                <SettingsSection icon={<Shield size={24} />} title="Security & Protection" color="red">
                    <ToggleSetting
                        label="Auto-Block Threats"
                        description="Automatically block detected malicious traffic"
                        checked={settings.autoBlock}
                        onChange={(val) => handleChange('autoBlock', val)}
                    />
                    <ToggleSetting
                        label="Log All Traffic"
                        description="Record all network traffic for analysis"
                        checked={settings.logAllTraffic}
                        onChange={(val) => handleChange('logAllTraffic', val)}
                    />
                    <SliderSetting
                        label="Data Retention Period"
                        description="Days to keep historical threat logs"
                        value={settings.retentionDays}
                        onChange={(val) => handleChange('retentionDays', val)}
                        min={7}
                        max={90}
                        step={1}
                        unit="days"
                    />
                </SettingsSection>

                {/* Display */}
                <SettingsSection icon={<Palette size={24} />} title="Display Preferences" color="purple">
                    <ToggleSetting
                        label="Dark Mode"
                        description="Use dark theme for the interface"
                        checked={settings.darkMode}
                        onChange={(val) => handleChange('darkMode', val)}
                    />
                    <ToggleSetting
                        label="Animations"
                        description="Enable smooth transitions and animations"
                        checked={settings.animations}
                        onChange={(val) => handleChange('animations', val)}
                    />
                    <ToggleSetting
                        label="Compact View"
                        description="Reduce spacing for more information density"
                        checked={settings.compactView}
                        onChange={(val) => handleChange('compactView', val)}
                    />
                </SettingsSection>

                {/* Model Configuration */}
                <SettingsSection icon={<Activity size={24} />} title="AI Model Configuration" color="green">
                    <SliderSetting
                        label="Confidence Threshold"
                        description="Minimum confidence level to flag as threat"
                        value={settings.confidenceThreshold}
                        onChange={(val) => handleChange('confidenceThreshold', val)}
                        min={50}
                        max={100}
                        step={5}
                        unit="%"
                    />
                    <SliderSetting
                        label="Scan Interval"
                        description="Time between network scans (in simulation mode)"
                        value={settings.scanInterval}
                        onChange={(val) => handleChange('scanInterval', val)}
                        min={1000}
                        max={5000}
                        step={500}
                        unit="ms"
                    />
                </SettingsSection>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
                <button onClick={handleSave} className="btn btn-primary">
                    <Save size={20} />
                    <span>Save Settings</span>
                </button>
                <button onClick={handleReset} className="btn bg-white/5 hover:bg-white/10 text-white border border-white/10">
                    <RotateCcw size={20} />
                    <span>Reset to Defaults</span>
                </button>
            </div>

            {/* Save Confirmation */}
            {saved && (
                <div className="mt-4 glass-panel p-4 border-green-500/30 bg-green-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-400 font-semibold">Settings saved successfully!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const SettingsSection = ({ icon, title, color, children }) => {
    const colorClasses = {
        blue: 'text-blue-500',
        red: 'text-red-500',
        purple: 'text-purple-500',
        green: 'text-green-500',
    };

    return (
        <div className="glass-panel card">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className={colorClasses[color]}>{icon}</div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className="space-y-5">
                {children}
            </div>
        </div>
    );
};

const ToggleSetting = ({ label, description, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <div className="font-semibold text-white mb-1">{label}</div>
                <div className="text-sm text-gray-400">{description}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/20'
                    }`}
            >
                <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'transform translate-x-6' : ''
                        }`}
                ></div>
            </button>
        </div>
    );
};

const SliderSetting = ({ label, description, value, onChange, min, max, step, unit }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="font-semibold text-white mb-1">{label}</div>
                    <div className="text-sm text-gray-400">{description}</div>
                </div>
                <div className="glass-panel px-4 py-2 min-w-[80px] text-center">
                    <span className="text-lg font-bold text-primary">{value}</span>
                    <span className="text-sm text-gray-400 ml-1">{unit}</span>
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
        </div>
    );
};

export default Settings;
