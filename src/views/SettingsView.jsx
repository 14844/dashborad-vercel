import React, { useState } from 'react';

const SettingsView = ({ settings, onSave }) => {
    const [localName, setLocalName] = useState(settings.dashboardName);
    const [localLanguage, setLocalLanguage] = useState(settings.language);
    const [localSound, setLocalSound] = useState(settings.notificationSound);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        onSave({
            dashboardName: localName,
            language: localLanguage,
            notificationSound: localSound
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="settings-view">
            <section className="welcome-section">
                <h1>Settings</h1>
                <p>Manage your account and application preferences.</p>
            </section>

            <div className="card-container settings-card" style={{ maxWidth: '600px' }}>
                <div className="card-header">
                    <h2>General Settings</h2>
                </div>
                <div className="settings-body" style={{ padding: '20px' }}>
                    <div className="settings-item" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Dashboard Name</label>
                        <input
                            type="text"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            className="settings-input"
                            placeholder="Enter dashboard name..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--bg-sidebar)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div className="settings-item">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Language</label>
                            <select
                                value={localLanguage}
                                onChange={(e) => setLocalLanguage(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-sidebar)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            >
                                <option value="English">English</option>
                                <option value="Arabic">Arabic (العربية)</option>
                            </select>
                        </div>

                        <div className="settings-item">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Notification Sound</label>
                            <select
                                value={localSound}
                                onChange={(e) => setLocalSound(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-sidebar)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            >
                                <option value="Tick">Tick (Modern)</option>
                                <option value="Bell">Classic Bell</option>
                                <option value="Chime">Digital Chime</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                        <button
                            className="btn-primary"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                        {isSaved && (
                            <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '500' }}>
                                ✓ Settings saved!
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
