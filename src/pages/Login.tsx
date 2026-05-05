import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@gescom.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call /api/login
    onLogin({
      id: '1',
      email: email,
      name: 'Administrador GESCOM',
      role: 'Admin'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl">
            G
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">GESCOM ADM</h1>
          <p className="text-zinc-500">Gestão Administrativa de Funcionários</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  placeholder="exemplo@gescom.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 text-zinc-700">Senha de acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                <span className="text-zinc-600">Lembrar acesso</span>
              </label>
              <a href="#" className="text-zinc-900 font-medium hover:underline">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-900/20"
            >
              Entrar no sistema
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-400 text-xs">
            <ShieldCheck size={14} />
            Acesso Restrito e Criptografado
          </div>
        </div>

        <p className="text-center mt-8 text-zinc-400 text-sm">
          &copy; {new Date().getFullYear()} GESCOM ADM. v1.0.0
        </p>
      </div>
    </div>
  );
}
