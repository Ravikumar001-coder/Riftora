import React from 'react';
import { TeamPayoutMethodPanel } from '../../../finance/components/TeamPayoutMethodPanel';

export const ManageFinanceTab = ({ team, onToast }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Team Finances</h2>
        <p className="text-sm text-slate-400">
          Manage how your team receives prize payouts from tournaments. 
          Payouts will be sent to the verified method provided here.
        </p>
      </div>

      <TeamPayoutMethodPanel teamId={team.teamId} onToast={onToast} />
    </div>
  );
};
