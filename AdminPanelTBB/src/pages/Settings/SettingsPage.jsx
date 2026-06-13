
import React, { useState } from 'react';
import {
  Store, User, Palette, Sun, Moon, LogOut,
  Trash2, Pencil, X, Lock, Upload, Zap, Eye, EyeOff,Truck
} from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader/PageHeader';
import FormInput from '../../components/common/Input/FormInput';
import Button from '../../components/common/Button/Button';
import { useSettings } from '../../context/SettingsContext';
import './SettingsPage.css';

// ── Small toast notification ───────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`settings-toast settings-toast--${type}`}>{message}</div>
);

// ── Confirm Modal for destructive actions ──────────────────────────────────
const ConfirmModal = ({ title, description, onConfirm, onCancel, loading, requirePassword }) => {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h3 className="settings-modal-title">{title}</h3>
        <p className="settings-modal-desc">{description}</p>
        {requirePassword && (
          <div className="settings-modal-pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="settings-modal-input"
            />
            <button
              type="button"
              className="settings-modal-eye"
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}
        <div className="settings-modal-actions">
          <Button variant="ghost" size="small" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => onConfirm(password)}
            disabled={loading || (requirePassword && !password)}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Change Password Modal ──────────────────────────────────────────────────
const ChangePasswordModal = ({ onConfirm, onCancel, loading }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = () => {
    if (form.newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    setValidationError('');
    onConfirm({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  const toggle = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h3 className="settings-modal-title">Change Password</h3>

        {['current', 'new', 'confirm'].map((key) => {
          const labels = { current: 'Current Password', new: 'New Password', confirm: 'Confirm New Password' };
          const fields = { current: 'currentPassword', new: 'newPassword', confirm: 'confirmPassword' };
          return (
            <div key={key} className="settings-modal-pw-wrap">
              <input
                type={show[key] ? 'text' : 'password'}
                placeholder={labels[key]}
                value={form[fields[key]]}
                onChange={(e) => setForm((p) => ({ ...p, [fields[key]]: e.target.value }))}
                className="settings-modal-input"
              />
              <button type="button" className="settings-modal-eye" onClick={() => toggle(key)}>
                {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          );
        })}

        {validationError && <p className="settings-modal-error">{validationError}</p>}

        <div className="settings-modal-actions">
          <Button variant="ghost" size="small" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="primary" size="small" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const {
    settings,
    updateSettings,
    updateAdminProfile,
    changePassword,
    logout,
    deleteAccount,
    toggleCOD,
    loading,
  } = useSettings();

  const [editingSection, setEditingSection] = useState(null);
  const [draft, setDraft] = useState({});
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // 'logout' | 'delete' | 'password'

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Edit helpers ──────────────────────────────────────────────────────────
  const startEdit = (section) => {
    setDraft({ ...settings[section] });
    setEditingSection(section);
  };

  const cancelEdit = () => {
    setDraft({});
    setEditingSection(null);
  };

  const updateDraft = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));
  const isEditing = (section) => editingSection === section;

  // ── Save restaurant (local only — wire to backend when restaurant API ready) ──
  const saveRestaurant = () => {
    updateSettings('restaurant', draft);
    setEditingSection(null);
    setDraft({});
    showToast('Restaurant info updated');
  };

  // ── Save admin profile → API ──────────────────────────────────────────────
  const saveAdmin = async () => {
    const result = await updateAdminProfile({ name: draft.name, email: draft.email });
    if (result.success) {
      setEditingSection(null);
      setDraft({});
      showToast('Admin profile updated');
    } else {
      showToast(result.message, 'error');
    }
  };

  // ── Change password → API ─────────────────────────────────────────────────
  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    const result = await changePassword({ currentPassword, newPassword });
    setModal(null);
    if (result.success) {
      showToast('Password changed successfully');
    } else {
      showToast(result.message, 'error');
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setModal(null);
    await logout();
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async (password) => {
    const result = await deleteAccount({ password });
    if (!result.success) {
      setModal(null);
      showToast(result.message, 'error');
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="settings-page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {modal === 'password' && (
        <ChangePasswordModal
          onConfirm={handleChangePassword}
          onCancel={() => setModal(null)}
          loading={loading}
        />
      )}
      {modal === 'logout' && (
        <ConfirmModal
          title="Logout?"
          description="Are you sure you want to log out of the admin panel?"
          onConfirm={handleLogout}
          onCancel={() => setModal(null)}
          loading={loading}
          requirePassword={false}
        />
      )}
      {modal === 'delete' && (
        <ConfirmModal
          title="Delete Account"
          description="This will permanently delete your account and all data. This cannot be undone. Enter your password to confirm."
          onConfirm={handleDeleteAccount}
          onCancel={() => setModal(null)}
          loading={loading}
          requirePassword={true}
        />
      )}

      <PageHeader title="Settings" subtitle="Manage your restaurant, account and preferences." />

      <div className="settings-grid-layout">
        {/* ── Restaurant ── */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon restaurant"><Store /></div>
            <h3>Restaurant</h3>
            <button
              className="settings-edit-btn"
              onClick={() => isEditing('restaurant') ? cancelEdit() : startEdit('restaurant')}
            >
              {isEditing('restaurant') ? <><X /> Cancel</> : <><Pencil /> Edit</>}
            </button>
          </div>

          {!isEditing('restaurant') ? (
            <div className="settings-section-body">
              <div className="settings-logo-row">
                <div className="settings-avatar">
                  {settings.restaurant.logo
                    ? <img src={settings.restaurant.logo} alt="Logo" />
                    : getInitials(settings.restaurant.name)}
                </div>
                <div className="settings-info-stack">
                  <span className="settings-info-name">{settings.restaurant.name}</span>
                  <span className="settings-info-detail">{settings.restaurant.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="settings-section-body">
              <FormInput
                label="Restaurant Name"
                value={draft.name || ''}
                onChange={(e) => updateDraft('name', e.target.value)}
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={draft.phone || ''}
                onChange={(e) => updateDraft('phone', e.target.value)}
              />
              <div className="settings-logo-upload">
                <span className="settings-upload-label">Logo</span>
                <label className="settings-upload-trigger">
                  <Upload /> Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateDraft('logo', URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
              <div className="settings-inline-actions">
                <Button variant="primary" size="small" onClick={saveRestaurant}>Save</Button>
                <Button variant="ghost" size="small" onClick={cancelEdit}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Admin ── */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon admin"><User /></div>
            <h3>Admin</h3>
            <button
              className="settings-edit-btn"
              onClick={() => isEditing('admin') ? cancelEdit() : startEdit('admin')}
            >
              {isEditing('admin') ? <><X /> Cancel</> : <><Pencil /> Edit</>}
            </button>
          </div>

          {!isEditing('admin') ? (
            <div className="settings-section-body">
              <div className="settings-value-row">
                <span className="settings-label">NAME</span>
                <span className="settings-value">{settings.admin.name}</span>
              </div>
              <div className="settings-value-row">
                <span className="settings-label">EMAIL</span>
                <span className="settings-value">{settings.admin.email}</span>
              </div>
              <button
                className="settings-text-btn"
                type="button"
                onClick={() => setModal('password')}
              >
                <Lock /> Change Password
              </button>
            </div>
          ) : (
            <div className="settings-section-body">
              <FormInput
                label="Name"
                value={draft.name || ''}
                onChange={(e) => updateDraft('name', e.target.value)}
              />
              <FormInput
                label="Email"
                type="email"
                value={draft.email || ''}
                onChange={(e) => updateDraft('email', e.target.value)}
              />
              <div className="settings-inline-actions">
                <Button variant="primary" size="small" onClick={saveAdmin} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" size="small" onClick={cancelEdit}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Theme ── */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon theme"><Palette /></div>
            <h3>Theme</h3>
          </div>
          <div className="settings-section-body">
            <div className="theme-toggle-group">
              <button
                type="button"
                className={`theme-toggle-btn ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => updateSettings('theme', 'light')}
              >
                <Sun /> Light
              </button>
              <button
                type="button"
                className={`theme-toggle-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => updateSettings('theme', 'dark')}
              >
                <Moon /> Dark
              </button>
            </div>
          </div>
        </div>

        {/* ── Cash on Delivery ── */}
<div className="settings-section">
  <div className="settings-section-header">
    <div className="settings-section-icon theme">
      <Truck />
    </div>
    <h3>Cash on Delivery</h3>
  </div>
  <div className="settings-section-body">
    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 12px' }}>
      {settings.codEnabled
        ? 'COD is enabled. Customers can pay cash on delivery.'
        : 'COD is disabled. Customers must pay online.'}
    </p>
    <div className="theme-toggle-group">
      <button
        type="button"
        className={`theme-toggle-btn ${settings.codEnabled ? 'active' : ''}`}
        onClick={async () => {
          const result = await toggleCOD(true);
          if (result.success) showToast('COD enabled');
          else showToast(result.message, 'error');
        }}
        disabled={loading}
      >
        <Truck size={14} /> Enable
      </button>
      <button
        type="button"
        className={`theme-toggle-btn ${!settings.codEnabled ? 'active' : ''}`}
        onClick={async () => {
          const result = await toggleCOD(false);
          if (result.success) showToast('COD disabled');
          else showToast(result.message, 'error');
        }}
        disabled={loading}
      >
        <X size={14} /> Disable
      </button>
    </div>
  </div>
</div>

        {/* ── Actions ── */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon actions"><Zap /></div>
            <h3>Actions</h3>
          </div>
          <div className="settings-section-body">
            <div className="settings-actions-stack">
              <Button
                variant="primary"
                size="small"
                onClick={() => showToast('All changes saved')}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="small"
                icon={LogOut}
                onClick={() => setModal('logout')}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="settings-danger-zone">
        <div className="settings-danger-content">
          <div>
            <h4>Danger Zone</h4>
            <p>Permanently delete your account and all data. This cannot be undone.</p>
          </div>
          <Button variant="danger" size="small" icon={Trash2} onClick={() => setModal('delete')}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;