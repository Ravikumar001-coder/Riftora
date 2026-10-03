import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Mail, Phone } from 'lucide-react';
import { authService } from '../api/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { GoogleLogin } from '@react-oauth/google';

const emailRegisterSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the Terms of Service and Privacy Policy'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const mobileRegisterSchema = z.object({
  mobileNumber: z.string().trim().min(10, 'Mobile number must be at least 10 digits'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the Terms of Service and Privacy Policy'
  })
});

const otpSchema = z.object({
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits')
});

export function RegisterForm() {
  const [authMode, setAuthMode] = useState('email'); // 'email' | 'mobile'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // States for post-submission
  const [successEmail, setSuccessEmail] = useState(null);
  const [otpSentTo, setOtpSentTo] = useState(null);
  const [oauthLinkData, setOauthLinkData] = useState(null);

  const navigate = useNavigate();
  const { setCredentials } = useAuthStore();
  
  const emailForm = useForm({
    resolver: zodResolver(emailRegisterSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptTerms: false }
  });

  const mobileForm = useForm({
    resolver: zodResolver(mobileRegisterSchema),
    defaultValues: { mobileNumber: '', acceptTerms: false }
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const registerMutation = useMutation({
    mutationFn: authService.registerWithEmail,
    onSuccess: (data, variables) => setSuccessEmail(variables.email),
  });

  const sendOtpMutation = useMutation({
    mutationFn: authService.requestMobileOtp,
    onSuccess: (data, variables) => setOtpSentTo(variables.mobileNumber),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyMobileOtp,
    onSuccess: (data) => {
      setCredentials(data.data.user, data.data.access_token, data.data.refresh_token);
      if (!data.data.user.onboarding_completed) {
        navigate('/onboarding/username');
      } else {
        navigate(data.data.user.onboarding_path === 'organizer' ? '/admin' : '/player');
      }
    }
  });

  const googleAuthMutation = useMutation({
    mutationFn: authService.loginWithGoogle,
    onSuccess: (data) => {
      setCredentials(data.data.user, data.data.access_token, data.data.refresh_token);
      if (!data.data.user.onboarding_completed) {
        navigate('/onboarding/username');
      } else {
        navigate(data.data.user.onboarding_path === 'organizer' ? '/admin' : '/player');
      }
    },
    onError: (error, variables) => {
      if (error.response?.data?.error?.code === 'OAUTH_LINK_REQUIRED') {
        const email = error.response.data.data?.email;
        const idToken = variables.idToken;
        setOauthLinkData({ email, idToken });
      }
    }
  });

  const linkGoogleAccountMutation = useMutation({
    mutationFn: authService.linkGoogleAccount,
    onSuccess: (data) => {
      setCredentials(data.data.user, data.data.access_token, data.data.refresh_token);
      if (!data.data.user.onboarding_completed) {
        navigate('/onboarding/username');
      } else {
        navigate(data.data.user.onboarding_path === 'organizer' ? '/admin' : '/player');
      }
    }
  });

  const onEmailSubmit = (data) => {
    registerMutation.mutate({ email: data.email, password: data.password });
  };

  const onMobileSubmit = (data) => {
    sendOtpMutation.mutate({ mobileNumber: data.mobileNumber, countryCode: '+1' });
  };

  const onOtpSubmit = (data) => {
    verifyOtpMutation.mutate({ mobileNumber: otpSentTo, otp: data.otp });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    googleAuthMutation.mutate({ idToken: credentialResponse.credential });
  };

  const handleConfirmLink = () => {
    linkGoogleAccountMutation.mutate({ idToken: oauthLinkData.idToken });
  };

  // SUCCESS STATES
  if (oauthLinkData) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Link Account</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          An account with <strong className="text-white">{oauthLinkData.email}</strong> already exists. 
          Do you want to link your Google account to it?
        </p>
        
        {linkGoogleAccountMutation.isError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {linkGoogleAccountMutation.error?.response?.data?.error?.message || 'Failed to link account'}
          </div>
        )}

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setOauthLinkData(null)}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleConfirmLink}
            disabled={linkGoogleAccountMutation.isPending}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {linkGoogleAccountMutation.isPending ? 'Linking...' : 'Link Account'}
          </button>
        </div>
      </div>
    );
  }

  if (successEmail) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We've sent a verification link to <strong className="text-white">{successEmail}</strong>. 
        </p>
        <Link to="/auth/login" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (otpSentTo) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-3 text-center">Enter OTP</h2>
        <p className="text-slate-400 mb-6 text-center leading-relaxed">
          We've sent a 6-digit code to <strong className="text-white">{otpSentTo}</strong>.
          <br/>(Check the backend logs for the code)
        </p>

        {verifyOtpMutation.isError && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">
              {verifyOtpMutation.error?.response?.data?.error?.message || "Invalid OTP"}
            </p>
          </div>
        )}

        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">6-Digit Code</label>
            <input
              type="text"
              placeholder="123456"
              maxLength={6}
              disabled={verifyOtpMutation.isPending}
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-center text-xl tracking-widest focus:outline-none focus:border-blue-500"
              {...otpForm.register('otp')}
            />
            {otpForm.formState.errors.otp && (
              <p className="text-red-400 text-xs mt-1.5">{otpForm.formState.errors.otp.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex justify-center items-center gap-2"
          >
            {verifyOtpMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
          </button>
        </form>
        <button 
          onClick={() => setOtpSentTo(null)} 
          className="w-full mt-4 text-sm text-slate-400 hover:text-white"
        >
          Use a different number
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 sm:p-8 rounded-2xl w-full max-w-md mx-auto shadow-2xl shadow-black/50">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Create Account</h2>
      <p className="text-slate-400 text-sm mb-5">Join the Riftora esports ecosystem.</p>

      {/* Social Logins */}
      <div className="flex gap-2 sm:gap-3 mb-5 justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.error('Google login failed')}
          useOneTap
          theme="outline"
          shape="rectangular"
          width="100%"
        />
      </div>

      <div className="relative flex items-center py-1 mb-5">
        <div className="flex-grow border-t border-slate-700/60"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs sm:text-sm">or</span>
        <div className="flex-grow border-t border-slate-700/60"></div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 p-1 rounded-lg mb-6">
        <button
          onClick={() => setAuthMode('email')}
          className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${authMode === 'email' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
        <button
          onClick={() => setAuthMode('mobile')}
          className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${authMode === 'mobile' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
        >
          <Phone className="w-4 h-4" /> Phone
        </button>
      </div>

      {(registerMutation.isError || sendOtpMutation.isError || googleAuthMutation.isError) && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="text-red-400 font-medium">Registration Failed</p>
            <p className="text-red-300/80 mt-0.5">
              {registerMutation.error?.response?.data?.error?.message || 
               sendOtpMutation.error?.response?.data?.error?.message ||
               googleAuthMutation.error?.response?.data?.error?.message ||
               "Please try again."}
            </p>
          </div>
        </div>
      )}

      {/* Form Area */}
      {authMode === 'email' ? (
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
            <input
              type="email"
              disabled={registerMutation.isPending}
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              {...emailForm.register('email')}
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-400 text-xs mt-1.5">{emailForm.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                disabled={registerMutation.isPending}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                {...emailForm.register('password')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {emailForm.formState.errors.password && (
              <p className="text-red-400 text-xs mt-1.5">{emailForm.formState.errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                disabled={registerMutation.isPending}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                {...emailForm.register('confirmPassword')}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {emailForm.formState.errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1.5">{emailForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-slate-600 bg-slate-900/60 text-blue-600 focus:ring-blue-500" {...emailForm.register('acceptTerms')} />
              <span className="text-sm text-slate-300">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {emailForm.formState.errors.acceptTerms && (
              <p className="text-red-400 text-xs mt-1">{emailForm.formState.errors.acceptTerms.message}</p>
            )}
          </div>
          <button type="submit" disabled={registerMutation.isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2">
            {registerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>
      ) : (
        <form onSubmit={mobileForm.handleSubmit(onMobileSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Mobile Number</label>
            <input
              type="tel"
              placeholder="+1234567890"
              disabled={sendOtpMutation.isPending}
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              {...mobileForm.register('mobileNumber')}
            />
            {mobileForm.formState.errors.mobileNumber && (
              <p className="text-red-400 text-xs mt-1.5">{mobileForm.formState.errors.mobileNumber.message}</p>
            )}
          </div>
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-slate-600 bg-slate-900/60 text-blue-600 focus:ring-blue-500" {...mobileForm.register('acceptTerms')} />
              <span className="text-sm text-slate-300">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {mobileForm.formState.errors.acceptTerms && (
              <p className="text-red-400 text-xs mt-1">{mobileForm.formState.errors.acceptTerms.message}</p>
            )}
          </div>
          <button type="submit" disabled={sendOtpMutation.isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2">
            {sendOtpMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
          </button>
        </form>
      )}
      
      <div className="mt-5 text-center border-t border-slate-700/50 pt-4 flex flex-col gap-3">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
