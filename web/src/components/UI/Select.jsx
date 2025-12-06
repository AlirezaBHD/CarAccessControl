import React from 'react';

const Select = ({ value, onChange, options, placeholder, loading = false, ...props }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            {...props}
        >
            <option value="">{placeholder}</option>
            {loading ? (
                <option value="" disabled>Loading...</option>
            ) : (
                options.map(option => (
                    <option  key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            )}
        </select>
    );
};

export default Select;