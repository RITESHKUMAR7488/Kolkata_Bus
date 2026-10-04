import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter } from 'react-router'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallbackRender={() => <main className="max-w-xl mx-auto p-8"><h1 className="text-2xl font-semibold">The planner could not finish loading</h1><p className="my-4">Check your connection and reload to get the latest version.</p><button className="rounded-lg bg-orange-600 text-white p-3" onClick={() => window.location.reload()}>Reload planner</button><p className="mt-4"><a href="/bus-routes/">Browse the bus route guides</a></p></main>}>
  <MotionConfig reducedMotion="user"><BrowserRouter>
    <App />
  </BrowserRouter></MotionConfig></ErrorBoundary>,
)
