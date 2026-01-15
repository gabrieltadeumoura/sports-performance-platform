import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter'
import { Toaster } from './components/ui/toaster'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={200}>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
