import React, { useState } from 'react';
import { Avatar } from '../types';
import { generateAvatarImage } from '../services/geminiService';
import { fileToBase64, extractBase64Data } from '../utils/fileUtils';

interface AvatarManagerProps {
  onSelectAvatar: (avatar: Avatar) => void;
}

const AvatarManager: React.FC<AvatarManagerProps> = ({ onSelectAvatar }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToBase64(file);
      const { mimeType, data } = extractBase64Data(dataUrl);
      
      const newAvatar: Avatar = {
        id: Date.now().toString(),
        dataUrl,
        base64Data: data,
        mimeType,
        source: 'upload'
      };
      
      onSelectAvatar(newAvatar);
    } catch (err) {
      console.error(err);
      setError("Failed to process image.");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const dataUrl = await generateAvatarImage(prompt);
      const { mimeType, data } = extractBase64Data(dataUrl);

      const newAvatar: Avatar = {
        id: Date.now().toString(),
        dataUrl,
        base64Data: data,
        mimeType,
        source: 'generated'
      };

      onSelectAvatar(newAvatar);
    } catch (err) {
      console.error(err);
      setError("Failed to generate avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Select Your Avatar</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('generate')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'generate' 
              ? 'text-indigo-500 border-b-2 border-indigo-500' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Generate with AI
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'upload' 
              ? 'text-indigo-500 border-b-2 border-indigo-500' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Upload Existing
        </button>
      </div>

      {activeTab === 'generate' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Describe your character (NanoBanana Model)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A cyberpunk hacker with neon green hair, anime style, facing forward..."
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isLoading || !prompt.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Avatar...
              </>
            ) : (
              'Generate Avatar'
            )}
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center hover:bg-zinc-900/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-zinc-300 font-medium text-lg">Click to upload an image</span>
            <span className="text-zinc-500 text-sm mt-2">PNG, JPG up to 5MB</span>
          </label>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default AvatarManager;