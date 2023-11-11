import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const loader = document.querySelector('.loader');
const overlay = document.querySelector('.overlay');
const showLoader = () => {
  loader.classList.remove('loader--hide');
  overlay.classList.remove('loader--hide');
}

const hideLoader = () => {
  loader.classList.add('loader--hide');
  overlay.classList.add('loader--hide');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App hideLoader={hideLoader}
      showLoader={showLoader} />
  </React.StrictMode>,
)
