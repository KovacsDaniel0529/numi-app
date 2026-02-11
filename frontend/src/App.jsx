import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'

// Itt importáljuk be a külön fájlokat!
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Register from './pages/Register'
import Navbar from './components/Navbar';
import Diary from './pages/Diary'

function AppContent(){

   const location = useLocation();
  
  // Itt soroljuk fel azokat az útvonalakat, ahol NEM szeretnénk Navbart látni
  const noNavbarPaths = ['/register', '/login', '/onboarding'];
  const showNavbar = !noNavbarPaths.includes(location.pathname);
  return (
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

        
        {showNavbar && <Navbar />}
        
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/diary" element={<Diary />} />
        </Routes>
      </div>

    </div>
  )
}


function App() {
  return(
 
    <BrowserRouter>
     
      <AppContent/>
      
    </BrowserRouter>
  )

}
export default App