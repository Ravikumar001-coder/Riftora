import React, { useState } from 'react';
import { X, Shield, Trash2, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';

const AVAILABLE_ROLES = [
  'Super Admin',
  'Org Owner',
  'Org Admin',
  'Tournament Director',
  'Referee',
  'Broadcast Producer',
  'Team Captain',
  'Player',
  'Viewer',
  'Sponsor Representative'
];

export function ManageRolesDialog({ isOpen, onClose, user, onConfirm }) {
  const { user: currentUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedScope, setSelectedScope] = useState('Organization');
  const [scopeId, setScopeId] = useState('');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState(user?.roles || []);

  // Update local state when user changes
  React.useEffect(() => {
    if (user) {
      setRoles(user.roles || []);
      setSelectedRole('');
      setScopeId('');
      setError('');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleAddRole = () => {
    if (!selectedRole) {
      setError('Please select a role.');
      return;
    }

    // Validation rules
    if (selectedRole === 'Super Admin' && selectedScope !== 'Platform') {
      setError('Super Admin must have Platform scope.');
      return;
    }
    if (['Org Owner', 'Org Admin'].includes(selectedRole) && selectedScope !== 'Organization') {
      setError('This role requires an organization scope.');
      return;
    }
    if (['Team Captain', 'Player', 'Sponsor Representative'].includes(selectedRole) && !['Tournament', 'Team', 'Sponsor'].includes(selectedScope)) {
      setError('This role requires a tournament, team, or sponsor scope.');
      return;
    }
    if (selectedScope !== 'Platform' && !scopeId.trim()) {
      setError(`Please provide an ID/Name for the ${selectedScope} scope.`);
      return;
    }

    const newRole = {
      role: selectedRole,
      scope: selectedScope,
      ...(selectedScope === 'Organization' ? { organizationName: scopeId } : {}),
      ...(selectedScope === 'Tournament' ? { tournamentName: scopeId } : {})
    };

    setRoles([...roles, newRole]);
    setSelectedRole('');
    setScopeId('');
    setError('');
  };

  const handleRemoveRole = (indexToRemove) => {
    const roleToRemove = roles[indexToRemove];
    
    if (roleToRemove.role === 'Super Admin' && user.username === currentUser?.username) {
      setError('Your own platform administrator role cannot be removed from this screen.');
      return;
    }

    setRoles(roles.filter((_, idx) => idx !== indexToRemove));
    setError('');
  };

  const handleSave = () => {
    onConfirm(user.id, roles);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-blue-500/10">
            <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Manage Roles: {user.displayName}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            
            {/* Current Roles */}
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-4">Current Roles</h3>
              {roles.length === 0 ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center text-slate-500 text-sm">
                  This user has no assigned roles.
                </div>
              ) : (
                <div className="space-y-3">
                  {roles.map((role, idx) => {
                    const isOwnSuperAdmin = role.role === 'Super Admin' && user.username === currentUser?.username;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{role.role}</span>
                            <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                              {role.scope}
                            </span>
                          </div>
                          {(role.organizationName || role.tournamentName) && (
                            <p className="text-xs text-slate-500 mt-1">
                              Target: {role.organizationName || role.tournamentName}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleRemoveRole(idx)}
                          disabled={isOwnSuperAdmin}
                          className={`p-2 rounded-lg transition-colors ${
                            isOwnSuperAdmin 
                              ? 'text-slate-600 cursor-not-allowed' 
                              : 'text-red-400 hover:text-white hover:bg-red-500'
                          }`}
                          title={isOwnSuperAdmin ? "Cannot remove your own Super Admin role" : "Remove role"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add New Role */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-300 mb-4">Add Role</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Role</label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a role...</option>
                    {AVAILABLE_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Scope</label>
                  <select 
                    value={selectedScope}
                    onChange={(e) => {
                      setSelectedScope(e.target.value);
                      if (e.target.value === 'Platform') setScopeId('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Platform">Platform</option>
                    <option value="Organization">Organization</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
              </div>

              {selectedScope !== 'Platform' && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">{selectedScope} Name/ID</label>
                  <input 
                    type="text"
                    value={scopeId}
                    onChange={(e) => setScopeId(e.target.value)}
                    placeholder={`Enter ${selectedScope.toLowerCase()} name...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-red-400 text-xs font-medium mb-4 bg-red-950/30 p-2 rounded-lg border border-red-900/50">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button 
                onClick={handleAddRole}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors border border-slate-700"
              >
                <Plus className="w-4 h-4" /> Add Role Assignment
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 shrink-0">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all"
            >
              Save Roles
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
