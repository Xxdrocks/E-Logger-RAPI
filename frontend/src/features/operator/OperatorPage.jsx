import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f0f4ff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    bgBlob1: {
        position: 'absolute',
        top: '-160px',
        right: '-160px',
        width: '384px',
        height: '384px',
        backgroundColor: 'rgba(199,210,254,0.4)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
    },
    bgBlob2: {
        position: 'absolute',
        bottom: '-128px',
        left: '-128px',
        width: '320px',
        height: '320px',
        backgroundColor: 'rgba(186,230,253,0.4)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
    },
    container: {
        position: 'relative',
        zIndex: 10,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 24px',
    },
    header: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    logoBox: {
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
        flexShrink: 0,
    },
    appTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#0f172a',
        margin: 0,
        letterSpacing: '-0.02em',
    },
    appSubtitle: {
        fontSize: '12px',
        color: '#64748b',
        marginTop: '3px',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        border: '1px solid #e2e8f0',
        color: '#475569',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.15s',
        backdropFilter: 'blur(8px)',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(226,232,240,0.8)',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(148,163,184,0.2)',
        padding: '28px',
        marginBottom: '24px',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f1f5f9',
    },
    iconBox: {
        width: '36px',
        height: '36px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(99,102,241,0.25)',
        flexShrink: 0,
    },
    cardTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    cardSubtitle: {
        fontSize: '12px',
        color: '#94a3b8',
        marginTop: '2px',
    },
    formRow: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
    },
    fieldWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: '140px',
    },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: 'rgba(248,250,252,0.8)',
        color: '#1e293b',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        width: '100%',
    },
    btnPrimary: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 22px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    },
    btnSecondary: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '12px',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        fontSize: '14px',
        fontWeight: '600',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
    },
    th: {
        padding: '12px 20px',
        textAlign: 'left',
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        backgroundColor: 'rgba(248,250,252,0.8)',
        borderBottom: '1px solid #f1f5f9',
        whiteSpace: 'nowrap',
    },
    td: {
        padding: '12px 20px',
        borderBottom: '1px solid #f8fafc',
        verticalAlign: 'middle',
    },
    badgePurple: {
        fontFamily: 'monospace',
        fontWeight: '700',
        color: '#7c3aed',
        backgroundColor: '#f5f3ff',
        border: '1px solid #ddd6fe',
        padding: '3px 10px',
        borderRadius: '8px',
        fontSize: '13px',
    },
    btnEdit: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        borderRadius: '8px',
        backgroundColor: '#eff6ff',
        color: '#3b82f6',
        border: '1px solid #bfdbfe',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.15s',
        marginRight: '6px',
    },
    btnDeleteSm: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#ef4444',
        border: '1px solid #fecaca',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    emptyCell: {
        padding: '48px 20px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '13px',
    },
    toast: {
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        padding: '10px 20px',
        borderRadius: '999px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#0f172a',
        margin: '0 0 4px',
    },
    modalSubtitle: {
        fontSize: '13px',
        color: '#64748b',
        margin: '0 0 24px',
    },
    modalActions: {
        display: 'flex',
        gap: '10px',
        marginTop: '24px',
        justifyContent: 'flex-end',
    },
};

