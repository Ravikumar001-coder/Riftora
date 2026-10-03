import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Textarea } from '../../../../components/ui/textarea';
import { Trash2, Plus, Save, Copy, X, Upload, FileText } from 'lucide-react';

const CATEGORIES = [
  { id: 'scoring', label: 'Scoring System' },
  { id: 'settings', label: 'Match Settings' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'rulebook', label: 'Rulebook/Conduct' }
];

export default function TournamentRulesConfig() {
  const [activeTab, setActiveTab] = useState('scoring');

  // Unified form state matching professional esports standards
  const [rules, setRules] = useState({
    gameTitle: 'BGMI', // Toggle for BGMI or Free Fire
    
    // Scoring
    pointsPerKill: 1,
    placementPoints: [
      { place: 1, points: 10 },
      { place: 2, points: 6 },
      { place: 3, points: 5 },
      { place: 4, points: 4 },
      { place: 5, points: 3 },
      { place: 6, points: 2 },
      { place: 7, points: 1 },
      { place: 8, points: 1 },
      { place: 9, points: 0 },
      { place: 10, points: 0 },
      { place: 11, points: 0 },
      { place: 12, points: 0 },
      { place: 13, points: 0 },
      { place: 14, points: 0 },
      { place: 15, points: 0 },
      { place: 16, points: 0 },
    ],
    tiebreakerPriority: [
      'Total Match Wins (Chicken Dinners)',
      'Total Placement Points',
      'Total Elimination Points',
      'Placement in Final Match'
    ],
    
    // Match Settings
    allowedMaps: ['Erangel'],
    gameMode: 'Squad',
    perspective: 'TPP',
    aimAssist: false,
    redZone: false,
    flareGuns: false,
    soundVisualization: false,
    roomDetailDistributionMinutes: 15,
    
    // Eligibility
    minRosterSize: 4,
    maxRosterSize: 6,
    allowedDevices: {
      Mobile: true,
      iPad: false,
      Emulator: false,
    },
    minAccountLevel: 40,
    rosterLockDate: '',
    
    // Rulebook
    penaltyNoShow: true,
    penaltySlotTrading: true,
    requirePovRecording: false,
    rulebookText: '',
    rulebookFiles: []
  });

  const handleSave = () => {
    console.log('Saving Rule Configuration:', rules);
    // TODO: Connect to backend API
  };

  const handleSaveAsTemplate = () => {
    console.log('Saving as Template:', rules);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 w-full rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div>
          <h2 className="text-xl font-bold text-white">Tournament Rules Configuration</h2>
          <p className="text-sm text-slate-400">Define the ruleset, scoring, and eligibility for your tournament.</p>
        </div>
        
        {/* Game Title Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setRules({...rules, gameTitle: 'BGMI'})}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${rules.gameTitle === 'BGMI' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            BGMI
          </button>
          <button 
            onClick={() => setRules({...rules, gameTitle: 'Free Fire'})}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${rules.gameTitle === 'Free Fire' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Free Fire
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 flex flex-col gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === category.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="max-w-3xl">
            {activeTab === 'scoring' && <ScoringSystemConfig rules={rules} setRules={setRules} />}
            {activeTab === 'settings' && <MatchSettingsConfig rules={rules} setRules={setRules} />}
            {activeTab === 'eligibility' && <EligibilityConfig rules={rules} setRules={setRules} />}
            {activeTab === 'rulebook' && <RulebookConfig rules={rules} setRules={setRules} />}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 items-center">
        <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button variant="outline" onClick={handleSaveAsTemplate} className="border-blue-800 text-blue-400 hover:bg-blue-950 hover:text-blue-300">
          <Copy className="w-4 h-4 mr-2" /> Save as Template
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
}

// Child Components

function ScoringSystemConfig({ rules, setRules }) {
  const handlePointsPerKillChange = (e) => {
    setRules({ ...rules, pointsPerKill: Number(e.target.value) });
  };

  const handlePlacementChange = (index, value) => {
    const updated = [...rules.placementPoints];
    updated[index].points = Number(value);
    setRules({ ...rules, placementPoints: updated });
  };

  const addPlacementRow = () => {
    const nextPlace = rules.placementPoints.length + 1;
    setRules({
      ...rules,
      placementPoints: [...rules.placementPoints, { place: nextPlace, points: 0 }]
    });
  };

  const removePlacementRow = (index) => {
    const updated = rules.placementPoints.filter((_, i) => i !== index);
    // Re-index places
    const reindexed = updated.map((item, i) => ({ ...item, place: i + 1 }));
    setRules({ ...rules, placementPoints: reindexed });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Scoring System</h3>
        <p className="text-sm text-slate-400 mb-6">Configure how points are awarded for eliminations and match placements.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-medium">Eliminations</CardTitle>
          <CardDescription className="text-slate-400">Points awarded per kill during a match.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label className="text-slate-300">Points Per Kill</Label>
            <Input 
              type="number" 
              className="w-32 bg-slate-950 border-slate-700" 
              value={rules.pointsPerKill} 
              onChange={handlePointsPerKillChange} 
              min={0}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-medium">Placement Points (16-Team Standard)</CardTitle>
            <CardDescription className="text-slate-400">Points awarded based on final team standing in the lobby.</CardDescription>
          </div>
          <Button onClick={addPlacementRow} size="sm" variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700">
            <Plus className="w-4 h-4 mr-2" /> Add Rank
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Placement</th>
                  <th className="px-4 py-3 text-left font-medium">Points</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/30">
                {rules.placementPoints.map((item, index) => (
                  <tr key={item.place} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 text-slate-300 font-medium">
                      #{item.place}
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        type="number"
                        className="w-24 bg-slate-900 border-slate-700 h-8"
                        value={item.points}
                        onChange={(e) => handlePlacementChange(index, e.target.value)}
                        min={0}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/50 h-8 w-8"
                        onClick={() => removePlacementRow(index)}
                        disabled={rules.placementPoints.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 mt-6">
        <CardHeader>
          <CardTitle className="text-base font-medium">Tiebreaker Logic</CardTitle>
          <CardDescription className="text-slate-400">Priority order for resolving point ties.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.tiebreakerPriority.map((tb, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="bg-slate-800 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-sm font-medium text-slate-200">{tb}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">Drag and drop reordering functionality coming soon. Currently using standard official priority.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MatchSettingsConfig({ rules, setRules }) {
  const updateSetting = (key, value) => {
    setRules({ ...rules, [key]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Match Settings</h3>
        <p className="text-sm text-slate-400 mb-6">Configure in-game parameters for tournament matches.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-slate-300">Allowed Maps</Label>
            <div className="grid grid-cols-3 gap-3">
              {['Erangel', 'Miramar', 'Rondo'].map(mapName => (
                <div 
                  key={mapName}
                  onClick={() => updateSetting('allowedMaps', [mapName])}
                  className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
                    rules.allowedMaps.includes(mapName)
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {mapName}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-300">Game Mode</Label>
              <Select value={rules.gameMode} onValueChange={(v) => updateSetting('gameMode', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Duo">Duo</SelectItem>
                  <SelectItem value="Squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300">Perspective</Label>
              <Select value={rules.perspective} onValueChange={(v) => updateSetting('perspective', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Perspective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TPP">TPP (Third-Person)</SelectItem>
                  <SelectItem value="FPP">FPP (First-Person)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-medium">Competitive Toggles</CardTitle>
          <CardDescription className="text-slate-400">Enforce standard esports rules for custom rooms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-center space-x-3">
              <Checkbox id="aimAssist" checked={rules.aimAssist} onCheckedChange={(v) => updateSetting('aimAssist', v)} className="border-slate-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="aimAssist" className="text-slate-300 cursor-pointer">Aim Assist (Default: Off)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="redZone" checked={rules.redZone} onCheckedChange={(v) => updateSetting('redZone', v)} className="border-slate-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="redZone" className="text-slate-300 cursor-pointer">Red Zone (Default: Off)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="flareGuns" checked={rules.flareGuns} onCheckedChange={(v) => updateSetting('flareGuns', v)} className="border-slate-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="flareGuns" className="text-slate-300 cursor-pointer">Flare Guns (Default: Off)</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="soundVis" checked={rules.soundVisualization} onCheckedChange={(v) => updateSetting('soundVisualization', v)} className="border-slate-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="soundVis" className="text-slate-300 cursor-pointer">Sound Visualization (Default: Off)</Label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-800 mt-2">
            <Label className="text-slate-300 block mb-2">Room ID/Password Distribution Time (Minutes)</Label>
            <Input 
              type="number" 
              className="w-full sm:w-64 bg-slate-950 border-slate-700" 
              value={rules.roomDetailDistributionMinutes} 
              onChange={(e) => updateSetting('roomDetailDistributionMinutes', Number(e.target.value))} 
              min={1} max={120}
            />
            <p className="text-xs text-slate-500 mt-2">How many minutes before match start time room details are revealed to players.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EligibilityConfig({ rules, setRules }) {
  const updateDevice = (device, checked) => {
    setRules({
      ...rules,
      allowedDevices: { ...rules.allowedDevices, [device]: checked }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Roster & Eligibility</h3>
        <p className="text-sm text-slate-400 mb-6">Define who can play and what devices are permitted.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-medium">Anti-Smurf & Requirements</CardTitle>
          <CardDescription className="text-slate-400">Set restrictions to maintain competitive integrity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-sm">
            <Label className="text-slate-300">Minimum Account Level</Label>
            <Input 
              type="number" 
              className="w-full bg-slate-950 border-slate-700" 
              value={rules.minAccountLevel} 
              onChange={(e) => setRules({...rules, minAccountLevel: Number(e.target.value)})} 
              min={1} max={100}
            />
            <p className="text-xs text-slate-500">Prevents brand new accounts (smurfs/hackers) from registering.</p>
          </div>
          
          <div className="space-y-2 max-w-sm">
            <Label className="text-slate-300">Roster Lock Date</Label>
            <Input 
              type="datetime-local" 
              className="w-full bg-slate-950 border-slate-700 text-slate-300 [color-scheme:dark]" 
              value={rules.rosterLockDate} 
              onChange={(e) => setRules({...rules, rosterLockDate: e.target.value})} 
            />
            <p className="text-xs text-slate-500">Deadline after which teams can no longer change their players or substitutes.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-medium">Roster Size</CardTitle>
          <CardDescription className="text-slate-400">Set the minimum and maximum players allowed per team roster.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="space-y-2">
              <Label className="text-slate-300">Min. Roster Size</Label>
              <Input 
                type="number" 
                className="w-32 bg-slate-950 border-slate-700" 
                value={rules.minRosterSize} 
                onChange={(e) => setRules({...rules, minRosterSize: Number(e.target.value)})} 
                min={1} max={10}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Max. Roster Size</Label>
              <Input 
                type="number" 
                className="w-32 bg-slate-950 border-slate-700" 
                value={rules.maxRosterSize} 
                onChange={(e) => setRules({...rules, maxRosterSize: Number(e.target.value)})} 
                min={1} max={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-medium">Allowed Devices</CardTitle>
          <CardDescription className="text-slate-400">Select the platforms players are permitted to use (Tier 1 is typically Mobile only).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(rules.allowedDevices).map(([device, isAllowed]) => (
              <div key={device} className="flex items-center space-x-3">
                <Checkbox 
                  id={`device-${device}`} 
                  checked={isAllowed} 
                  onCheckedChange={(checked) => updateDevice(device, checked)}
                  className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label 
                  htmlFor={`device-${device}`} 
                  className="text-sm font-medium leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {device}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RulebookConfig({ rules, setRules }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Rulebook & Conduct</h3>
        <p className="text-sm text-slate-400 mb-6">Write out custom organizational rules, dispute policies, and penalties.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-medium">Standardized Penalties</CardTitle>
          <CardDescription className="text-slate-400">Predefined penalty templates commonly used in esports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
            <Checkbox id="penaltyNoShow" checked={rules.penaltyNoShow} onCheckedChange={(v) => setRules({...rules, penaltyNoShow: v})} className="mt-1 border-slate-600 data-[state=checked]:bg-blue-600" />
            <div>
              <Label htmlFor="penaltyNoShow" className="text-slate-300 font-medium cursor-pointer">No-Show Penalty (-5 points)</Label>
              <p className="text-xs text-slate-500 mt-1">Deduction of 5 points if a registered team fails to enter the custom room.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
            <Checkbox id="penaltySlotTrading" checked={rules.penaltySlotTrading} onCheckedChange={(v) => setRules({...rules, penaltySlotTrading: v})} className="mt-1 border-slate-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
            <div>
              <Label htmlFor="penaltySlotTrading" className="text-slate-300 font-medium cursor-pointer">Slot Trading (Disqualification)</Label>
              <p className="text-xs text-slate-500 mt-1">Automatic disqualification for teams caught giving their slot to an unregistered team.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
            <Checkbox id="reqPov" checked={rules.requirePovRecording} onCheckedChange={(v) => setRules({...rules, requirePovRecording: v})} className="mt-1 border-slate-600 data-[state=checked]:bg-blue-600" />
            <div>
              <Label htmlFor="reqPov" className="text-slate-300 font-medium cursor-pointer">POV Recording Requirement</Label>
              <p className="text-xs text-slate-500 mt-1">Players are required to record their screen and submit it upon request if accused of hacking.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col mt-6">
        <CardContent className="pt-6 flex-1 flex flex-col gap-4">
          <div>
            <Label className="text-slate-300 mb-2 block">Custom Rulebook (Markdown Supported)</Label>
            <Textarea 
              placeholder="E.g., No teaming. Any team caught exploiting bugs will be immediately disqualified..." 
              className="w-full min-h-[250px] bg-slate-950 border-slate-700 text-slate-200 resize-none focus-visible:ring-blue-600"
              value={rules.rulebookText}
              onChange={(e) => setRules({...rules, rulebookText: e.target.value})}
            />
          </div>

          <div className="border border-dashed border-slate-700 bg-slate-950/50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 border border-slate-800">
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">Attach Rulebook Files</p>
            <p className="text-xs text-slate-500 mb-4">Upload PDFs, Images, or Documents (Max 5MB each)</p>
            <div className="relative">
              <Input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                multiple 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files).map(file => file.name);
                    setRules({...rules, rulebookFiles: [...(rules.rulebookFiles || []), ...newFiles]});
                  }
                }}
              />
              <Button type="button" variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 relative pointer-events-none">
                Select Files
              </Button>
            </div>

            {/* Display selected files */}
            {rules.rulebookFiles && rules.rulebookFiles.length > 0 && (
              <div className="w-full mt-4 space-y-2 text-left">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Attached Files</Label>
                {rules.rulebookFiles.map((fileName, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-md">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-sm text-slate-300 truncate">{fileName}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-6 h-6 text-slate-500 hover:text-red-400"
                      onClick={() => setRules({...rules, rulebookFiles: rules.rulebookFiles.filter((_, i) => i !== idx)})}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
