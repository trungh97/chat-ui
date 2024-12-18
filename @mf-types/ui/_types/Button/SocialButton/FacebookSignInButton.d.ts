import { VariantProps } from 'class-variance-authority';
import React from 'react';
import type { Theme } from './types';
declare const button: (props?: ({
    theme?: "gray" | "brand" | "color-with-brand" | null | undefined;
    supportingText?: boolean | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface FacebookSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
    theme?: Theme;
    supportingText?: boolean;
}
declare const FacebookSignInButton: React.ForwardRefExoticComponent<FacebookSignInButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default FacebookSignInButton;
//# sourceMappingURL=FacebookSignInButton.d.ts.map