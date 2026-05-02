import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="max-w-lg rounded-md border border-red-200 bg-white p-6 shadow-soft">
            <h1 className="text-2xl font-bold text-slate-900">Cook-Cart AI could not load</h1>
            <p className="mt-2 text-sm text-slate-600">
              A frontend error happened while rendering the page.
            </p>
            <pre className="mt-4 overflow-auto rounded-md bg-red-50 p-3 text-xs text-red-700">
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
