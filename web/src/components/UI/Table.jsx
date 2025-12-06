import React from 'react';

const Table = ({ columns, data, onRowClick, actions, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-primary text-white">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-4 rtl:text-right ltr:text-left font-semibold text-sm whitespace-nowrap"
                            >
                                {column.title}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-4 rtl:text-right ltr:text-left font-semibold text-sm">
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className={`
                  transition-all duration-200
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                `}
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className="px-6 py-4 text-sm  text-secondary whitespace-nowrap"
                                >
                                    {column.render ? column.render(item[column.dataIndex], item) : item[column.dataIndex]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 justify-end ">
                                        {actions(item)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;