import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const correctPassword = process.env.APP_PASSWORD;

        if (password === correctPassword) {
            onLogin();
            setError(false);
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4">
                        N
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        NeuroMation
                    </h1>
                    <p className="text-zinc-500">Accès sécurisé requis</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-zinc-600"
                            placeholder="Entrez le mot de passe"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm">Mot de passe incorrect</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5"
                    >
                        Se connecter
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600">
                    <p>© 2024 NeuroMation - Aheshman Itibar</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
