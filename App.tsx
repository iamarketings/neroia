import React, { useEffect, useState } from 'react';
import { AppState, Avatar } from './types';
import AvatarManager from './components/AvatarManager';
import VideoCreator from './components/VideoCreator';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECT_KEY);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [keyError, setKeyError] = useState(false);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        // Check if API key is available in environment variables
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (apiKey && apiKey.trim() !== '') {
          setAppState(AppState.AVATAR_SELECTION);
        }
      } catch (e) {
        console.error("Error checking for API key", e);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // Since we're using environment variables, this function is not needed
    // but we'll keep it for UI consistency
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      setAppState(AppState.AVATAR_SELECTION);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  const handleAvatarSelection = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setAppState(AppState.VIDEO_GENERATION);
  };

  const handleReset = () => {
    setSelectedAvatar(null);
    setAppState(AppState.AVATAR_SELECTION);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
               N
             </div>
             <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
               NeuroMation
             </h1>
          </div>
          <div className="flex gap-4 text-sm text-zinc-500">
            <span className={appState === AppState.SELECT_KEY ? 'text-indigo-400' : ''}>1. Access</span>
            <span className={appState === AppState.AVATAR_SELECTION ? 'text-indigo-400' : ''}>2. Avatar</span>
            <span className={appState === AppState.VIDEO_GENERATION ? 'text-indigo-400' : ''}>3. Generate</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-12 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        
        {appState === AppState.SELECT_KEY && (
          <div className="text-center max-w-md w-full animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4">Unlock Creativity</h2>
            <p className="text-zinc-400 mb-8">
              To use the Veo (Video Generation) and Gemini 2.5 (NanoBanana) models, 
              please select a paid API key from your Google Cloud project.
            </p>
            <button
              onClick={handleSelectKey}
              className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5"
            >
              Select Google API Key
            </button>
            
            {keyError && (
              <p className="mt-4 text-red-400 text-sm">
                Selection failed. Please try again. 
                Ensure you have a billing-enabled project.
              </p>
            )}

            <div className="mt-8 pt-8 border-t border-zinc-800 text-xs text-zinc-600">
              Need help? View <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">billing documentation</a>.
            </div>
          </div>
        )}

        {appState === AppState.AVATAR_SELECTION && (
          <div className="w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Create Your Character</h2>
              <p className="text-zinc-400">Upload a reference or generate one using Gemini 2.5</p>
            </div>
            <AvatarManager onSelectAvatar={handleAvatarSelection} />
          </div>
        )}

        {appState === AppState.VIDEO_GENERATION && selectedAvatar && (
          <div className="w-full">
             <VideoCreator avatar={selectedAvatar} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;