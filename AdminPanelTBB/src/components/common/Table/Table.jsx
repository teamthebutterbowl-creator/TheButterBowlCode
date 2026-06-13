

import React, { useState } from 'react';
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import './Table.css';

const Table = ({ columns=[], data, onEdit, onDelete, onView }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const safeData = Array.isArray(data) ? data : [];
  console.log("safeData",safeData);
  const handleActionClick = (action, row) => {
    switch (action) {
      case 'view':
        onView?.(row);
        break;
      case 'edit':
        onEdit?.(row);
        break;
      case 'delete':
        onDelete?.(row);
        break;
      default:
        break;
    }
  };

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="table-component">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column.align ? `align-${column.align}` : ''}>
                  {column.title}
                </th>
              ))}
              {(onView || onEdit || onDelete) && <th className="actions-column">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, idx) => (
              <tr 
                key={row.id || row.key || idx}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={column.align ? `align-${column.align}` : ''}
                    data-label={column.title}
                  >
                    {column.render ? column.render(row) : row[column.dataIndex]}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="actions-cell">
                    <div className="action-buttons">
                      {onView && (
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleActionClick('view', row)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleActionClick('edit', row)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleActionClick('delete', row)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {safeData.length === 0 && (
        <div className="table-empty">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;
