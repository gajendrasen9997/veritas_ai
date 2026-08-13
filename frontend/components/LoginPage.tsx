import React, { useState } from 'react';
import { Sun, Moon, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isDark, setIsDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login authentication
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      if (onLoginSuccess) {
        setTimeout(onLoginSuccess, 1000);
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between items-center transition-colors duration-700 relative overflow-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>

      {/* Background Animated Ambient Glow Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse transition-colors duration-700 ${
          isDark ? 'bg-indigo-600' : 'bg-blue-400'
        }`} />
        <div className={`absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30 animate-pulse transition-colors duration-700 delay-1000 ${
          isDark ? 'bg-purple-600' : 'bg-violet-300'
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] rounded-full blur-3xl opacity-20 transition-colors duration-700 ${
          isDark ? 'bg-cyan-600' : 'bg-teal-300'
        }`} />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            VeritasAI
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className={`relative p-2.5 rounded-full border transition-all duration-300 shadow-md ${
            isDark
              ? 'bg-slate-900/80 border-slate-700 text-amber-400 hover:border-amber-400/50 hover:bg-slate-800'
              : 'bg-white/80 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-slate-100'
          } backdrop-blur-md`}
          aria-label="Toggle Theme"
        >
          <div className="relative w-5 h-5">
            <Sun className={`w-5 h-5 absolute inset-0 transition-all duration-500 transform ${
              isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0 opacity-0'
            }`} />
            <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-500 transform ${
              isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100'
            }`} />
          </div>
        </button>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-md px-4 z-10 my-auto">
        <div className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 shadow-2xl ${
          isDark
            ? 'bg-slate-900/60 border-slate-800/80 shadow-black/50 hover:border-slate-700'
            : 'bg-white/70 border-white/60 shadow-slate-200/50 hover:border-slate-200'
        }`}>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter your credentials to access your workspace
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h2 className="text-xl font-bold">Authentication Successful</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-3.5 w-5 h-5 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        : 'bg-slate-50/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Password
                  </label>
                  <a href="#forgot" className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-3.5 w-5 h-5 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border text-sm outline-none transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        : 'bg-slate-50/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600"
                />
                <label htmlFor="remember" className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all duration-200 flex justify-center items-center space-x-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-3 ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center space-x-2 transition-colors ${
                isDark
                  ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className={`py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center space-x-2 transition-colors ${
                isDark
                  ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <p className={`mt-6 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Don't have an account?{' '}
            <a href="#signup" className="text-indigo-500 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </main>

      <footer className="w-full text-center py-4 z-10 text-xs opacity-60">
        © {new Date().getFullYear()} VeritasAI. All rights reserved.
      </footer>
    </div>
  );
};
