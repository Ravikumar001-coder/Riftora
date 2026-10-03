import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import { AppProviders } from './app/AppProviders.jsx';
import { Agentation } from 'agentation';
import { AuroraBackground } from './components/ui/aurora-background.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", background: "black", color: "red", minHeight: "100vh" }}>
          <h1>React Crashed</h1>
          <pre style={{whiteSpace: "pre-wrap"}}>{this.state.error?.toString()}</pre>
          <pre style={{whiteSpace: "pre-wrap"}}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <AuroraBackground>
          <App />
          {import.meta.env.DEV && <Agentation />}
        </AuroraBackground>
      </AppProviders>
    </ErrorBoundary>
  </React.StrictMode>,
);
// Force Vite HMR reload

