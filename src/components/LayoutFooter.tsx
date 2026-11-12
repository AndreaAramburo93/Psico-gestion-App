import React from 'react';
import { ScreenRoute } from '../types';

interface LayoutFooterProps {
  activeRoute: ScreenRoute;
  onShowToast: (msg: string, icon?: string) => void;
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({ activeRoute, onShowToast }) => {
  if (activeRoute === 'portal-autenticacion') {
    return (
      <footer className="w-full bg-surface-container-low/70 py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant text-body-sm">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-space-lg gap-y-space-xs">
            <button
              type="button"
              onClick={() => onShowToast('Protocolo de Confidencialidad Médica Ley 1090 activo.', 'lock')}
              className="hover:text-primary transition-colors"
            >
              Privacidad y Confidencialidad Médica
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Términos del Servicio de Telepsicología verificados.', 'description')}
              className="hover:text-primary transition-colors"
            >
              Términos del Servicio
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Cifrado AES-256 en reposo y TLS 1.3 en tránsito.', 'verified_user')}
              className="hover:text-primary transition-colors"
            >
              Seguridad HIPAA/Cifrado
            </button>
          </div>
          <div className="text-center md:text-right font-label-sm text-label-sm">
            © 2024 Psico_Gestión. Plataforma Médica Segura.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-surface-container-low mt-space-xl">
      <div className="max-w-[1440px] mx-auto px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant text-body-sm">
        <div className="flex items-center gap-space-sm">
          <span className="font-title-md text-title-md text-primary font-semibold">
            Psico_Gestión
          </span>
          <span>
            © 2024 Plataforma de Salud Mental &amp; Tele-psicología. Todos los derechos reservados.
          </span>
        </div>
        <div className="flex items-center gap-space-lg font-label-sm text-label-sm">
          <button
            type="button"
            onClick={() => onShowToast('Privacidad y Confidencialidad Médica protegida bajo AES-256.', 'shield')}
            className="hover:text-on-surface transition-colors"
          >
            Privacidad y Confidencialidad Médica
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Términos de Teleconsulta disponibles en tu expediente.', 'gavel')}
            className="hover:text-on-surface transition-colors"
          >
            Términos de Teleconsulta
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Línea de Emergencia Emocional 24/7: Marcación rápida 106.', 'sos')}
            className="hover:text-on-surface transition-colors"
          >
            Soporte de Emergencia
          </button>
        </div>
      </div>
    </footer>
  );
};
