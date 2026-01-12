import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'

// Itt importáljuk be a külön fájlokat!
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Register from './pages/Register'
import Navbar from './components/Navbar';
import Diary from './pages/Diary'

function App() {
  return (
    <BrowserRouter>
     

        <div className="min-h-screen bg-[#222831] ">
          <div className="relative min-h-screen bg-[#1a1f26] overflow-x-hidden">
        
        {/* A HÁTTÉR LEVÉL */}
        <img 
          src="/bg_leaves.png" 
          alt=""
          className="fixed -left-20 top-1/4 w-[500px] opacity-10 blur-sm -rotate-12 pointer-events-none z-0"
        />

        {/* Opcionális: Egy másik levél a jobb alsó sarokba, hogy egyensúlyban legyen */}
        <img 
          src="/bg_leaves.png" 
          alt=""
          className="fixed -right-20 bottom-10 w-[400px] opacity-5 blur-md rotate-45 pointer-events-none z-0"
        />

        
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Diary />}/>
          <Route path="/diary" element={<Diary />} />
          {/* ... egyéb utak */}
        </Routes>
      </div>

    </div>
    </BrowserRouter>
  )
}

export default App