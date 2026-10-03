import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, CreditCard, Wallet, Smartphone, ShieldCheck, Clock, XCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useConfirmRegistration, useProcessMockPayment, useGetRegistrationById } from '../../api/useRegistrationQueries';

export function ConfirmRegistrationStep({ tournament, team, registrationId, onSuccess, onBack }) {
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // Default payment method
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  const { data: registration } = useGetRegistrationById(registrationId, { enabled: !!registrationId });
  const { mutateAsync: confirmRegistration, isPending: isConfirming } = useConfirmRegistration();
  const { mutateAsync: processMockPayment, isPending: isPaying } = useProcessMockPayment();
  const isSubmitting = isConfirming || isPaying;

  const isWaitlistRequest = registration?.isWaitlistRequest;
  const isPaid = tournament.entryFee && tournament.entryFee > 0 && !isWaitlistRequest;

  useEffect(() => {
    if (!registration?.reservationExpiresAt) return;
    
    const calculateTimeLeft = () => {
      const expiresAt = new Date(registration.reservationExpiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiresAt - now;
      
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('00:00');
        return;
      }
      
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [registration?.reservationExpiresAt]);

  const handleSubmit = async () => {
    setError('');
    try {
      if (isPaid) {
        await processMockPayment({ registrationId, paymentMethod });
      }
      await confirmRegistration(registrationId);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Registration couldn\'t be completed.');
    }
  };

  if (isPaid) {
    return (
      <div className="space-y-6">
        {isExpired ? (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">Reservation Expired</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              Your 15-minute reservation window has expired. You need to restart the registration process.
            </p>
            <Button onClick={() => window.location.reload()}>Restart Registration</Button>
          </div>
        ) : (
          <>
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">Payment Required</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Complete your payment to secure your slot in the tournament.
              </p>
              {timeLeft && (
                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold tracking-widest">Reservation expires in: {timeLeft}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Entry Fee</span>
            <span className="text-2xl font-bold text-green-400">{tournament.prizeCurrency || 'INR'} {tournament.entryFee}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Select Payment Method</h3>
          
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'UPI' ? 'bg-blue-950/30 border-blue-500' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="UPI" 
                className="sr-only" 
                checked={paymentMethod === 'UPI'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Smartphone className={`w-5 h-5 mr-3 ${paymentMethod === 'UPI' ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${paymentMethod === 'UPI' ? 'text-blue-300' : 'text-slate-300'}`}>UPI</p>
                <p className="text-xs text-slate-500">GPay, PhonePe, Paytm UPI</p>
              </div>
              {paymentMethod === 'UPI' && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'CARD' ? 'bg-blue-950/30 border-blue-500' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="CARD" 
                className="sr-only" 
                checked={paymentMethod === 'CARD'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'CARD' ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${paymentMethod === 'CARD' ? 'text-blue-300' : 'text-slate-300'}`}>Card</p>
                <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
              </div>
              {paymentMethod === 'CARD' && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'WALLET' ? 'bg-blue-950/30 border-blue-500' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="WALLET" 
                className="sr-only" 
                checked={paymentMethod === 'WALLET'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Wallet className={`w-5 h-5 mr-3 ${paymentMethod === 'WALLET' ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${paymentMethod === 'WALLET' ? 'text-blue-300' : 'text-slate-300'}`}>Wallet</p>
                <p className="text-xs text-slate-500">Paytm, Amazon Pay</p>
              </div>
              {paymentMethod === 'WALLET' && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </label>
          </div>

          <div className="mt-6 flex items-center justify-center text-xs text-slate-500 gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Secured by Mock Payment Gateway
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3 max-w-md mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-400 mb-1">{error}</h4>
              <p className="text-sm text-red-300/80 mb-3">Please try your payment again.</p>
              <Button size="sm" variant="outline" className="border-red-900 text-red-400 hover:bg-red-950" onClick={() => setError('')}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-slate-800 max-w-md mx-auto">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Cancel Payment
          </Button>
          <Button 
            size="lg"
            onClick={handleSubmit} 
            disabled={isSubmitting || !!error || isExpired}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ${tournament.prizeCurrency || 'INR'} ${tournament.entryFee}`
            )}
          </Button>
        </div>
        </>
        )}
      </div>
    );
  }

  // Free Registration flow
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
          {isWaitlistRequest ? 'Join Waitlist?' : 'Ready to Register?'}
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          {isWaitlistRequest 
            ? "This tournament is currently full. Submitting will place your team on the waitlist. You will not be charged until a slot opens up."
            : "You are about to submit your team's registration for this tournament."
          }
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md mx-auto space-y-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">You're registering:</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 rounded-lg bg-slate-800">
              {team.logo && <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" />}
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none mb-1">{team.name}</p>
              <p className="text-xs text-slate-400">{team.tag}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">For:</p>
          <div className="mt-2">
            <p className="text-lg font-bold text-white leading-none mb-1">{tournament.name}</p>
            <p className="text-sm text-slate-400">{tournament.game}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Team Captain:</p>
          <p className="text-sm font-medium text-white">You</p>
        </div>
      </div>

      <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4 flex items-start gap-3 max-w-md mx-auto">
        <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300/80">
          Once submitted, registration status will be shown in <strong className="text-blue-300">My Registration</strong>.
          {isWaitlistRequest && " Waitlisted teams will be notified if a slot opens."}
        </p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3 max-w-md mx-auto">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-1">{error}</h4>
            <p className="text-sm text-red-300/80 mb-3">Please review your team information and try again.</p>
            <Button size="sm" variant="outline" className="border-red-900 text-red-400 hover:bg-red-950" onClick={() => setError('')}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button 
          size="lg"
          onClick={handleSubmit} 
          disabled={isSubmitting || !!error}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            isWaitlistRequest ? 'Confirm Waitlist' : 'Confirm Registration'
          )}
        </Button>
      </div>
    </div>
  );
}
