import { NavLink } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  Briefcase, 
  LogOut, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employees', icon: Users, label: 'Funcionários' },
    { to: '/vacancies', icon: Briefcase, label: 'Vagas' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold">
          G
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">GESCOM ADM</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">Gestão Administrativa</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'sidebar-link-active' : 'sidebar-link')}
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600">
            <UserIcon size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <div className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-green-600" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
