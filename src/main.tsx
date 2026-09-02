import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './styles/tokens.css'
import './styles/base.css'
import './styles/visually-hidden.css'
import './styles/chrome.css'
import './styles/scenes.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
