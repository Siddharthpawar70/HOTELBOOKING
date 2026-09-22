import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('rahul.mehta@example.com');
  const [name, setName] = useState('Rahul Mehta');
  const [password, setPassword] = useState('StayAura2026!');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, isRegister ? name : undefined);
  };

  const handleDemoLogin = (demoEmail: string, demoName: string) => {
    login(demoEmail, demoName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#1E252B] to-[#2D3748] px-8 pt-8 pb-6 text-white text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl font-bold">
            {isRegister ? 'Join StayAura Club' : 'Welcome to StayAura'}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            {isRegister
              ? 'Unlock member exclusive rates, room upgrades & tier points.'
              : 'Sign in to access your luxury reservations & rewards.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-[#1E252B] text-[#FAF9F6] text-sm font-bold hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>{isRegister ? 'Create Account & Earn 500 Pts' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2.5">Quick Demo Profile:</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('rahul.mehta@example.com', 'Rahul Mehta')}
                className="px-3 py-1.5 rounded-lg bg-[#FAF5EB] text-[#977341] text-xs font-semibold hover:bg-[#F3EAD5] transition-colors cursor-pointer"
              >
                Rahul (Gold Member)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('priya.sharma@example.com', 'Priya Sharma')}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Priya (Platinum VIP)
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-600">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-[#C5A880] font-bold hover:underline"
              >
                {isRegister ? 'Sign In' : 'Join StayAura Club'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
