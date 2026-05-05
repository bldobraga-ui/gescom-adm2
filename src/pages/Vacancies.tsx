import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Briefcase, 
  ExternalLink,
  Users,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Vacancy, Candidate } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';

export default function Vacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm<Partial<Vacancy>>();

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vacancies');
      const data = await res.json();
      setVacancies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const onSubmit = async (data: Partial<Vacancy>) => {
    try {
      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: 'Aberta', requirements: [] })
      });
      if (res.ok) {
        setShowModal(false);
        reset();
        fetchVacancies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Vagas</h2>
          <p className="text-zinc-500">Acompanhe seus processos seletivos ativos.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Nova Vaga
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total de Vagas</p>
            <h3 className="text-2xl font-bold">{vacancies.length}</h3>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Vagas Abertas</p>
            <h3 className="text-2xl font-bold">{vacancies.filter(v => v.status === 'Aberta').length}</h3>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4 text-zinc-400">
          <div className="p-3 bg-zinc-50 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Candidatos Inscritos</p>
            <h3 className="text-2xl font-bold">0</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          <div className="card p-12 flex justify-center text-zinc-400">Carregando vagas...</div>
        ) : vacancies.length === 0 ? (
          <div className="xl:col-span-2 card p-12 text-center text-zinc-500">
            <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-semibold">Nenhuma vaga cadastrada.</p>
            <p className="text-sm">Abra um novo processo seletivo para receber candidaturas.</p>
          </div>
        ) : (
          vacancies.map((vacancy, i) => (
            <motion.div
              key={vacancy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card group hover:border-zinc-400 transition-all flex flex-col sm:flex-row"
            >
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    vacancy.status === 'Aberta' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {vacancy.status}
                  </span>
                  <div className="text-xs font-mono text-zinc-400">
                    ID: {vacancy.id.split('-')[0].toUpperCase()}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-zinc-900 transition-colors">{vacancy.title}</h4>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-6">{vacancy.description}</p>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock size={14} />
                    Criada em: {new Date(vacancy.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Users size={14} />
                    0 candidatos
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-50 sm:w-16 border-t sm:border-t-0 sm:border-l border-zinc-100 flex sm:flex-col items-center justify-center p-4 sm:p-0 gap-4 sm:gap-0">
                <button className="flex-1 sm:w-full sm:h-1/2 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                  <ExternalLink size={20} />
                </button>
                <div className="w-px h-8 bg-zinc-200 sm:w-full sm:h-px" />
                <button className="flex-1 sm:w-full sm:h-1/2 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Vaga Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Nova Vaga de Trabalho</h3>
                  <p className="text-xs text-zinc-500">Cadastre uma nova oportunidade no sistema.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Título da Vaga</label>
                  <input {...register("title", { required: true })} className="input-field" placeholder="Ex: Desenvolvedor Senior" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Descrição Técnica / Responsabilidades</label>
                  <textarea 
                    {...register("description", { required: true })} 
                    className="input-field min-h-[120px] py-3 h-auto" 
                    placeholder="Descreva as funções, stack tecnológica e o que se espera do candidato..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Nível de Experiência</label>
                    <select className="input-field">
                      <option>Junior</option>
                      <option>Pleno</option>
                      <option>Senior</option>
                      <option>Especialista</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Modalidade</label>
                    <select className="input-field">
                      <option>Presencial</option>
                      <option>Híbrido</option>
                      <option>Remoto</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                  <button type="submit" className="btn-primary">Criar Vaga</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
