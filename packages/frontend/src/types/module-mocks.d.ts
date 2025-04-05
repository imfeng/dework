// Mock for @worldcoin/id
declare module '@worldcoin/id' {
  export interface WorldIDWidgetProps {
    actionId: string;
    signal?: string;
    enableTelemetry?: boolean;
    onSuccess: (verificationResponse: any) => void;
    onError?: (error: Error) => void;
    onInitSuccess?: () => void;
    debug?: boolean;
  }

  export function WorldIDWidget(props: WorldIDWidgetProps): JSX.Element;
}
