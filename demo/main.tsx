import { createRoot } from 'react-dom/client'
import App from './App'
import { OryxProvider } from '../src'
import { StoryProvider } from './context/StoryProvider'
import '../src/oryx.css'

createRoot(document.getElementById('root')!).render(
  <OryxProvider>
    <StoryProvider>
      <App />
    </StoryProvider>
  </OryxProvider>,
)
