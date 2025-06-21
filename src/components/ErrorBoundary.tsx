
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
            <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              The app encountered an unexpected error. Please try refreshing the page.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh Page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
