import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Oops! Something went wrong.</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We encountered an unexpected rendering error. Don't worry, your data is safe. Let's try refreshing the page.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Reload Application
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-gray-50 p-4 rounded-xl border border-gray-100 overflow-x-auto text-xs font-mono text-gray-600">
                <p className="font-bold mb-2 text-red-500">{this.state.error.toString()}</p>
                <p className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
