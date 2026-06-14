import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { Chapter1 } from './pages/Chapter1'
import { Chapter2 } from './pages/Chapter2'
import { Chapter3 } from './pages/Chapter3'
import { Chapter4 } from './pages/Chapter4'
import { Chapter5 } from './pages/Chapter5'
import { Chapter6 } from './pages/Chapter6'
import { FinalePage } from './pages/FinalePage'
import { SandboxPage } from './pages/SandboxPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chapter/1" element={<Chapter1 />} />
          <Route path="/chapter/2" element={<Chapter2 />} />
          <Route path="/chapter/3" element={<Chapter3 />} />
          <Route path="/chapter/4" element={<Chapter4 />} />
          <Route path="/chapter/5" element={<Chapter5 />} />
          <Route path="/chapter/6" element={<Chapter6 />} />
          <Route path="/finale" element={<FinalePage />} />
          <Route path="/sandbox" element={<SandboxPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
