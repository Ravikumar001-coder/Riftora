import React from 'react';
import { useParams } from 'react-router-dom';
import { useCheckInStats, useManualCheckIn } from '@/features/check-in/api';
import { useTournamentRegistrations } from '@/features/registrations/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';

const CheckInManagementPage = () => {
  const { id } = useParams(); // tournamentId
  const { data: stats, isLoading: statsLoading } = useCheckInStats(id);
  const { data: registrationsPage, isLoading: regsLoading } = useTournamentRegistrations(id, 0, 100);
  const { mutate: manualCheckIn, isPending: checkInPending } = useManualCheckIn();

  if (statsLoading || regsLoading) return <div className="p-8">Loading Check-in Data...</div>;

  const registrations = registrationsPage?.content || [];

  const handleCheckIn = (registrationId) => {
    manualCheckIn({ tournamentId: id, registrationId });
  };

  const handleNoShow = (registrationId) => {
    const action = window.prompt("Enter action for No-Show (NONE, PROMOTE_WAITLIST, MARK_BYE, MERGE):", "NONE");
    if (action) {
      // Mocking the post to the new endpoint
      api.post(`/admin/tournaments/${id}/check-ins/no-show/${registrationId}?action=${action}`)
        .then(() => {
          alert(`Team marked as No-Show with action: ${action}`);
          window.location.reload();
        });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white tracking-tight">Check-in Management</h1>
      
      {stats && !stats.checkInWindowOpen && (
        <Alert variant="warning">
          <AlertTitle>Check-in Window Closed</AlertTitle>
          <AlertDescription>
            The check-in window is currently closed for this tournament. Players cannot self-check-in, but you can still perform manual check-ins.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-medium">Total Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalConfirmedTeams || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-medium">Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{stats?.checkedInCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-medium">Not Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats?.notCheckedInCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-medium">No Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">{stats?.noShowCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
          <h2 className="text-lg font-semibold text-white">Team Check-ins</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Team Name</th>
                <th className="px-6 py-3 font-medium">Captain</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No approved registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map(reg => {
                  // In a real implementation, you'd cross-reference with a list of check-ins 
                  // or the backend would return a 'isCheckedIn' boolean on the registration dto.
                  // For now, we assume an 'isCheckedIn' field might exist if we added it.
                  const isCheckedIn = false; // Mocking this since RegistrationDto doesn't have it yet

                  return (
                    <tr key={reg.registrationId} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {reg.team?.teamName || 'Unknown Team'}
                      </td>
                      <td className="px-6 py-4">
                        {reg.captain?.displayName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isCheckedIn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {isCheckedIn ? 'Checked In' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isCheckedIn || checkInPending}
                          onClick={() => handleCheckIn(reg.registrationId)}
                        >
                          Manual Check-in
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={isCheckedIn}
                          onClick={() => handleNoShow(reg.registrationId)}
                        >
                          Mark No-Show
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckInManagementPage;
