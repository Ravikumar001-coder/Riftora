import React, { useState } from 'react';
import { useAddTeamPayoutMethod, useTeamPayoutMethods } from '../api/useFinanceQueries';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export const TeamPayoutMethodPanel = ({ teamId, onToast }) => {
  const { data: payoutMethods, isLoading } = useTeamPayoutMethods(teamId);
  const addMethodMutation = useAddTeamPayoutMethod();

  const [methodType, setMethodType] = useState('upi');
  const [upiId, setUpiId] = useState('');
  
  const [accName, setAccName] = useState('');
  const [accNum, setAccNum] = useState('');
  const [ifsc, setIfsc] = useState('');

  if (isLoading) return <div className="animate-pulse h-32 bg-slate-800 rounded-lg"></div>;

  const verifiedMethod = payoutMethods?.find(m => m.isVerified);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let accountDetails = {};
    if (methodType === 'upi') {
      if (!upiId) return onToast('UPI ID is required', true);
      accountDetails = { upiId };
    } else {
      if (!accName || !accNum || !ifsc) return onToast('All bank details are required', true);
      accountDetails = { accountName: accName, accountNumber: accNum, ifscCode: ifsc };
    }

    addMethodMutation.mutate({
      teamId,
      data: {
        methodType,
        accountDetails: JSON.stringify(accountDetails)
      }
    }, {
      onSuccess: () => {
        onToast('Payout method added and verified.', false);
        setUpiId('');
        setAccName('');
        setAccNum('');
        setIfsc('');
      }
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-400" />
          Prize Payout Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        {verifiedMethod ? (
          <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Verified Payout Method Active
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {verifiedMethod.methodType === 'upi' ? 'UPI ID: ' : 'Bank Account: '}
                <span className="font-mono text-white">
                  {verifiedMethod.methodType === 'upi' 
                    ? JSON.parse(verifiedMethod.accountDetails).upiId 
                    : `Ending in ${JSON.parse(verifiedMethod.accountDetails).accountNumber.slice(-4)}`}
                </span>
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onToast('Contact support to change verified payout method')}>
              Change
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-400">Add a payout method to receive tournament prize money.</p>
            
            <div className="flex gap-4 mb-4">
              <Button type="button" variant={methodType === 'upi' ? 'default' : 'outline'} className={methodType === 'upi' ? 'bg-blue-600' : ''} onClick={() => setMethodType('upi')}>
                UPI
              </Button>
              <Button type="button" variant={methodType === 'bank_account' ? 'default' : 'outline'} className={methodType === 'bank_account' ? 'bg-blue-600' : ''} onClick={() => setMethodType('bank_account')}>
                Bank Account
              </Button>
            </div>

            {methodType === 'upi' ? (
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID (VPA)</Label>
                <Input 
                  id="upiId" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  placeholder="name@okbank" 
                  className="bg-slate-800"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accName">Account Holder Name</Label>
                  <Input id="accName" value={accName} onChange={e => setAccName(e.target.value)} className="bg-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accNum">Account Number</Label>
                    <Input id="accNum" type="password" value={accNum} onChange={e => setAccNum(e.target.value)} className="bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" value={ifsc} onChange={e => setIfsc(e.target.value)} className="bg-slate-800" />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" disabled={addMethodMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700">
              {addMethodMutation.isPending ? 'Verifying...' : 'Add & Verify Method'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
