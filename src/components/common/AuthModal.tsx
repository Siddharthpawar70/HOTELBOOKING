import React, { useMemo, useState } from 'react';
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Screen = 'login' | 'register' | 'forgot' | 'verify';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [identifier, setIdentifier] = useState('rahul.mehta@example.com');
  const [firstName, setFirstName] = useState('Rahul');
  const [lastName, setLastName] = useState('Mehta');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const strength = useMemo(() => {
    const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
    return checks.filter(Boolean).length;
  }, [password]);
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'StayAura Guest';

  if (!isAuthModalOpen) return null;

  const finishLogin = (email = identifier, name = fullName) => {
    login(email || 'guest@stayaura.demo', name);
  };

  const socialLogin = (provider: string) => finishLogin(provider.toLowerCase() + '@stayaura.demo', provider + ' Guest');

  const submitLogin = (event: React.FormEvent) => {
    event.preventDefault();
    finishLogin();
  };

  const submitRegistration = (event: React.FormEvent) => {
    event.preventDefault();
    setScreen('verify');
  };

  const reset = () => {
    setScreen('login');
    setShowDetails(false);
    setCaptchaChecked(false);
  };

  const SocialButtons = () => (
    <div className="grid grid-cols-3 gap-2">
      <button type="button" onClick={() => socialLogin('Google')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Google</button>
      <button type="button" onClick={() => socialLogin('Facebook')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-[#1877F2] hover:bg-blue-50"><span className="text-sm">f</span></button>
      <button type="button" onClick={() => socialLogin('Apple')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-900 hover:bg-gray-50"><Apple className="mx-auto h-4 w-4" /></button>
    </div>
  );

  const FieldLabel = ({ children }: { children: React.ReactNode }) => <label className="mb-1.5 block text-xs font-bold text-gray-700">{children}</label>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#17202A] via-[#253342] to-[#1E252B] px-6 pb-7 pt-8 text-white sm:px-9">
          <button onClick={closeAuthModal} className="absolute right-4 top-4 rounded-full p-2 text-gray-300 hover:bg-white/10 hover:text-white" aria-label="Close authentication"><X className="h-5 w-5" /></button>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C5A880]/20 text-[#E9D8B4]"><Sparkles className="h-5 w-5" /></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">StayAura Members</p>
          <h2 className="mt-1 font-display text-2xl font-bold">
            {screen === 'register' ? 'Create your travel profile' : screen === 'forgot' ? 'Reset your password' : screen === 'verify' ? 'Verify your details' : 'Welcome back'}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-300">
            {screen === 'register' ? 'Start with the essentials — finish your traveller profile whenever you like.' : screen === 'verify' ? 'This is a demonstration verification step. No email or OTP is sent.' : 'Access your bookings, rewards and saved travel preferences.'}
          </p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
          {screen === 'login' && (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <FieldLabel>Email address or phone number</FieldLabel>
                <div className="relative"><Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass + ' pl-10'} placeholder="name@example.com or +91…" /></div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between"><FieldLabel>Password</FieldLabel><button type="button" onClick={() => setScreen('forgot')} className="text-xs font-bold text-[#977341] hover:underline">Forgot password?</button></div>
                <div className="relative"><Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + ' px-10'} placeholder="Enter any password to continue" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600"><label className="flex items-center gap-2"><input checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} type="checkbox" className="accent-[#977341]" /> Remember me</label><button type="button" onClick={() => setTwoFactor(!twoFactor)} className="font-semibold text-[#977341]">{twoFactor ? '2FA enabled' : 'Use 2FA demo'}</button></div>
              {twoFactor && <div className="rounded-xl border border-[#E9D8B4] bg-[#FAF5EB] p-3 text-xs text-[#765A32]"><ShieldCheck className="mr-1 inline h-4 w-4" /> Enter any 6-digit code after login — it is only a demo UI.</div>}
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2D3748]">Login <ArrowRight className="h-4 w-4 text-[#C5A880]" /></button>
              <p className="text-center text-[11px] text-gray-500">Demo mode: any credentials are approved immediately.</p>
              <div className="relative py-1 text-center text-xs text-gray-400 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[42%] before:bg-gray-200 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[42%] after:bg-gray-200">or</div>
              <SocialButtons />
              <div className="grid grid-cols-2 gap-2 pt-1"><button type="button" onClick={() => finishLogin('guest@stayaura.demo', 'Guest Traveller')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Continue as guest</button><button type="button" onClick={() => socialLogin('Corporate SSO')} className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Building2 className="h-3.5 w-3.5" /> Corporate SSO</button></div>
              <p className="pt-1 text-center text-xs text-gray-600">New to StayAura? <button type="button" onClick={() => setScreen('register')} className="font-bold text-[#977341] hover:underline">Create an account</button></p>
            </form>
          )}

          {screen === 'register' && (
            <form onSubmit={submitRegistration} className="space-y-4">
              <div className="grid grid-cols-2 gap-3"><div><FieldLabel>First name</FieldLabel><input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} placeholder="First name" /></div><div><FieldLabel>Last name</FieldLabel><input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} placeholder="Last name" /></div></div>
              <div><FieldLabel>Email address</FieldLabel><div className="relative"><Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input required type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass + ' pl-10'} placeholder="name@example.com" /></div></div>
              <div><FieldLabel>Phone number</FieldLabel><div className="relative"><Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input type="tel" className={inputClass + ' pl-10'} placeholder="For booking updates and optional OTP" /></div></div>
              <div><FieldLabel>Create password</FieldLabel><div className="relative"><Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + ' px-10'} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                <div className="mt-2 flex gap-1">{[1,2,3,4].map((item) => <span key={item} className={'h-1 flex-1 rounded ' + (strength >= item ? (strength >= 4 ? 'bg-emerald-500' : 'bg-[#C5A880]') : 'bg-gray-100')} />)}</div><p className="mt-1 text-[10px] text-gray-500">{strength}/4: 8+ characters, uppercase, number and symbol.</p></div>
              <div><FieldLabel>Confirm password</FieldLabel><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Re-enter password" /><p className="mt-1 text-[10px] text-emerald-700">{confirmPassword && confirmPassword === password ? 'Passwords match' : 'Confirm your password before continuing'}</p></div>
              <button type="button" onClick={() => setShowDetails(!showDetails)} className="flex w-full items-center justify-between rounded-xl border border-dashed border-[#D5CEC5] px-3.5 py-2.5 text-xs font-bold text-[#765A32] hover:bg-[#FAF9F6]">Add travel preferences now (optional)<ChevronDown className={'h-4 w-4 transition ' + (showDetails ? 'rotate-180' : '')} /></button>
              {showDetails && <div className="space-y-3 rounded-2xl bg-[#FAF9F6] p-4"><div className="grid grid-cols-2 gap-3"><select className={inputClass} defaultValue="India"><option>India</option><option>United States</option><option>United Kingdom</option><option>Other</option></select><input type="date" className={inputClass} aria-label="Date of birth" /></div><div className="grid grid-cols-2 gap-3"><select className={inputClass} defaultValue="English"><option>English</option><option>Hindi</option><option>French</option></select><select className={inputClass} defaultValue="INR"><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select></div><label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"><ImagePlus className="h-4 w-4 text-[#977341]" /> Upload profile photo<input type="file" accept="image/*" className="hidden" /></label></div>}
              <label className="flex gap-2 text-xs leading-relaxed text-gray-600"><input checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} type="checkbox" className="mt-0.5 accent-[#977341]" /> Send me member-only offers and travel inspiration.</label>
              <label className="flex gap-2 text-xs leading-relaxed text-gray-600"><input checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} type="checkbox" className="mt-0.5 accent-[#977341]" /> I agree to the <button type="button" className="font-bold text-[#977341] hover:underline">Terms & Conditions</button> and <button type="button" className="font-bold text-[#977341] hover:underline">Privacy Policy</button>.</label>
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600"><input checked={captchaChecked} onChange={(e) => setCaptchaChecked(e.target.checked)} type="checkbox" className="h-4 w-4 accent-[#977341]" /><ShieldCheck className="h-4 w-4 text-emerald-600" /> I am not a robot <span className="ml-auto text-[10px] text-gray-400">Demo CAPTCHA</span></label>
              <button disabled={!acceptTerms} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2D3748] disabled:cursor-not-allowed disabled:opacity-40">Create account <ArrowRight className="h-4 w-4 text-[#C5A880]" /></button>
              <SocialButtons />
              <p className="text-center text-xs text-gray-600">Already a member? <button type="button" onClick={() => setScreen('login')} className="font-bold text-[#977341] hover:underline">Login</button></p>
            </form>
          )}

          {screen === 'forgot' && <div className="space-y-4"><button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-bold text-[#977341]"><ArrowLeft className="h-4 w-4" /> Back to login</button><p className="text-sm text-gray-600">Enter your email or mobile number and we’ll show the reset-success state. Nothing is sent in this prototype.</p><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass} placeholder="Email or phone number" /><button type="button" onClick={() => setScreen('verify')} className="w-full rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white">Send reset link</button></div>}

          {screen === 'verify' && <div className="space-y-5 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><BadgeCheck className="h-7 w-7" /></div><div><h3 className="font-display text-xl font-bold text-gray-900">Check your inbox</h3><p className="mt-1 text-sm text-gray-600">We would send a verification link to <strong>{identifier || 'your email'}</strong>. For this demo, simply continue.</p></div><input inputMode="numeric" maxLength={6} className={inputClass + ' text-center tracking-[0.4em]'} placeholder="000000" aria-label="Mock verification code" /><label className="flex items-center justify-center gap-2 text-xs text-gray-600"><input type="checkbox" /> Also verify my phone by OTP (mock)</label><button type="button" onClick={() => finishLogin()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white">Verify & enter StayAura <ArrowRight className="h-4 w-4 text-[#C5A880]" /></button><button type="button" onClick={() => finishLogin()} className="text-xs font-bold text-[#977341] hover:underline">Skip mock verification</button></div>}
        </div>

        {screen !== 'verify' && <div className="border-t border-gray-100 bg-[#FAF9F6] px-6 py-3 text-center text-[11px] text-gray-500 sm:px-8"><Sparkles className="mr-1 inline h-3.5 w-3.5 text-[#C5A880]" /> Members earn points on every stay, save traveller profiles and access their booking history.</div>}
      </div>
    </div>
  );
}
