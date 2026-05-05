import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Download,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Employee, Document } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'docs'>('info');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, docRes] = await Promise.all([
        fetch(`/api/employees`), // In real app we'd fetch specific ID: /api/employees/${id}
        fetch(`/api/documents/${id}`)
      ]);
      const emps = await empRes.json();
      const currentEmp = emps.find((e: any) => e.id === id);
      setEmployee(currentEmp);
      setDocuments(await docRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', id || '');
    formData.append('type', docType);
    formData.append('name', `${docType} - ${employee?.name}`);
    formData.append('isRequired', 'true');

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Entregue': return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600 px-2 py-0.5 bg-green-50 rounded-full border border-green-100"><CheckCircle2 size={12}/> Entregue</span>;
      case 'Pendente': return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 px-2 py-0.5 bg-red-50 rounded-full border border-red-100"><AlertTriangle size={12}/> Pendente</span>;
      case 'Vencido': return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-100"><Clock size={12}/> Vencido</span>;
      default: return null;
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!employee) return <div>Funcionário não encontrado.</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
        >
          <div className="p-2 bg-zinc-100 rounded-full group-hover:bg-zinc-200">
            <ChevronLeft size={20} />
          </div>
          <span className="font-semibold text-sm">Voltar para listagem</span>
        </button>
        <div className="flex gap-3">
          <button className="btn-secondary">Editar Cadastro</button>
          <button className="btn-primary">Gerar Relatório</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="h-24 bg-zinc-900" />
            <div className="px-6 pb-6 -mt-10">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-zinc-50 flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
                {employee.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold tracking-tight">{employee.name}</h3>
              <p className="text-zinc-500 text-sm mb-6">{employee.role}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Mail size={16} className="text-zinc-400" />
                  {employee.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Phone size={16} className="text-zinc-400" />
                  {employee.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Calendar size={16} className="text-zinc-400" />
                  Admissão: {new Date(employee.admissionDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-600">
                  <MapPin size={16} className="text-zinc-400 mt-0.5" />
                  {employee.address}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400 mb-4">Métricas de Documentação</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Progresso Geral</span>
                <span className="text-sm font-bold">75%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-900 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-zinc-500 italic">Faltam 2 documentos obrigatórios para conformidade total.</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-zinc-200 gap-8">
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'info' ? 'text-zinc-900' : 'text-zinc-400'}`}
            >
              Informações Gerais
              {activeTab === 'info' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'docs' ? 'text-zinc-900' : 'text-zinc-400'}`}
            >
              Documentos e Arquivos
              {activeTab === 'docs' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
            </button>
          </div>

          {activeTab === 'info' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 space-y-4">
                <h4 className="font-bold border-b border-zinc-100 pb-2 mb-4">Dados Pessoais</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">CPF</p>
                    <p className="text-sm font-medium font-mono">{employee.cpf}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Nascimento</p>
                    <p className="text-sm font-medium">{new Date(employee.birthDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6 space-y-4">
                <h4 className="font-bold border-b border-zinc-100 pb-2 mb-4">Dados Profissionais</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Cargo Atual</p>
                    <p className="text-sm font-medium">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Status</p>
                    <p className="text-sm font-medium">{employee.status}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6 space-y-4 md:col-span-2">
                <h4 className="font-bold border-b border-zinc-100 pb-2 mb-4">Requisitos Técnicos e Segurança</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">CNH</p>
                    <p className="text-sm font-medium bg-zinc-50 p-2 rounded border border-zinc-100">{employee.cnh || 'Não informada'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">NRs (Normas)</p>
                    <p className="text-sm font-medium bg-zinc-50 p-2 rounded border border-zinc-100">{employee.nrs || 'Nenhuma registrada'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">EPIs</p>
                    <p className="text-sm font-medium bg-zinc-50 p-2 rounded border border-zinc-100">{employee.epis || 'Nenhum registrado'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">Gerenciamento de Documentos</h4>
                <div className="flex gap-2">
                  <label className="btn-primary cursor-pointer flex items-center gap-2 text-xs">
                    <Upload size={14} />
                    Fazer Upload
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'Outro')} />
                  </label>
                </div>
              </div>

              {/* Document Categories / Mandatory */}
              <div className="grid grid-cols-1 gap-3">
                {['RG', 'CPF', 'Exame Admissional', 'Contrato'].map((requiredType) => {
                  const doc = documents.find(d => d.type === requiredType);
                  return (
                    <div key={requiredType} className="card p-4 flex items-center justify-between hover:border-zinc-300 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${doc ? 'bg-zinc-100 text-zinc-900' : 'bg-red-50 text-red-400'}`}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{requiredType}</p>
                          <p className="text-xs text-zinc-500">Documento Obrigatório</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {doc ? (
                          <>
                            {getStatusBadge(doc.status)}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a 
                                href={doc.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 text-zinc-400 hover:text-zinc-900"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <button className="p-2 text-zinc-400 hover:text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <label className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-red-200 bg-red-50/50 text-red-600 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-all">
                            <Plus size={14} />
                            Anexar Agora
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, requiredType)} />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Other Documents */}
              {documents.filter(d => !['RG', 'CPF', 'Exame Admissional', 'Contrato'].includes(d.type)).length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Outros Documentos</h5>
                  {documents.filter(d => !['RG', 'CPF', 'Exame Admissional', 'Contrato'].includes(d.type)).map(doc => (
                    <div key={doc.id} className="card p-4 flex items-center justify-between border-dashed border-zinc-200">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-zinc-50 text-zinc-400">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{doc.name}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                            Subido em: {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary !p-2">
                           <Download size={16} />
                         </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-900/10 backdrop-blur-[2px] flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border border-zinc-100">
              <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-zinc-900">Enviando documento...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
