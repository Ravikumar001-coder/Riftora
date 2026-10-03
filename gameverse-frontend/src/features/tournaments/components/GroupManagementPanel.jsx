import React, { useState } from 'react';
import { useGetTournamentGroups, useUpdateAdvancementRules, useGenerateFinals } from '../api/useGroupManagementQueries';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';

const GroupManagementPanel = ({ tournamentId }) => {
  const { data: groups, isLoading } = useGetTournamentGroups(tournamentId);
  const updateRules = useUpdateAdvancementRules();
  const generateFinals = useGenerateFinals();
  
  const [advancementRule, setAdvancementRule] = useState('TOTAL_POINTS');
  const [wildCardSpots, setWildCardSpots] = useState(0);

  const handleUpdateRules = () => {
    updateRules.mutate({
      tournamentId,
      rules: {
        groupAdvancementRule: advancementRule,
        wildCardSpots: Number(wildCardSpots)
      }
    }, {
      onSuccess: () => toast.success('Advancement rules updated successfully'),
      onError: () => toast.error('Failed to update advancement rules')
    });
  };

  const handleGenerateFinals = () => {
    generateFinals.mutate({ tournamentId }, {
      onSuccess: () => toast.success('Finals generated successfully'),
      onError: () => toast.error('Failed to generate finals')
    });
  };

  if (isLoading) return <div>Loading groups...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">Advancement Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Rule Type</Label>
              <Select value={advancementRule} onValueChange={setAdvancementRule}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Select rule" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="TOTAL_POINTS" className="text-slate-200 hover:bg-slate-700">Top N by Total Points</SelectItem>
                  <SelectItem value="PLACEMENT_POINTS_ONLY" className="text-slate-200 hover:bg-slate-700">Top N by Placement Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Wild Card Spots (Global)</Label>
              <Input 
                type="number" 
                min="0"
                value={wildCardSpots}
                onChange={(e) => setWildCardSpots(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
              <p className="text-xs text-slate-500">Selected across all groups based on highest total kills among non-advanced teams.</p>
            </div>
            
            <Button 
              onClick={handleUpdateRules} 
              disabled={updateRules.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Rules
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col justify-center items-center p-6 text-center space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Finals Generation</h3>
            <p className="text-sm text-slate-400 mt-2">
              Generates finals matches by calculating group standings, selecting top advancing teams, and applying wild card rules.
            </p>
          </div>
          <Button 
            onClick={handleGenerateFinals}
            disabled={generateFinals.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full max-w-xs"
          >
            {generateFinals.isPending ? 'Generating...' : 'Generate Finals'}
          </Button>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Groups & Standings Overview</h3>
        {groups?.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-700 rounded-lg text-center text-slate-500">
            No groups configured for this tournament.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups?.map(group => (
              <Card key={group.groupId} className="bg-slate-800/80 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-slate-200">{group.groupName}</CardTitle>
                    <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {group.groupCode}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-400">
                    Advancing Spots: <span className="text-slate-200 font-semibold">{group.advancementSpots}</span>
                  </div>
                  {/* Standings list could be added here later by calling leaderboard query with groupId */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupManagementPanel;
