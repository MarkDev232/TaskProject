import AppLogoIcon from './app-logo-icon';
import { SquareCheckBig } from 'lucide-react';
export default function AppLogo() {
    
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <SquareCheckBig className="text-orange-600 bg-none" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Task Project</span>
            </div>
        </>
    );
}