function OperatorPage() {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ ncs: '', nama: '' });
    const [focusedField, setFocusedField] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ ncs: '', nama: '' });
    const [deletingId, setDeletingId] = useState(null);

    const showToast = (message, color = '#10b981') => {
        setToast({ message, color });
        setTimeout(() => setToast(null), 2500);
    };

    const fetchOperators = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/operators');
            setOperators(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOperators();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/operators', form);
            setForm({ ncs: '', nama: '' });
            showToast('✓ Operator berhasil ditambahkan');
            fetchOperators();
        } catch (err) {
            const msg = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(', ')
                : 'Terjadi kesalahan';
            showToast('✕ ' + msg, '#ef4444');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (op) => {
        setEditTarget(op);
        setEditForm({ ncs: op.ncs, nama: op.nama });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/operators/${editTarget.id}`, editForm);
            showToast('✓ Operator berhasil diupdate');
            setEditTarget(null);
            fetchOperators();
        } catch (err) {
            const msg = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(', ')
                : 'Terjadi kesalahan';
            showToast('✕ ' + msg, '#ef4444');
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/operators/${id}`);
            showToast('✓ Operator berhasil dihapus');
            fetchOperators();
        } catch (err) {
            showToast('✕ Gagal menghapus', '#ef4444');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.bgBlob1} />
            <div style={styles.bgBlob2} />

            {toast && (
                <div style={{ ...styles.toast, backgroundColor: toast.color }}>
                    {toast.message}
                </div>
            )}

            {editTarget && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <p style={styles.modalTitle}>Edit Operator</p>
                        <p style={styles.modalSubtitle}>Ubah data NCS dan nama operator</p>
                        <form onSubmit={handleUpdate}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={styles.label}>📡 NCS</label>
                                    <input
                                        value={editForm.ncs}
                                        onChange={(e) => setEditForm({ ...editForm, ncs: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            borderColor: '#818cf8',
                                            boxShadow: '0 0 0 3px rgba(129,140,248,0.15)',
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>👤 Nama</label>
                                    <input
                                        value={editForm.nama}
                                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            borderColor: '#818cf8',
                                            boxShadow: '0 0 0 3px rgba(129,140,248,0.15)',
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => setEditTarget(null)}
                                    style={styles.btnSecondary}
                                >
                                    Batal
                                </button>
                                <button type="submit" style={styles.btnPrimary}>
                                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.logoRow}>
                        <div style={styles.logoBox}>
                            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 style={styles.appTitle}>Manajemen Operator</h1>
                            <p style={styles.appSubtitle}>Kelola data NCS dan nama operator</p>
                        </div>
                    </div>

                    <a href="/" style={styles.backBtn}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Log
                    </a>
                </div>

                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={{ ...styles.iconBox, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <p style={styles.cardTitle}>Tambah Operator Baru</p>
                            <p style={styles.cardSubtitle}>Input NCS dan nama operator</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.formRow}>
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>📡 NCS</label>
                                <input
                                    placeholder="Contoh: JZ09VAG"
                                    value={form.ncs}
                                    onChange={(e) => setForm({ ...form, ncs: e.target.value })}
                                    onFocus={() => setFocusedField('ncs')}
                                    onBlur={() => setFocusedField(null)}
                                    style={{
                                        ...styles.input,
                                        borderColor: focusedField === 'ncs' ? '#818cf8' : '#e2e8f0',
                                        backgroundColor: focusedField === 'ncs' ? 'white' : 'rgba(248,250,252,0.8)',
                                        boxShadow: focusedField === 'ncs' ? '0 0 0 3px rgba(129,140,248,0.15)' : 'none',
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ ...styles.fieldWrapper, flex: 2 }}>
                                <label style={styles.label}>👤 Nama Operator</label>
                                <input
                                    placeholder="Contoh: Ahmad Fauzi"
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    onFocus={() => setFocusedField('nama')}
                                    onBlur={() => setFocusedField(null)}
                                    style={{
                                        ...styles.input,
                                        borderColor: focusedField === 'nama' ? '#818cf8' : '#e2e8f0',
                                        backgroundColor: focusedField === 'nama' ? 'white' : 'rgba(248,250,252,0.8)',
                                        boxShadow: focusedField === 'nama' ? '0 0 0 3px rgba(129,140,248,0.15)' : 'none',
                                    }}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{ ...styles.btnPrimary, opacity: submitting ? 0.65 : 1 }}
                            >
                                <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                    <div style={{ ...styles.cardHeader, padding: '20px 28px', marginBottom: 0 }}>
                        <div style={{ ...styles.iconBox, background: 'linear-gradient(135deg, #334155, #0f172a)' }}>
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                        <div>
                            <p style={styles.cardTitle}>Daftar Operator</p>
                            <p style={styles.cardSubtitle}>{operators.length} operator terdaftar</p>
                        </div>
                    </div>

                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>NCS</th>
                                    <th style={styles.th}>Nama Operator</th>
                                    <th style={styles.th}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} style={styles.emptyCell}>
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : operators.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={styles.emptyCell}>
                                            Belum ada operator terdaftar
                                        </td>
                                    </tr>
                                ) : (
                                    operators.map((op, idx) => (
                                        <tr
                                            key={op.id}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245,243,255,0.5)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        >
                                            <td style={{ ...styles.td, color: '#94a3b8', fontSize: '12px', width: '40px' }}>
                                                {idx + 1}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.badgePurple}>{op.ncs}</span>
                                            </td>
                                            <td style={{ ...styles.td, fontWeight: '600', color: '#334155' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{
                                                        width: '26px',
                                                        height: '26px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        flexShrink: 0,
                                                    }}>
                                                        {op.nama[0].toUpperCase()}
                                                    </div>
                                                    {op.nama}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <button
                                                    onClick={() => handleEdit(op)}
                                                    style={styles.btnEdit}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                                                >
                                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(op.id)}
                                                    disabled={deletingId === op.id}
                                                    style={{ ...styles.btnDeleteSm, opacity: deletingId === op.id ? 0.5 : 1 }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                                >
                                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                    E-Logger System · {new Date().getFullYear()} · Manajemen Operator
                </footer>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
            `}</style>
        </div>
    );
}

export default OperatorPage;