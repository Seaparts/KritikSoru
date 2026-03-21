import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <div className="bg-slate-900 border border-red-500/20 p-8 rounded-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Bir Hata Oluştu</h2>
            <p className="text-slate-300 mb-4">
              Uygulama çalışırken beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            <pre className="bg-slate-950 p-4 rounded-lg text-red-400 text-sm overflow-auto mb-6 border border-slate-800">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
