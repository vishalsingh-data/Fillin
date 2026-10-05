import React from 'react';
import { createRoot } from 'react-dom/client';
import { PRODUCT_NAME } from '@fillin/shared';

const App = () => <div>Welcome to {PRODUCT_NAME} Landing Page</div>;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
