import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider as ChakraProvider} from './components/ui/provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ChakraProvider>
   <App />
   </ChakraProvider>
  </StrictMode>,
)
