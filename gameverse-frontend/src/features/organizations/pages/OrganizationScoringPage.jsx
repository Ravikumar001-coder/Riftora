import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trophy, Edit, Trash2, Calculator, X } from 'lucide-react';
import { useScoringTemplates, useScoringMutations } from '../../admin/api/useScoringQueries';
import { ScoringSimulator } from '../../scoring/components/ScoringSimulator';

export function OrganizationScoringPage() {
  const { orgSlug } = useParams();
  
  // Since we don't have a direct orgSlug -> orgId mapping here yet without fetching the org,
  // we can use a mock orgId 'org-1' for now, or fetch the org details first. 
  // In a real app, this layout would likely provide the orgId via context.
  const orgId = "org-1"; // Mocking for now as per other components

  const { data: templates, isLoading } = useScoringTemplates(orgId);
  const mutations = useScoringMutations(orgId);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [simulatorTemplateId, setSimulatorTemplateId] = useState(null);

  const handleDelete = (template) => {
    if (window.confirm('Are you sure you want to delete this scoring template?')) {
      mutations.deleteTemplate.mutate(template.id);
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
        ) : templates?.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Template Name</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Kill Pts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {templates.map(tmpl => (
                <tr key={tmpl.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {tmpl.templateName}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{tmpl.gameId === 'game-1' ? 'BGMI' : 'Game'}</td>
                  <td className="px-6 py-4">
                    {tmpl.systemTemplate ? (
                       <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">System</span>
                    ) : (
                       <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">Custom</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{tmpl.killPtsEach} pts/kill</td>
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
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-500">
             <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No scoring templates found. Create one to get started.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
             <h2 className="text-xl font-bold text-white mb-4">
               {templateToEdit ? 'Edit Template' : 'Create Template'}
             </h2>
             <p className="text-slate-400 text-sm mb-6">
               Note: The complete form implementation requires multiple placement point fields. 
               This is a placeholder for the modal structure.
             </p>
             <div className="flex justify-end gap-3 mt-8">
               <button 
                 onClick={() => setIsFormOpen(false)}
                 className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors"
               >
                 Cancel
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
