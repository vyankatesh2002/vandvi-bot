
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { VandvikVisual } from './VandvikVisual';
import { GoogleIcon } from './icons/GoogleIcon';
import { MicrosoftIcon } from './icons/MicrosoftIcon';
import { GithubIcon } from './icons/GithubIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { AnimatedBackground } from './AnimatedBackground';
import { CLICK_SOUND_BASE64, SUBMIT_SOUND_BASE64 } from '../data/sounds';

interface LoginProps {
  onLogin: (user: User) => void;
  isSoundEnabled: boolean;
}

type AuthView = 'login' | 'signup' | 'forgot';


const useSounds = (isSoundEnabled: boolean) => {
  const [clickAudio] = useState(() => {
    const audio = new Audio(CLICK_SOUND_BASE64);
    audio.volume = 0.3;
    return audio;
  });
  const [submitAudio] = useState(() => {
    const audio = new Audio(SUBMIT_SOUND_BASE64);
    audio.volume = 0.4;
    return audio;
  });

  const playSound = (type: 'click' | 'submit') => {
    if (!isSoundEnabled) return;
    try {
      if (type === 'click') {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(e => console.error("Error playing click sound:", e));
      } else {
        submitAudio.currentTime = 0;
        submitAudio.play().catch(e => console.error("Error playing submit sound:", e));
      }
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  };
  
  return playSound;
};


// =========================================================================
// Login Form Component
// =========================================================================
const LoginForm: React.FC<{ onLogin: (user: User) => void; setView: (view: AuthView) => void; playSound: (type: 'click' | 'submit') => void; }> = ({ onLogin, setView, playSound }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const avatar = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`;
    playSound('submit');
    onLogin({ email, name, avatar });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="email-login" className="sr-only">Email</label>
          <input
            id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address" autoComplete="email" required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
          />
        </div>
        <div>
           <label htmlFor="password-login" className="sr-only">Password</label>
           <input
            id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" autoComplete="current-password" required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" onMouseDown={() => playSound('click')} className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500">
          Login
        </button>
      </form>
      <div className="text-center text-sm mt-4">
        <button onMouseDown={() => playSound('click')} onClick={() => setView('forgot')} className="text-cyan-400 hover:underline">Forgot password?</button>
        <span className="text-zinc-500 mx-2">|</span>
        <button onMouseDown={() => playSound('click')} onClick={() => setView('signup')} className="text-cyan-400 hover:underline">Don't have an account? Sign Up</button>
      </div>
    </>
  );
};

// =========================================================================
// Sign Up Form Component
// =========================================================================
const SignUpForm: React.FC<{ onLogin: (user: User) => void; setView: (view: AuthView) => void; playSound: (type: 'click' | 'submit') => void; }> = ({ onLogin, setView, playSound }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      if (!name || !email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      const avatar = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`;
      playSound('submit');
      onLogin({ email, name, avatar });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label htmlFor="name-signup" className="sr-only">Full Name</label>
                    <input
                        id="name-signup" type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name" autoComplete="name" required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                    />
                </div>
                <div>
                    <label htmlFor="email-signup" className="sr-only">Email</label>
                    <input
                        id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" autoComplete="email" required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                    />
                </div>
                <div>
                    <label htmlFor="password-signup" className="sr-only">Password</label>
                    <input
                        id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" autoComplete="new-password" required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                    />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" onMouseDown={() => playSound('click')} className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500">
                    Create Account
                </button>
            </form>
            <p className="text-center text-sm mt-4">
                <button onMouseDown={() => playSound('click')} onClick={() => setView('login')} className="text-cyan-400 hover:underline">Already have an account? Log In</button>
            </p>
        </>
    );
};

// =========================================================================
// Forgot Password Form Component
// =========================================================================
const ForgotPasswordForm: React.FC<{ setView: (view: AuthView) => void; playSound: (type: 'click' | 'submit') => void; }> = ({ setView, playSound }) => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Simulate sending a reset email
        playSound('submit');
        setSent(true);
    };

    if (sent) {
        return (
            <div className="text-center">
                <p className="text-white">If an account exists for <span className="font-bold">{email}</span>, you will receive a password reset link in your inbox.</p>
                <button onMouseDown={() => playSound('click')} onClick={() => setView('login')} className="text-cyan-400 hover:underline mt-4">Back to Login</button>
            </div>
        );
    }
    
    return (
        <>
            <p className="text-zinc-400 text-center mb-4">Enter your email and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label htmlFor="email-forgot" className="sr-only">Email</label>
                    <input
                        id="email-forgot" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" autoComplete="email" required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                    />
                </div>
                <button type="submit" onMouseDown={() => playSound('click')} className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500">
                    Send Reset Link
                </button>
            </form>
            <p className="text-center text-sm mt-4">
                <button onMouseDown={() => playSound('click')} onClick={() => setView('login')} className="text-cyan-400 hover:underline">Back to Login</button>
            </p>
        </>
    );
};


// =========================================================================
// Main Login Component
// =========================================================================
export const Login: React.FC<LoginProps> = ({ onLogin, isSoundEnabled }) => {
  const [view, setView] = useState<AuthView>('login');
  const playSound = useSounds(isSoundEnabled);

  const handleSocialLogin = (provider: string) => {
    playSound('submit');
    const name = `${provider} User`;
    const email = `${provider.toLowerCase()}.user@example.com`;
    const avatar = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const user: User = { name, email, avatar };
    onLogin(user);
  };

  const titles: Record<AuthView, string> = {
    login: "Welcome Back",
    signup: "Create Your Account",
    forgot: "Reset Your Password"
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen w-screen bg-transparent text-white flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden">
        
        <div className="flex flex-col items-center text-center animate-fade-in-up">
          <VandvikVisual isThinking={false} />
          <h1 className="text-4xl font-bold mt-6 text-white">Vandvik</h1>
          <p className="text-zinc-400 mt-2">Unlock Your Digital Twin. Access powerful tools and a personalized experience.</p>
        </div>

        <div className="w-full max-w-sm mt-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold text-center text-white mb-6">{titles[view]}</h2>
          
          {view === 'login' && <LoginForm onLogin={onLogin} setView={setView} playSound={playSound} />}
          {view === 'signup' && <SignUpForm onLogin={onLogin} setView={setView} playSound={playSound} />}
          {view === 'forgot' && <ForgotPasswordForm setView={setView} playSound={playSound} />}

          {view === 'login' && (
            <>
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-zinc-700"></div>
                <span className="flex-shrink mx-4 text-zinc-500 text-sm">OR</span>
                <div className="flex-grow border-t border-zinc-700"></div>
              </div>
              <div className="space-y-3">
                 <button onMouseDown={() => playSound('click')} onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                  <GoogleIcon /> Continue with Google
                </button>
                 <button onMouseDown={() => playSound('click')} onClick={() => handleSocialLogin('Microsoft')} className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                  <MicrosoftIcon /> Continue with Microsoft
                </button>
                <button onMouseDown={() => playSound('click')} onClick={() => handleSocialLogin('GitHub')} className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                  <GithubIcon /> Continue with GitHub
                </button>
                <button onMouseDown={() => playSound('click')} onClick={() => handleSocialLogin('Facebook')} className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                  <FacebookIcon /> Continue with Facebook
                </button>
              </div>
            </>
          )}
        </div>
        <p className="text-xs text-zinc-600 mt-8 text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          Note: This is a simulated authentication system for demonstration.
        </p>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
};
