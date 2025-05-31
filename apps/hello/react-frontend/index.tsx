import React from 'react';
import { createRoot } from 'react-dom/client';
import Interface from './hello';

const domNode = document.getElementById('root') as HTMLElement;
const root = createRoot(domNode);
root.render(<Interface />);
