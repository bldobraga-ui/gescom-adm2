import { useState, useEffect } from 'react';
import { 
  Users, 
  FileWarning, 
  Clock, 
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Employee, Document, Vacancy } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, vacRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/vacancies')
        ]);
        const emps = await empRes.json();
        const vacs = await vacRes.json();
        setEmployees(emps);
        setVacancies(vacs);
        
        // In a real app we'd fetch all docs, for demo we just use what we have
        setDocuments([]); 
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Funcionários', value: employees.length, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Funcionários Ativos', value: employees.filter(e => e.status === 'Ativo').length, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { label: 'Vagas Abertas', value: vacancies.filter(v => v.status === 'Aberta').length, icon: Briefcase, color: 'bg-purple-50 text-purple-600' },
    { label: 'Docs Pendentes', value: 0, icon: FileWarning, color: 'bg-red-50 text-red-600' },
  ];

  const chartData = [
    { name: 'Ativos', value: employees.filter(e => e.status === 'Ativo').length, color: '#10b981' },
    { name: 'Inativos', value: employees.filter(e => e.status === 'Inativo').length, color: '#ef4444' },
    { name: 'Vagas', value: vacancies.length, color: '#8b5cf6' },
  ];

  if (loading) {
    return <div className="animate-pulse flex items-center justify-center h-[50vh]">Carregando Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao GESCOM ADM</h2>
        <p className="text-zinc-500">Visão geral do sistema e alertas administrativos.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold tracking-tight mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Alertas e Pendências</h3>
              <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded">Hoje: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>

            <div className="space-y-4">
              {employees.length === 0 && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50">
                  <AlertCircle className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">Nenhum dado cadastrado</p>
                    <p className="text-xs text-zinc-500">Comece cadastrando novos funcionários no menu lateral.</p>
                  </div>
                </div>
              )}
              
              {employees.filter(e => e.status === 'Inativo').map(e => (
                <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div>
                      <p className="text-sm font-medium">Funcionário Inativo: {e.name}</p>
                      <p className="text-xs text-zinc-500">Status administrativo requer atenção.</p>
                    </div>
                  </div>
                  <Link to={`/employees/${e.id}`} className="p-2 hover:bg-white rounded-full transition-colors">
                    <ChevronRight size={18} className="text-red-400" />
                  </Link>
                </div>
              ))}

              {documents.filter(d => d.status === 'Pendente').map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-yellow-100 bg-yellow-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Documento Pendente: {d.name}</p>
                      <p className="text-xs text-zinc-500">Obrigatório para o funcionário id: {d.employeeId}</p>
                    </div>
                  </div>
                  <Link to={`/employees/${d.employeeId}`} className="p-2 hover:bg-white rounded-full transition-colors">
                    <ChevronRight size={18} className="text-yellow-600" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-6">Distribuição Operacional</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8f8f8' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/employees" className="flex items-center justify-between p-4 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all group">
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span className="text-sm font-medium">Novo Funcionário</span>
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/vacancies" className="flex items-center justify-between p-4 bg-white border border-zinc-200 text-zinc-900 rounded-xl hover:bg-zinc-50 transition-all group">
                <div className="flex items-center gap-3">
                  <Briefcase size={18} />
                  <span className="text-sm font-medium">Abrir Nova Vaga</span>
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Vencimentos Próximos</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Nenhum vencimento nos próximos 30 dias.</p>
                  <p className="text-xs text-zinc-500">Alertas aparecerão aqui automaticamente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
