import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { SeverityBadge } from './SeverityBadge';
import { Finding } from '@/types';

interface DataTableProps {
  findings: Finding[];
  onRowClick: (finding: Finding) => void;
  className?: string;
}

interface TableRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    findings: Finding[];
    onRowClick: (finding: Finding) => void;
  };
}

const TableRow: React.FC<TableRowProps> = ({ index, style, data }) => {
  const { findings, onRowClick } = data;
  const finding = findings[index];

  return (
    <div
      style={style}
      className="table-row"
      onClick={() => onRowClick(finding)}
    >
      <div className="table-cell">
        <div className="font-mono text-xs text-gray-500">
          {finding.id.split('_')[0]}
        </div>
      </div>
      <div className="table-cell">
        <div className="font-medium text-gray-900 line-clamp-2">
          {finding.title}
        </div>
      </div>
      <div className="table-cell">
        <SeverityBadge severity={finding.severity} />
      </div>
      <div className="table-cell">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {finding.section}
        </span>
      </div>
      <div className="table-cell">
        <div className="flex flex-wrap gap-1">
          {finding.labels.slice(0, 2).map((label, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {label}
            </span>
          ))}
          {finding.labels.length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{finding.labels.length - 2}
            </span>
          )}
        </div>
      </div>
      <div className="table-cell">
        <span className="text-sm text-gray-500">
          {finding.files.length} file{finding.files.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export const DataTable: React.FC<DataTableProps> = ({ 
  findings, 
  onRowClick, 
  className 
}) => {
  if (findings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No findings match your filters</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="table">
        <div className="table-header">
          <div className="table-header-cell">ID</div>
          <div className="table-header-cell">Title</div>
          <div className="table-header-cell">Severity</div>
          <div className="table-header-cell">Section</div>
          <div className="table-header-cell">Labels</div>
          <div className="table-header-cell">Files</div>
        </div>
        <div className="table-body">
          <List
            height={400}
            width="100%"
            itemCount={findings.length}
            itemSize={80}
            itemData={{ findings, onRowClick }}
          >
            {TableRow}
          </List>
        </div>
      </div>
    </div>
  );
};
