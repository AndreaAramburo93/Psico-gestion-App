export type PortalMode = 'clinical' | 'patient';

export type ScreenRoute =
  | 'disponibilidad-y-cobros-terapeuta'
  | 'directorio-de-psicologos'
  | 'historia-clinica-y-evolucion'
  | 'gestion-y-reprogramacion-de-citas'
  | 'agenda-y-calendario-terapeutico'
  | 'mis-citas-paciente'
  | 'proximas-citas'
  | 'mi-perfil-de-paciente'
  | 'especialistas-y-perfil-profesional'
  | 'recordatorios-y-notificaciones'
  | 'portal-autenticacion';

export interface Specialist {
  id: string;
  name: string;
  title: string;
  license: string;
  rating: number;
  reviewCount: number;
  feeUsd: number;
  feeCop: number;
  durationMin: number;
  description: string;
  tags: string[];
  modalityLabel: string;
  modalityType: 'online' | 'presencial' | 'hibrido';
  nextSlot: string;
  featured?: boolean;
  avatarUrl: string;
  accentColor: 'primary' | 'secondary' | 'tertiary';
}

export interface BillingRecord {
  id: string;
  patientName: string;
  initials: string;
  initialsBg: string;
  initialsText: string;
  historyCode: string;
  concept: string;
  dateTime: string;
  sessionLabel: string;
  paymentMethod: string;
  paymentIcon: string;
  amountUsd: number;
  status: 'Cobrado con éxito' | 'En Liquidación' | 'Pendiente';
  receiptNumber?: string;
}

export interface SoapNote {
  id: number;
  title: string;
  dateTime: string;
  subjective: string;
  objective?: string;
  analysis?: string;
  plan?: string;
  signedBy: string;
  hash: string;
  isDefaultOpen?: boolean;
}

export interface CalendarAppointment {
  id: string;
  dayIndex: number; // 0=Lun..5=Sab
  hour: number; // 8..18
  halfOffset?: boolean;
  timeRange: string;
  patientName: string;
  subtitle: string;
  modality: 'virtual' | 'presencial' | 'bloqueo';
  locationOrPlatform: string;
  statusLabel: string;
  accent: 'primary' | 'secondary' | 'tertiary' | 'neutral';
}

export interface NotificationRule {
  id: string;
  title: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  timing: string;
  description: string;
  enabled: boolean;
}

export interface ReminderLogItem {
  id: string;
  patientName: string;
  appointmentTime: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  sentAt: string;
  status: 'Confirmado por paciente' | 'Entregado' | 'Programado';
}
