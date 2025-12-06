import React from 'react';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'medium',
                    onClick,
                    disabled = false,
                    type = 'button',
                    className = '',
                    ...props
                }) => {
    const baseClasses = 'rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
    const cursor = disabled !== false ? '' : 'cursor-pointer';
    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
        secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
        accent1: 'bg-accent1 text-secondary hover:bg-accent1/90 focus:ring-accent1',
        accent2: 'bg-accent2 text-white hover:bg-accent2/90 focus:ring-accent2',
        accent3: 'bg-accent3 text-white hover:bg-accent3/90 focus:ring-accent3',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    };

    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    };

    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
    ${cursor}
  `.trim();

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;