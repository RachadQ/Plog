import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/tailwind.css'; // Import the Tailwind CSS file
import {AuthProvider} from './components/Default/AuthProvider'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
    <Router>
    <AuthProvider>
    <App />
    </AuthProvider>
    </Router>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
