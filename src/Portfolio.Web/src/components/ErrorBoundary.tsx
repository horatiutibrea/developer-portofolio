import { Component, ErrorInfo, ReactNode } from 'react';
import i18n from '../modules/i18n/i18n';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled React error', error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main style={{ maxWidth: 720, margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
          <h1>{i18n.t('status.unexpected.title')}</h1>
          <p>{i18n.t('status.unexpected.description')}</p>
          <button type="button" onClick={() => window.location.assign('/')}>
            {i18n.t('status.backHome')}
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
