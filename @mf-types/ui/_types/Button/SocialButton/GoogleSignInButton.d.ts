import 'tailwindcss/tailwind.css';
import { VariantProps } from 'class-variance-authority';
import React from 'react';
import { Theme } from './types';
declare const button: (props?: ({
    theme?: "gray" | "brand" | "color-with-brand" | null | undefined;
    supportingText?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
    theme?: Theme;
    supportingText?: boolean;
}
declare const GoogleSignInButton: React.ForwardRefExoticComponent<GoogleSignInButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default GoogleSignInButton;
//# sourceMappingURL=GoogleSignInButton.d.ts.map