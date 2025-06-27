import React from 'react';
import { createRoot } from 'react-dom/client';
import Interface from './stamps';

const domNode = document.getElementById('root') as HTMLElement;
const root = createRoot(domNode);
root.render(<Interface />);
