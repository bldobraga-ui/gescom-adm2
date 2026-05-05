/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  admissionDate: string;
  status: 'Ativo' | 'Inativo';
  nrs?: string;
  epis?: string;
  cnh?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  employeeId: string;
  name: string;
  type: string; // 'CV', 'RG', 'CPF', 'Exame', 'Contrato'
  fileUrl: string;
  status: 'Entregue' | 'Pendente' | 'Vencido';
  expiryDate?: string;
  isRequired: boolean;
  createdAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  status: 'Aberta' | 'Fechada';
  createdAt: string;
}

export interface Candidate {
  id: string;
  vacancyId: string;
  name: string;
  email: string;
  phone: string;
  cvUrl?: string;
  appliedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'User';
}
