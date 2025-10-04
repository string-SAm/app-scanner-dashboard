import React from 'react';
import { Severity } from '@/types';
import { clsx } from 'clsx';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityClasses = {
  high: 'severity-badge-high',
  warning: 'severity-badge-warning',
  info: 'severity-badge-info',
  secure: 'severity-badge-secure',
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ 
  severity, 
  className 
}) => {
  return (
    <span className={clsx(severityClasses[severity], className)}>
      {severity.toUpperCase()}
    </span>
  );
};
