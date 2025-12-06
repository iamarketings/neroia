import React, { useState } from 'react';
import { Avatar, GeneratedVideo } from '../types';
import { generateVideoFromAvatar } from '../services/geminiService';

interface VideoCreatorProps {
  avatar: Avatar;
  onReset: () => void;
}

const VideoCreator: React.FC<VideoCreatorProps> = ({ avatar, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const videoUrl = await generateVideoFromAvatar(avatar, prompt);
      setCurrentVideo(videoUrl);
      
      setHistory(prev => [{
        id: Date.now().toString(),
        videoUrl,
        prompt,
        timestamp: Date.now()
      }, ...prev]);
      
    } catch (err) {
      console.error(err);
      setError("Failed to generate video. Try a simpler prompt or wait a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto h-[80vh]">
      {/* Left Sidebar: Avatar & Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-zinc-400 font-medium uppercase text-xs tracking-wider">Reference Avatar</h3>
            <button 
              onClick={onReset}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Change
            </button>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 bg-black">
            <img 
              src={avatar.dataUrl} 
              alt="Active Avatar" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center">
              <span className="text-xs text-white font-mono">{avatar.source === 'generated' ? 'AI GENERATED' : 'UPLOADED'}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg flex-1 flex flex-col">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Action Prompt (Veo Model)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how the character moves and speaks. E.g., The character laughs and says 'Hello World!'"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mb-4"
          />
          
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-4 rounded-lg font-bold uppercase tracking-wide flex items-center justify-center gap-3 transition-all ${
              isGenerating || !prompt.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isGenerating ? (
              <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rendering Video...
              </>
            ) : (
              'Generate Video'
            )}
          </button>
          
          {error && (
            <p className="text-red-400 text-xs mt-3 text-center bg-red-900/20 p-2 rounded">{error}</p>
          )}
        </div>
      </div>

      {/* Right Area: Result & History */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        {/* Main Display */}
        <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden relative flex items-center justify-center group">
          {currentVideo ? (
            <video 
              src={currentVideo} 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800 group-hover:border-indigo-500/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-700 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-zinc-500 font-medium">Video Output will appear here</h3>
              <p className="text-zinc-600 text-sm mt-2 max-w-sm mx-auto">
                Veo generates 720p videos. This may take up to a minute.
              </p>
            </div>
          )}
        </div>

        {/* History Strip */}
        {history.length > 0 && (
          <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto flex gap-4">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentVideo(item.videoUrl)}
                className={`flex-shrink-0 w-48 h-full rounded-lg overflow-hidden border relative group ${
                  currentVideo === item.videoUrl ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <video src={item.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-[10px] truncate w-full">{item.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCreator;