import React, { useState } from 'react';
import { Shield, Smartphone, Banknote, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import {
  useTeamPayoutMethods,
  useAddTeamPayoutMethod,
  useValidateUpiVpa,
  useSubmitPayoutMethod,
} from '../api/useFinanceQueries';
import { useToast } from '../../../components/feedback/Toast/useToast';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

/**
 * FR-16-007: Winner Payout Submission Form (Player Portal)
 * Winning Team Captain submits payout details (UPI or Bank Account) for a prize position.
 * FR-16-008: UPI VPA is validated before being accepted.
 */
export const PayoutSubmissionForm = ({ teamId, prizePosition, onComplete }) => {
  const [step, setStep] = useState('method_select'); // method_select | upi_entry | bank_entry | validate | submit
  const [methodType, setMethodType] = useState(null); // 'upi' | 'bank_account'
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', ifsc: '', accountHolder: '' });
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [upiValidationResult, setUpiValidationResult] = useState(null);

  const { addToast } = useToast();
  const { data: existingMethods, isLoading: methodsLoading } = useTeamPayoutMethods(teamId);
  const addMethodMutation = useAddTeamPayoutMethod();
  const validateUpiMutation = useValidateUpiVpa();
  const submitMutation = useSubmitPayoutMethod();

  // Calculate days remaining in payout window
  const daysLeft = prizePosition?.payoutWindowDeadline
    ? Math.max(0, Math.ceil((new Date(prizePosition.payoutWindowDeadline) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleSelectExistingMethod = (method) => {
    setSelectedMethodId(method.methodId);
    setStep('submit');
  };

  // FR-16-008: Validate UPI VPA
  const handleValidateUpi = async () => {
    if (!upiId.trim()) return;
    setStep('validate');

    // First, add the method (unverified) to get a methodId
    addMethodMutation.mutate(
      { teamId, data: { methodType: 'upi', accountDetails: JSON.stringify({ upiId }) } },
      {
        onSuccess: (newMethod) => {
          // Now validate the UPI VPA
          validateUpiMutation.mutate(
            { upiId, teamId, payoutMethodId: newMethod.methodId },
            {
              onSuccess: (result) => {
                setUpiValidationResult(result);
                if (result.valid) {
                  setSelectedMethodId(newMethod.methodId);
                  addToast('UPI Verified', `UPI ID verified. Account: ${result.accountHolderName}`, 'success');
                  setStep('submit');
                } else {
                  addToast('UPI Invalid', result.message, 'error');
                  setStep('upi_entry');
                }
              },
              onError: () => {
                addToast('Validation Error', 'Failed to validate UPI ID. Please try again.', 'error');
                setStep('upi_entry');
              },
            }
          );
        },
        onError: () => {
          addToast('Error', 'Failed to save UPI method', 'error');
          setStep('upi_entry');
        },
      }
    );
  };

  const handleAddBankAccount = () => {
    const { accountNumber, ifsc, accountHolder } = bankDetails;
    if (!accountNumber || !ifsc || !accountHolder) {
      addToast('Incomplete', 'Please fill in all bank account details', 'error');
      return;
    }
    addMethodMutation.mutate(
      {
        teamId,
        data: {
          methodType: 'bank_account',
          accountDetails: JSON.stringify({ accountNumber, ifsc, accountHolder }),
        },
      },
      {
        onSuccess: (newMethod) => {
          setSelectedMethodId(newMethod.methodId);
          setStep('submit');
        },
        onError: () => addToast('Error', 'Failed to add bank account', 'error'),
      }
    );
  };

  const handleSubmit = () => {
    if (!selectedMethodId) return;
    submitMutation.mutate(
      { posId: prizePosition.posId, teamId, payoutMethodId: selectedMethodId },
      {
        onSuccess: () => {
          addToast('Submitted', 'Your payout details have been submitted successfully!', 'success');
          onComplete?.();
        },
        onError: (err) => {
          addToast('Error', err.response?.data?.message || 'Failed to submit payout details', 'error');
        },
      }
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Submit Payout Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {prizePosition?.label || `Position ${prizePosition?.position}`} —{' '}
              <span className="text-emerald-400 font-semibold">₹{prizePosition?.amount?.toLocaleString()}</span>
            </p>
          </div>
          {daysLeft !== null && (
            <div className={cn(
              'text-center px-3 py-1.5 rounded-lg border text-xs',
              daysLeft <= 2
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            )}>
              <p className="font-bold text-lg leading-none">{daysLeft}</p>
              <p className="opacity-80">days left</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Already submitted */}
        {prizePosition?.payoutDetailsSubmittedAt ? (
          <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">Payout details submitted!</p>
              <p className="text-xs text-emerald-400/70 mt-0.5">
                Submitted on {new Date(prizePosition.payoutDetailsSubmittedAt).toLocaleString()}.
                Your prize will be disbursed once the Tournament Director initiates payouts.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Step: Method Select */}
            {step === 'method_select' && (
              <div className="space-y-4">
                {/* Use existing verified method */}
                {!methodsLoading && existingMethods?.filter(m => m.isVerified).length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Use existing method</p>
                    <div className="space-y-2">
                      {existingMethods.filter(m => m.isVerified).map(method => {
                        let details = {};
                        try { details = JSON.parse(method.accountDetails); } catch {}
                        return (
                          <button
                            key={method.methodId}
                            onClick={() => handleSelectExistingMethod(method)}
                            className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all text-left"
                          >
                            {method.methodType === 'upi'
                              ? <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              : <Banknote className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-white uppercase">{method.methodType.replace('_', ' ')}</p>
                              <p className="text-xs text-slate-400 truncate">
                                {details.upiId || details.accountNumber || 'Details on file'}
                              </p>
                            </div>
                            {method.vpaValidationStatus === 'valid' && (
                              <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            )}
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div>
                      <div className="relative flex justify-center"><span className="px-2 bg-slate-900 text-xs text-slate-500">or add new</span></div>
                    </div>
                  </div>
                )}

                {/* Add new method */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setMethodType('upi'); setStep('upi_entry'); }}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-blue-500/10 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all"
                  >
                    <Smartphone className="w-6 h-6 text-blue-400" />
                    <span className="text-sm font-semibold text-white">UPI ID</span>
                    <span className="text-xs text-slate-400 text-center">Instant transfer via UPI</span>
                  </button>
                  <button
                    onClick={() => { setMethodType('bank_account'); setStep('bank_entry'); }}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-purple-500/10 border border-slate-700 hover:border-purple-500/50 rounded-lg transition-all"
                  >
                    <Banknote className="w-6 h-6 text-purple-400" />
                    <span className="text-sm font-semibold text-white">Bank Account</span>
                    <span className="text-xs text-slate-400 text-center">NEFT/IMPS transfer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step: UPI Entry */}
            {step === 'upi_entry' && (
              <div className="space-y-4">
                <button onClick={() => setStep('method_select')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back
                </button>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="e.g. john@upi or 9876543210@paytm"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Your UPI ID will be verified via Razorpay VPA validation (FR-16-008).
                  </p>
                </div>
                {upiValidationResult && !upiValidationResult.valid && (
                  <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300">{upiValidationResult.message}</p>
                  </div>
                )}
                <Button
                  onClick={handleValidateUpi}
                  disabled={!upiId.trim() || addMethodMutation.isPending || validateUpiMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  {(addMethodMutation.isPending || validateUpiMutation.isPending)
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Validating UPI...</span>
                    : 'Validate & Continue'
                  }
                </Button>
              </div>
            )}

            {/* Step: Bank Account Entry */}
            {step === 'bank_entry' && (
              <div className="space-y-4">
                <button onClick={() => setStep('method_select')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back
                </button>
                <div className="space-y-3">
                  {[
                    { key: 'accountHolder', label: 'Account Holder Name', placeholder: 'As per bank records' },
                    { key: 'accountNumber', label: 'Account Number', placeholder: 'Enter account number' },
                    { key: 'ifsc', label: 'IFSC Code', placeholder: 'e.g. SBIN0001234' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        value={bankDetails[field.key]}
                        onChange={e => setBankDetails(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleAddBankAccount}
                  disabled={addMethodMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                >
                  {addMethodMutation.isPending
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
                    : 'Continue'
                  }
                </Button>
              </div>
            )}

            {/* Step: Validate (loading) */}
            {step === 'validate' && (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                </div>
                <p className="text-sm text-slate-300 font-medium">Validating UPI ID...</p>
                <p className="text-xs text-slate-500">Calling Razorpay VPA validation API</p>
              </div>
            )}

            {/* Step: Submit confirmation */}
            {step === 'submit' && (
              <div className="space-y-4">
                {upiValidationResult?.valid && (
                  <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-300">UPI Verified</p>
                      <p className="text-xs text-emerald-400/70 mt-0.5">Account: {upiValidationResult.accountHolderName}</p>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2">Ready to submit for:</p>
                  <p className="text-sm font-bold text-white">{prizePosition?.label || `Position ${prizePosition?.position}`}</p>
                  <p className="text-emerald-400 text-sm font-mono">₹{prizePosition?.amount?.toLocaleString()}</p>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                >
                  {submitMutation.isPending
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</span>
                    : 'Submit Payout Details'
                  }
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
