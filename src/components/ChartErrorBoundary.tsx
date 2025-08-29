
import React from 'react';

interface ChartErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
}

class ChartErrorBoundary extends React.Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    console.error('Chart rendering error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-64 text-muted-foreground bg-secondary/10 rounded-lg">
          <div className="text-center">
            <p className="text-sm">Chart temporarily unavailable</p>
            <p className="text-xs mt-1">Data is being processed...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
