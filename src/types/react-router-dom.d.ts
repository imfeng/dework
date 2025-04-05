declare module 'react-router-dom' {
  import { ReactNode, ComponentType } from 'react';
  
  export interface LinkProps {
    to: string;
    className?: string;
    children: ReactNode;
  }
  
  export interface RouteProps {
    path: string;
    element: ReactNode;
  }
  
  export interface BrowserRouterProps {
    children: ReactNode;
  }
  
  export interface RoutesProps {
    children: ReactNode;
  }
  
  export function Link(props: LinkProps): JSX.Element;
  export function Route(props: RouteProps): JSX.Element;
  export function Routes(props: RoutesProps): JSX.Element;
  export const BrowserRouter: ComponentType<BrowserRouterProps>;
} 