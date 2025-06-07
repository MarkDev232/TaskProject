import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/logo.svg"
            alt="App Logo"
        />
    );
}
