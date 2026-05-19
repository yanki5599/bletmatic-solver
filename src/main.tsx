import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BeltmaticSolverApp from './BeltmaticSolverApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BeltmaticSolverApp />
  </StrictMode>,
)
