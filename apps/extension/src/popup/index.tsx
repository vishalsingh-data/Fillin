import React from 'react';
import { createRoot } from 'react-dom/client';
import { PRODUCT_NAME } from '@fillin/shared';

const App = () => <div>Hello from {PRODUCT_NAME} Extension</div>;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
