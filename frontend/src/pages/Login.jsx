import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate() // Ezzel tudunk "lapozni" a kódból

  // Állapotok (State)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState(null)

  // Ha írsz a mezőbe, ez frissíti az állapotot
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // A BELÉPÉS GOMB MEGNYOMÁSAKOR:
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null) // Töröljük az előző hibaüzenetet

    try {
      // 1. Kérés küldése a Backendnek (amit az előbb írtál meg Java-ban)
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      // Ha a Backend hibát dobott (pl. rossz jelszó)
      if (!response.ok) {
        throw new Error('Hibás felhasználónév vagy jelszó!')
      }

      // 2. Válasz feldolgozása
      const user = await response.json()
      
      console.log("Sikeres belépés:", user) // Hogy lásd a konzolon, mit kaptunk vissza

      // 3. ELTÁROLJUK, hogy be vagy lépve! 
      // A localStorage olyan, mint a sütik: megmarad frissítés után is.
      localStorage.setItem('user', JSON.stringify(user))

      // 4. A NAGY DÖNTÉS (Az "Okos" útválasztó) 🛣️
      // Mivel a Java visszaküldi a 'profileDetail'-t is (ami null, ha új vagy),
      // itt tudunk dönteni:
      
      if (user.profileDetail === null) {
        // Ha nincs profilja -> Irány a kérdőív!
        navigate('/onboarding')
      } else {
        // Ha van profilja -> Irány a főoldal!
        navigate('/dashboard')
      }

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-100">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Numi App</h1>
        <p className="text-gray-500 mb-8">Jelentkezz be a folytatáshoz</p>

        {/* Hibaüzenet doboz (csak akkor látszik, ha baj van) */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Felhasználónév"
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Jelszó"
                  onChange={handleChange} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <button type="submit" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Belépés
            </button>
        </form>
        
        <div className="mt-4 text-sm">
          Nincs még fiókod? <Link to="/register" className="text-blue-500 font-bold hover:underline">Regisztrálj itt</Link>
        </div>
      </div>
    </div>
  )
}

export default Login