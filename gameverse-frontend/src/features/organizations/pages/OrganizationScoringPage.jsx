import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trophy, Edit, Trash2, Calculator, X, Save } from 'lucide-react';
import { useScoringTemplates, useScoringMutations } from '../../admin/api/useScoringQueries';
import { ScoringSimulator } from '../../scoring/components/ScoringSimulator';
import { useGames } from '../../games/hooks/useGameQueries';
import toast from 'react-hot-toast';

export function OrganizationScoringPage() {
  const { orgSlug } = useParams();
  
  // Since we don't have a direct orgSlug -> orgId mapping here yet without fetching the org,
  // we can use a mock orgId 'org-1' for now, or fetch the org details first. 
  // In a real app, this layout would likely provide the orgId via context.
  const orgId = "org-1"; // Mocking for now as per other components

  const { data: templates, isLoading } = useScoringTemplates(orgId);
  const { data: games = [] } = useGames();
  const mutations = useScoringMutations(orgId);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [simulatorTemplateId, setSimulatorTemplateId] = useState(null);

  const [formData, setFormData] = useState({
    templateName: '',
    gameId: '',
    killPtsEach: 1,
    killCap: '',
    placementPointsText: '15, 12, 10, 8, 6, 4, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0'
  });

  useEffect(() => {
    if (templateToEdit) {
      const placements = [];
      if (templateToEdit.placementPoints) {
         const keys = Object.keys(templateToEdit.placementPoints).sort((a,b) => parseInt(a) - parseInt(b));
         keys.forEach(k => placements.push(templateToEdit.placementPoints[k]));
      }
      setFormData({
        templateName: templateToEdit.templateName || '',
        gameId: templateToEdit.gameId || '',
        killPtsEach: templateToEdit.killPtsEach || 1,
        killCap: templateToEdit.killCap || '',
        placementPointsText: placements.join(', ') || '15, 12, 10, 8, 6, 4, 2, 1'
      });
    } else {
      setFormData({
        templateName: '',
        gameId: '',
        killPtsEach: 1,
        killCap: '',
        placementPointsText: '15, 12, 10, 8, 6, 4, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0'
      });
    }
  }, [templateToEdit, isFormOpen]);

  const handleDelete = (template) => {
    if (window.confirm('Are you sure you want to delete this scoring template?')) {
      mutations.deleteTemplate.mutate(template.id, {
        onSuccess: () => toast.success('Template deleted successfully')
      });
    }
  };

  const handleSave = () => {
    if (!formData.templateName.trim() || !formData.gameId) {
      toast.error('Template Name and Game are required');
      return;
    }

    // Parse placement points
    const pointsArray = formData.placementPointsText.split(',').map(s => s.trim()).filter(s => s !== '');
    const placementPointsMap = {};
    let hasInvalidPoints = false;
    
    pointsArray.forEach((pts, idx) => {
      const parsed = parseFloat(pts);
      if (isNaN(parsed)) {
        hasInvalidPoints = true;
      } else {
        placementPointsMap[idx + 1] = parsed;
      }
    });

    if (hasInvalidPoints) {
      toast.error('Invalid placement points format. Use comma separated numbers.');
      return;
    }

    if (Object.keys(placementPointsMap).length === 0) {
      toast.error('At least one placement point is required');
      return;
    }

    const payload = {
      templateName: formData.templateName,
      gameId: formData.gameId,
      killPtsEach: parseFloat(formData.killPtsEach) || 0,
      killCap: formData.killCap === '' ? null : parseInt(formData.killCap, 10),
      placementPoints: placementPointsMap
    };

    if (templateToEdit) {
      mutations.updateTemplate.mutate({ templateId: templateToEdit.id, data: payload }, {
        onSuccess: () => {
          toast.success('Template updated successfully');
          setIsFormOpen(false);
          setTemplateToEdit(null);
        }
      });
    } else {
      mutations.createTemplate.mutate(payload, {
        onSuccess: () => {
          toast.success('Template created successfully');
          setIsFormOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Scoring Templates</h1>
          <p className="text-sm text-slate-400 mt-1">Manage custom scoring models for your tournaments.</p>
        </div>
        <button 
          onClick={() => { setTemplateToEdit(null); setIsFormOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
             <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Template Name</th>
                <th className="px-6 py-4 text-left">Game</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-center">Kill Pts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {templates?.length > 0 ? (
                templates.map(tmpl => (
                  <tr key={tmpl.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      {tmpl.templateName}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {games.find(g => g.id === tmpl.gameId)?.name || (tmpl.gameId === 'game-1' ? 'BGMI' : 'Game')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tmpl.systemTemplate ? (
                         <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">System</span>
                      ) : (
                         <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">Custom</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300">{tmpl.killPtsEach} pts/kill</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => setSimulatorTemplateId(tmpl.id)}
                        className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded transition-colors"
                        title="Simulate Scoring"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                      {!tmpl.systemTemplate && (
                        <>
                          <button 
                            onClick={() => { setTemplateToEdit(tmpl); setIsFormOpen(true); }}
                            className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded transition-colors"
                            title="Edit Template"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tmpl)}
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded transition-colors"
                            title="Delete Template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">No scoring templates found</h3>
                      <p className="text-sm">Create your first template to define how matches are scored.</p>
                      <button 
                        onClick={() => { setTemplateToEdit(null); setIsFormOpen(true); }}
                        className="mt-6 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        + Create Template
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 shadow-2xl shadow-black/50 rounded-2xl max-w-lg w-full p-6">
             <h2 className="text-xl font-bold text-white mb-6">
               {templateToEdit ? 'Edit Template' : 'Create Template'}
             </h2>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-400 mb-1">Template Name</label>
                 <input 
                   type="text" 
                   value={formData.templateName}
                   onChange={e => setFormData({...formData, templateName: e.target.value})}
                   placeholder="e.g., Standard BGMI Points"
                   className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-400 mb-1">Game</label>
                 <select 
                   value={formData.gameId}
                   onChange={e => setFormData({...formData, gameId: e.target.value})}
                   disabled={!!templateToEdit}
                   className={`w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors ${templateToEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <option value="">Select Game</option>
                   {games.map(g => (
                     <option key={g.id} value={g.id}>{g.name}</option>
                   ))}
                   {games.length === 0 && (
                     <>
                       <option value="game-1">BGMI</option>
                       <option value="game-2">Free Fire</option>
                     </>
                   )}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-400 mb-1">Points Per Kill</label>
                   <input 
                     type="number" 
                     min="0"
                     step="0.5"
                     value={formData.killPtsEach}
                     onChange={e => setFormData({...formData, killPtsEach: e.target.value})}
                     className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-400 mb-1">Kill Cap (Optional)</label>
                   <input 
                     type="number" 
                     min="0"
                     value={formData.killCap}
                     onChange={e => setFormData({...formData, killCap: e.target.value})}
                     placeholder="No cap"
                     className="w-full h-11 bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-400 mb-1">Placement Points</label>
                 <p className="text-xs text-slate-500 mb-2">Comma separated points for 1st, 2nd, 3rd, etc.</p>
                 <textarea 
                   rows={3}
                   value={formData.placementPointsText}
                   onChange={e => setFormData({...formData, placementPointsText: e.target.value})}
                   className="w-full bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none font-mono tracking-wide text-sm transition-colors"
                 />
               </div>
             </div>

             <div className="flex justify-end gap-3 mt-8">
               <button 
                 onClick={() => setIsFormOpen(false)}
                 className="bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-medium py-2 px-5 rounded-lg transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSave}
                 disabled={mutations.createTemplate.isPending || mutations.updateTemplate.isPending}
                 className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
               >
                 <Save className="w-4 h-4" />
                 {templateToEdit ? 'Update Template' : 'Save Template'}
               </button>
             </div>
          </div>
        </div>
      )}

      {simulatorTemplateId && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl h-[90vh] flex flex-col">
            <button 
              onClick={() => setSimulatorTemplateId(null)}
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <ScoringSimulator orgId={orgId} templateId={simulatorTemplateId} />
          </div>
        </div>
      )}
    </div>
  );
}
