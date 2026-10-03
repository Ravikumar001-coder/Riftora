import React, { useState } from 'react';
import { useSimulateScoring } from '../api/useScoringTemplateQueries';
import { Calculator, Plus, Trash2, Trophy, Crosshair, Hash } from 'lucide-react';
import { useForm as useReactHookForm, useFieldArray as useReactHookFieldArray } from 'react-hook-form';

export function ScoringSimulator({ orgId, templateId }) {
    const simulateMutation = useSimulateScoring(orgId, templateId);
    const [results, setResults] = useState(null);

    const { register, control, handleSubmit, formState: { errors } } = useReactHookForm({
        defaultValues: {
            teamResults: [
                { teamName: 'Team Alpha', placement: 1, kills: 10 },
                { teamName: 'Team Beta', placement: 2, kills: 5 },
                { teamName: 'Team Charlie', placement: 3, kills: 2 },
            ]
        }
    });

    const { fields, append, remove } = useReactHookFieldArray({
        control,
        name: 'teamResults'
    });

    const onSubmit = (data) => {
        // Parse ints just in case
        const formattedData = {
            teamResults: data.teamResults.map(t => ({
                ...t,
                placement: parseInt(t.placement, 10),
                kills: parseInt(t.kills, 10),
                teamWipes: parseInt(t.teamWipes || 0, 10)
            }))
        };
        simulateMutation.mutate(formattedData, {
            onSuccess: (data) => setResults(data)
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col lg:flex-row h-full max-h-[800px]">
            {/* Left Panel: Inputs */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800 custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-500" />
                        Scoring Simulator
                    </h3>
                    <button 
                        type="button" 
                        onClick={() => append({ teamName: `Team ${fields.length + 1}`, placement: fields.length + 1, kills: 0 })}
                        className="flex items-center gap-1 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add Team
                    </button>
                </div>
                <p className="text-sm text-slate-400 mb-6">Enter mock match results to test how your scoring template calculates points and resolves tiebreakers.</p>

                <form id="simulatorForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Team Name</label>
                                    <input
                                        {...register(`teamResults.${index}.teamName`, { required: true })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Team Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Placement</label>
                                    <input
                                        type="number"
                                        min="1"
                                        {...register(`teamResults.${index}.placement`, { required: true, min: 1 })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kills</label>
                                    <input
                                        type="number"
                                        min="0"
                                        {...register(`teamResults.${index}.kills`, { required: true, min: 0 })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                                <button 
                                    type="button" 
                                    onClick={() => remove(index)}
                                    className="mt-7 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Remove team"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            {/* Bonus Fields */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" {...register(`teamResults.${index}.gotFirstBlood`)} className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                                    First Blood
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" {...register(`teamResults.${index}.gotMvp`)} className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                                    MVP
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" {...register(`teamResults.${index}.gotWinnerBonus`)} className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                                    Winner Bonus
                                </label>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <label>Team Wipes:</label>
                                    <input type="number" min="0" defaultValue="0" {...register(`teamResults.${index}.teamWipes`)} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </form>
                
                <div className="mt-8 sticky bottom-0 bg-slate-900 pt-4 pb-2">
                    <button 
                        form="simulatorForm"
                        type="submit" 
                        disabled={simulateMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
                    >
                        {simulateMutation.isPending ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>
            </div>

            {/* Right Panel: Results */}
            <div className="w-full lg:w-1/2 bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-bold text-white mb-6">Simulation Results</h3>
                
                {!results ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                        <Calculator className="w-12 h-12 mb-4 opacity-50" />
                        <p>Run the simulation to see calculated points and standings.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-slate-800">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4">Team</div>
                            <div className="col-span-2 text-center" title="Placement Points"><Trophy className="w-4 h-4 mx-auto inline" /> Pls</div>
                            <div className="col-span-1 text-center" title="Kill Points"><Crosshair className="w-4 h-4 mx-auto inline" /> Kills</div>
                            <div className="col-span-2 text-center" title="Bonus Points">Bonus</div>
                            <div className="col-span-2 text-right" title="Total Points"><Hash className="w-4 h-4 inline" /> Total</div>
                        </div>
                        
                        {/* Rows */}
                        {results.map((standing) => (
                            <div 
                                key={standing.teamName} 
                                className="grid grid-cols-12 gap-2 items-center bg-slate-900 border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition-colors"
                            >
                                <div className="col-span-1">
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${standing.finalRank === 1 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-slate-800 text-slate-300'}`}>
                                        {standing.finalRank}
                                    </span>
                                </div>
                                <div className="col-span-4 flex flex-col">
                                    <span className="font-bold text-white text-sm">{standing.teamName}</span>
                                    <span className="text-xs text-slate-500">P: {standing.mockPlacement} | K: {standing.mockKills}</span>
                                </div>
                                <div className="col-span-2 text-center text-sm font-medium text-slate-300">{standing.placementPoints}</div>
                                <div className="col-span-1 text-center text-sm font-medium text-slate-300">{standing.killPoints}</div>
                                <div className="col-span-2 text-center text-sm font-medium text-slate-300">{standing.bonusPoints}</div>
                                <div className="col-span-2 text-right text-lg font-black text-white">{standing.totalPoints}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
