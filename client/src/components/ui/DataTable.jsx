import { EmptyState } from './EmptyState.jsx';
import { TableSkeleton } from './Loader.jsx';

/**
 * Column-driven table.
 *
 * columns: [{ key, header, render?, align?, className? }]
 * The wrapper scrolls horizontally on narrow screens so the page body itself
 * never does.
 */
export const DataTable = ({
  columns,
  rows,
  rowKey = (row) => row._id,
  loading = false,
  empty,
  onRowClick,
}) => {
  if (loading) return <TableSkeleton rows={5} columns={columns.length} />;

  if (!rows?.length) {
    return (
      empty || <EmptyState title="Nothing here yet" message="Data will appear once you add some." />
    );
  }

  return (
    <div className="tn-table-wrap">
      <table className="tn-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.align === 'right' ? 'text-end' : column.align === 'center' ? 'text-center' : ''}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'tn-clickable' : ''}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={[
                    column.align === 'right' ? 'text-end' : column.align === 'center' ? 'text-center' : '',
                    column.className || '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
