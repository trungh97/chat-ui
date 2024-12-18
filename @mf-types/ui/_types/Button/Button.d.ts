import React, { ReactElement } from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const button: (props?: ({
    intent?: "primary" | "secondary" | null | undefined;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
    label: string;
    icon?: ReactElement;
    iconPosition?: 'leading' | 'trailing';
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default Button;
//# sourceMappingURL=Button.d.ts.map