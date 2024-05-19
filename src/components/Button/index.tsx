import React from 'react';

type ButtonVariant = 'outlet';

interface ButtonProps {
	children: React.ReactNode;
	variant?: ButtonVariant;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'outlet',
	...res
}) => {
	const variantClasses = {
		outlet: 'hover:bg-tertiary',
	};

	const buttonClasses = variantClasses[variant];

	return (
		<button
			{...res}
			className={`px-[6px] py-1 hover-transition ${buttonClasses}`}
		>
			{children}
		</button>
	);
};

export default Button;
