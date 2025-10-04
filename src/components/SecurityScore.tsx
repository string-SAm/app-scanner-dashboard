import React from 'react';
import { clsx } from 'clsx';

interface SecurityScoreProps {
  score: number;
  className?: string;
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({ score, className }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className={clsx('text-center', className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            className={getScoreColor(score)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={clsx('text-3xl font-bold', getScoreColor(score))}>
              {score}
            </div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className={clsx(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          getScoreBgColor(score),
          getScoreColor(score)
        )}>
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
};
