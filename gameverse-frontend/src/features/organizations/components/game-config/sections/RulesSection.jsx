import React from 'react';

export function RulesSection({ formData, setFormData, ruleKey, isFreeFire }) {
  const rules = formData[ruleKey] || {};

  const updateRule = (field, value) => {
    setFormData({
      ...formData,
      [ruleKey]: { ...rules, [field]: value }
    });
  };

  const renderToggle = (label, description, field, defaultValue = false) => (
    <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
      <div>
        <div className="font-medium text-slate-300 mb-1">{label}</div>
        <div className="text-sm text-slate-500">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input type="checkbox" checked={rules[field] !== undefined ? rules[field] : defaultValue} onChange={e => updateRule(field, e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  );

  const renderInput = (label, field, type = 'number', defaultValue = '') => (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
      <input 
        type={type} 
        value={rules[field] !== undefined ? rules[field] : defaultValue} 
        onChange={e => updateRule(field, type === 'number' ? Number(e.target.value) : e.target.value)} 
        className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
      />
    </div>
  );

  if (ruleKey === 'inGameRules') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderToggle('Red Zone', 'Enable or disable the red zone during matches.', 'redZone', false)}
          {renderToggle('Flare Guns', 'Allow the use of flare guns.', 'flareGuns', true)}
          {renderToggle('Aim Assist', 'Allow aim assist features.', 'aimAssist', false)}
          {renderToggle('PC Emulators Allowed', 'Allow players on PC emulators to participate.', 'emulatorsAllowed', false)}
          {renderToggle('Tablets Allowed', 'Allow players using iPads or tablets.', 'tabletsAllowed', false)}
        </div>
      </div>
    );
  }

  if (ruleKey === 'rosterRules') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('Minimum Players Required (to start)', 'minPlayers', 'number', 3)}
          {renderInput('Maximum Players Registered (including subs)', 'maxPlayers', 'number', 6)}
          {renderInput('Substitute Limit per Match', 'substituteLimit', 'number', 2)}
          {renderInput('Age Restriction (Minimum Age)', 'minAge', 'number', 16)}
        </div>
        <div className="space-y-4">
          {renderToggle('Region Lock', 'Restrict participation to specific regions or countries.', 'regionLock', false)}
          {renderToggle('Allow Roster Changes Mid-Tournament', 'Permit teams to swap players after the tournament has started.', 'rosterLock', false)}
        </div>
      </div>
    );
  }

  if (ruleKey === 'advancementRules') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Advancement Methodology</label>
            <select 
              value={rules.methodology || 'TOP_N'} 
              onChange={e => updateRule('methodology', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              <option value="TOP_N">Top N Teams per Group</option>
              <option value="OVERALL_POINTS">Top N Teams Overall (Across Groups)</option>
              <option value="THRESHOLD">Point Threshold (e.g. reach 100 points)</option>
            </select>
          </div>
          {renderToggle('Carry Over Points', 'Do points earned in qualifiers carry over to the finals?', 'carryOverPoints', false)}
        </div>
      </div>
    );
  }

  if (ruleKey === 'resultRules') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('Result Submission Window (Minutes)', 'submissionWindow', 'number', 30)}
          {renderInput('Protest/Dispute Window (Minutes)', 'protestWindow', 'number', 60)}
        </div>
        <div className="space-y-4">
          {renderToggle('End-of-Match Screenshot Required', 'Teams must upload a screenshot of the results screen.', 'screenshotRequired', true)}
          {renderToggle('POV Recording Required', 'Players must record and retain POV gameplay for disputes.', 'povRequired', false)}
          {renderToggle('Auto-Approve Results', 'Automatically approve results if no disputes are filed within the window.', 'autoApprove', true)}
        </div>
      </div>
    );
  }

  if (ruleKey === 'championRush') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Champion Rush (Match Point)</h3>
              <p className="text-sm text-slate-400">A special format where teams must reach a point threshold, then win a match.</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            {renderToggle('Enable Champion Rush', 'Activate the Champion Rush format for the Grand Finals of this template.', 'enabled', false)}
            
            {rules.enabled && (
              <div className="pt-4 border-t border-amber-500/20">
                {renderInput('Points Threshold to become Match Point Eligible', 'pointsThreshold', 'number', 80)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div>Unknown Rule Section</div>;
}
