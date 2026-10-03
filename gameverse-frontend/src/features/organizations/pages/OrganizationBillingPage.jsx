import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CreditCard, CheckCircle2, AlertTriangle, ArrowRight,
  ChevronRight, Calendar, Download, Eye, FileText, Settings,
  ShieldAlert, XCircle, Zap, Building2, HardDrive, Users, Check
} from 'lucide-react';
import { mockBillingData, availablePlans } from '../../../portals/organizer/data/mockBilling';
import { organizerDashboardData } from '../../../portals/organizer/data/mockOrganizerData';
import { usePlansQuery, useOrganizationBySlugQuery } from '../api/useOrganizationQueries';
import { useOrganizationMutations } from '../api/useOrganizationMutations';

const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

export function OrganizationBillingPage() {
  const { orgSlug } = useParams();
  const { data: realPlans } = usePlansQuery();
  const { data: orgProfile } = useOrganizationBySlugQuery(orgSlug);
  const mutations = useOrganizationMutations();
  
  // Local state initialized with mock data
  const [billingData, setBillingData] = useState(mockBillingData);
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  
  // Modals state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPlanToChange, setSelectedPlanToChange] = useState(null);
  
  // Toast state mock
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Organization name fallback
  const orgName = organizerDashboardData.organization.slug === orgSlug 
    ? organizerDashboardData.organization.name 
    : (orgSlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  // Determine current user's role (Mocked as Owner for this view)
  const isOwner = true;

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 max-w-md">You do not have permission to view or manage billing settings for this organization. Only Organization Owners can access this page.</p>
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // --- Actions ---
  const handleInitiatePlanChange = (plan) => {
    setSelectedPlanToChange(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleConfirmPlanChange = async () => {
    if (selectedPlanToChange && orgProfile) {
      try {
        await mutations.changePlan.mutateAsync({
          orgId: orgProfile.orgId,
          planCode: selectedPlanToChange.planCode || selectedPlanToChange.id.toUpperCase()
        });
        showToast(`Successfully changed plan to ${selectedPlanToChange.name}`);
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to change plan. Please try again later.');
      }
    }
    setIsUpgradeModalOpen(false);
    setSelectedPlanToChange(null);
  };

  const handleCancelSubscription = () => {
    setBillingData(prev => ({
      ...prev,
      status: 'CANCELED'
    }));
    showToast('Subscription scheduled for cancellation.');
    setIsCancelModalOpen(false);
  };

  // --- Render Helpers ---
  const renderProgressBar = (current, limit, label) => {
    const isUnlimited = limit === Infinity;
    const percentage = isUnlimited ? 0 : Math.min(100, Math.round((current / limit) * 100));
    const isNearLimit = !isUnlimited && percentage >= 80;
    const isAtLimit = !isUnlimited && percentage >= 100;
    
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium">{label}</span>
          <span className="text-white font-semibold">
            {current} / {isUnlimited ? 'Unlimited' : limit}
          </span>
        </div>
        {!isUnlimited && (
          <>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden" aria-label={`${current} of ${limit} ${label.toLowerCase()} used`}>
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-blue-500'}`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
            {isAtLimit ? (
              <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> You've reached your current limit.</p>
            ) : isNearLimit ? (
              <p className="text-xs text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> You're approaching your limit.</p>
            ) : null}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen pb-12 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-800 border border-slate-700 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-white text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{orgName}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-amber-500">Billing</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Billing & Plans</h1>
          <p className="text-slate-400">Manage your organization's plan, usage, and billing information.</p>
        </div>
        <a 
          href="#plans"
          className="shrink-0 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Manage Plan
        </a>
      </header>

      {/* Status Banner */}
      <div className={`mb-8 p-4 rounded-xl border flex items-start sm:items-center gap-4 ${
        billingData.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
        billingData.status === 'PAST_DUE' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
        billingData.status === 'TRIAL' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
        billingData.status === 'CANCELED' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
        'bg-slate-800 border-slate-700 text-slate-300'
      }`}>
        <div className="shrink-0 mt-0.5 sm:mt-0">
          {billingData.status === 'ACTIVE' && <CheckCircle2 className="w-6 h-6" />}
          {billingData.status === 'PAST_DUE' && <AlertTriangle className="w-6 h-6" />}
          {billingData.status === 'TRIAL' && <Zap className="w-6 h-6" />}
          {billingData.status === 'CANCELED' && <XCircle className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base">
            {billingData.status === 'ACTIVE' && `Your ${billingData.plan.name} plan is active`}
            {billingData.status === 'PAST_DUE' && `Payment issue`}
            {billingData.status === 'TRIAL' && `You're on a ${billingData.plan.name} trial`}
            {billingData.status === 'CANCELED' && `Subscription scheduled for cancellation`}
          </h3>
          <p className="text-sm opacity-90 mt-1">
            {billingData.status === 'ACTIVE' && `Your current billing period ends on ${formatDate(billingData.plan.renewalDate)}.`}
            {billingData.status === 'PAST_DUE' && `Your latest payment could not be completed. Please update your payment method.`}
            {billingData.status === 'TRIAL' && `Your trial ends on ${formatDate(billingData.plan.trialEndsAt || billingData.plan.renewalDate)}.`}
            {billingData.status === 'CANCELED' && `Your organization will remain on the current plan until ${formatDate(billingData.plan.renewalDate)}.`}
          </p>
        </div>
        {billingData.status === 'PAST_DUE' && (
          <button className="hidden sm:block shrink-0 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-600/20">
            Update Payment Method
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Current Plan Card */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Current Plan</h2>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/20">
              {billingData.plan.name}
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">
                {billingData.plan.priceMonthly === 0 ? 'Free' : formatCurrency(billingData.plan.priceMonthly, billingData.plan.currency)}
              </span>
              {billingData.plan.priceMonthly > 0 && <span className="text-slate-400">/ month</span>}
            </div>
            <p className="text-sm text-slate-400 mt-2">{billingData.plan.description}</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex justify-between text-sm py-3 border-b border-slate-800">
              <span className="text-slate-400">Status</span>
              <span className="text-white font-medium capitalize">{billingData.status.toLowerCase().replace('_', ' ')}</span>
            </div>
            {billingData.plan.priceMonthly > 0 && (
              <div className="flex justify-between text-sm py-3 border-b border-slate-800">
                <span className="text-slate-400">Next billing date</span>
                <span className="text-white font-medium">{formatDate(billingData.plan.renewalDate)}</span>
              </div>
            )}
          </div>

          <a href="#plans" className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            Change Plan
          </a>
        </div>

        {/* Usage Card */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Plan Usage</h2>
            <p className="text-sm text-slate-400">Your organization's current usage across the platform.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {renderProgressBar(billingData.usage.tournaments.current, billingData.usage.tournaments.limit, 'Active Tournaments')}
            {renderProgressBar(billingData.usage.members.current, billingData.usage.members.limit, 'Organization Members')}
            {renderProgressBar(billingData.usage.storage.current, billingData.usage.storage.limit, 'Storage (GB)')}
            {renderProgressBar(billingData.usage.activeEvents.current, billingData.usage.activeEvents.limit, 'Concurrent Live Events')}
          </div>
        </div>
      </div>

      {/* Available Plans Section */}
      <div id="plans" className="mb-12 scroll-mt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Choose a plan</h2>
          <div className="inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button 
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${billingCycle === 'MONTHLY' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('YEARLY')}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${billingCycle === 'YEARLY' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Yearly <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(realPlans ? realPlans.map(rp => ({
            id: rp.planCode,
            name: rp.planName,
            description: `Up to ${rp.maxActiveMembers || 'unlimited'} members & ${rp.maxTournaments || 'unlimited'} tournaments`,
            priceMonthly: rp.priceMonthly,
            priceYearly: rp.priceMonthly * 10,
            features: [
              `Max ${rp.maxTeamsPerTournament} teams per tournament`,
              ...(rp.features ? Object.keys(rp.features).map(k => k.replace('_', ' ')) : [])
            ]
          })) : availablePlans).map(plan => {
            const isCurrentPlan = billingData.plan.id === plan.id;
            const price = billingCycle === 'MONTHLY' ? plan.priceMonthly : plan.priceYearly;
            
            return (
              <div key={plan.id} className={`flex flex-col bg-slate-900/50 border rounded-2xl p-6 relative overflow-hidden transition-colors ${isCurrentPlan ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                {isCurrentPlan && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    Current Plan
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{plan.description}</p>
                
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {price === 0 ? 'Free' : formatCurrency(price, plan.currency)}
                  </span>
                  {price > 0 && <span className="text-slate-400">/ {billingCycle.toLowerCase().replace('ly', '')}</span>}
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  disabled={isCurrentPlan}
                  onClick={() => handleInitiatePlanChange(plan)}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all ${
                    isCurrentPlan 
                      ? 'bg-slate-800 text-slate-400 cursor-default' 
                      : plan.name === 'BUSINESS'
                      ? 'bg-white text-slate-900 hover:bg-slate-200 shadow-lg'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : (plan.priceMonthly > billingData.plan.priceMonthly ? 'Upgrade Plan' : 'Downgrade Plan')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Payment Method */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Payment Method</h2>
          
          {billingData.paymentMethod ? (
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{billingData.paymentMethod.type} ending in {billingData.paymentMethod.last4}</p>
                  <p className="text-sm text-slate-500">Expires {billingData.paymentMethod.expMonth}/{billingData.paymentMethod.expYear}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-950 border border-slate-800 border-dashed rounded-xl mb-6 text-center">
              <CreditCard className="w-8 h-8 text-slate-600 mb-3" />
              <p className="text-white font-medium mb-1">No payment method added</p>
              <p className="text-sm text-slate-500">Add a payment method to manage your subscription.</p>
            </div>
          )}
          
          <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
            {billingData.paymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
          </button>
        </div>

        {/* Billing Information */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Billing Information</h2>
          
          <div className="space-y-4 mb-6 text-sm">
            <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
              <span className="text-slate-500">Organization</span>
              <span className="col-span-2 text-white font-medium">{billingData.billingInformation.organizationName}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
              <span className="text-slate-500">Email</span>
              <span className="col-span-2 text-white">{billingData.billingInformation.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
              <span className="text-slate-500">Country</span>
              <span className="col-span-2 text-white">{billingData.billingInformation.country}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 pb-2">
              <span className="text-slate-500">GST / Tax ID</span>
              <span className="col-span-2 text-white">{billingData.billingInformation.taxId || <span className="text-slate-500 italic">Not configured</span>}</span>
            </div>
          </div>
          
          <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
            Edit Billing Information
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Billing History</h2>
            <p className="text-sm text-slate-400">View and download your past invoices.</p>
          </div>
        </div>
        
        {billingData.invoices.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Period</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {billingData.invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-sm font-medium text-white">{inv.id}</td>
                      <td className="p-4 text-sm text-slate-300">{formatDate(inv.date)}</td>
                      <td className="p-4 text-sm text-white">{formatCurrency(inv.amount, inv.currency)}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{inv.period}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-slate-400 hover:text-white transition-colors" aria-label="View Invoice"><Eye className="w-4 h-4"/></button>
                          <button className="text-slate-400 hover:text-white transition-colors" aria-label="Download Invoice"><Download className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-slate-800/50">
              {billingData.invoices.map(inv => (
                <div key={inv.id} className="p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white mb-1">{inv.id}</p>
                      <p className="text-xs text-slate-500">{formatDate(inv.date)} • {inv.period}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-white">{formatCurrency(inv.amount, inv.currency)}</p>
                    <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium">
                      <FileText className="w-4 h-4" /> View Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <FileText className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No billing history</h3>
            <p className="text-slate-400 max-w-sm">Invoices will appear here once billing activity is available for this organization.</p>
          </div>
        )}
      </div>
      
      {/* Footer / Danger Zone */}
      {billingData.status !== 'CANCELED' && billingData.plan.priceMonthly > 0 && (
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => setIsCancelModalOpen(true)}
            className="text-sm font-medium text-slate-500 hover:text-red-400 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* --- Modals --- */}
      
      {/* Plan Change Modal */}
      {isUpgradeModalOpen && selectedPlanToChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsUpgradeModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedPlanToChange.priceMonthly > billingData.plan.priceMonthly ? 'Upgrade to' : 'Downgrade to'} {selectedPlanToChange.name}?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {selectedPlanToChange.priceMonthly < billingData.plan.priceMonthly 
                ? 'Some features or limits may no longer be available on the lower plan. Please review the changes.'
                : 'You are about to unlock new features and limits for your organization.'}
            </p>
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-white mb-3">{selectedPlanToChange.name} includes:</h4>
              <ul className="space-y-2 mb-4">
                {selectedPlanToChange.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-lg font-bold text-white border-t border-slate-800 pt-3">
                {formatCurrency(billingCycle === 'MONTHLY' ? selectedPlanToChange.priceMonthly : selectedPlanToChange.priceYearly, selectedPlanToChange.currency)}
                <span className="text-sm font-normal text-slate-400"> / {billingCycle.toLowerCase().replace('ly', '')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPlanChange}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                Confirm {selectedPlanToChange.priceMonthly > billingData.plan.priceMonthly ? 'Upgrade' : 'Downgrade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCancelModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Cancel subscription?</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Your organization will remain on the current plan until the end of the current billing period on <span className="text-white font-medium">{formatDate(billingData.plan.renewalDate)}</span>. After this date, you will be moved to the Free plan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
              >
                Keep Subscription
              </button>
              <button 
                onClick={handleCancelSubscription}
                className="px-4 py-2 rounded-lg bg-red-600/10 text-red-400 font-medium hover:bg-red-600 hover:text-white transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
