import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import { I18nProvider } from '@/lib/i18n';
import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <I18nProvider titleKey="Awanara Langkawi — A quieter kind of island" descKey="Awanara is a small island sanctuary on Langkawi, where the Andaman Sea meets the quiet generosity of Malaysian hospitality.">
      <App />
    </I18nProvider>
  </ErrorBoundary>,
);
