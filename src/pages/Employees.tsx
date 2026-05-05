import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { Employee } from '../types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Employee>>();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onSubmit = async (data: Partial<Employee>) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: 'Ativo' })
      });
      if (res.ok) {
        setShowModal(false);
        reset();
        fetchEmployees();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cpf.includes(searchTerm)
  );

  const exportCSV = () => {
    const headers = ['Nome', 'CPF', 'Cargo', 'Email', 'Telefone', 'Status', 'Admissao'];
    const rows = filteredEmployees.map(e => [
      e.name,
      e.cpf,
      e.role,
      e.email,
      e.phone,
      e.status,
      new Date(e.admissionDate).toLocaleDateString('pt-BR')
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `funcionarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quadro de Funcionários</h2>
          <p className="text-zinc-500">Gerencie todos os colaboradores da empresa.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCSV}
            className="btn-secondary"
          >
            Exportar CSV
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={18} />
            Cadastrar Funcionário
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, cargo ou CPF..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Funcionário</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Cargo</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Contato</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Admissão</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">Carregando dados...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">Nenhum funcionário encontrado.</td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="data-table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold border border-zinc-200">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{emp.name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono">{emp.cpf}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-700">{emp.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Phone size={12} /> {emp.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Mail size={12} /> {emp.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Calendar size={14} className="text-zinc-400" />
                        {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'Ativo' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/employees/${emp.id}`}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                        <button className="p-2 text-zinc-400 hover:text-zinc-900">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadastro Modal */}
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
                  <h3 className="text-xl font-bold tracking-tight">Novo Colaborador</h3>
                  <p className="text-xs text-zinc-500">Preencha os dados básicos de admissão.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Nome Completo</label>
                    <input {...register("name", { required: true })} className="input-field" placeholder="Ex: João da Silva" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">CPF</label>
                    <input {...register("cpf", { required: true })} className="input-field" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Data de Nascimento</label>
                    <input type="date" {...register("birthDate", { required: true })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Cargo</label>
                    <input {...register("role", { required: true })} className="input-field" placeholder="Ex: Analista de RH" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Telefone</label>
                    <input {...register("phone", { required: true })} className="input-field" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Email Institucional</label>
                    <input type="email" {...register("email", { required: true })} className="input-field" placeholder="joao@gescom.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Endereço Residencial</label>
                    <input {...register("address", { required: true })} className="input-field" placeholder="Rua, Número, Bairro, Cidade - UF" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Data de Admissão</label>
                    <input type="date" {...register("admissionDate", { required: true })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">CNH (Categoria/Número)</label>
                    <input {...register("cnh")} className="input-field" placeholder="Ex: AB - 123456789" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">Normas Regulamentadoras (NRs necessárias)</label>
                    <input {...register("nrs")} className="input-field" placeholder="Ex: NR-10, NR-35, NR-12" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-1.5 block">EPIs Utilizados / Entregues</label>
                    <input {...register("epis")} className="input-field" placeholder="Ex: Bota, Capacete, Luvas de alta tensão" />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                  <button type="submit" className="btn-primary">Finalizar Cadastro</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
