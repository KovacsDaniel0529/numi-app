import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('A regisztráció sikertelen (lehet, hogy foglalt a név?)')
      }

      // Ha sikerült:
      alert('Sikeres regisztráció! Most lépj be.')
      navigate('/login') // Átirányítás a belépésre

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Fiók létrehozása</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Felhasználónév</label>
            <input type="text" name="username" onChange={handleChange} required 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" onChange={handleChange} required 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jelszó</label>
            <input type="password" name="password" onChange={handleChange} required 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Regisztráció
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Már van fiókod? <Link to="/login" className="text-blue-600 font-bold hover:underline">Belépés</Link>
        </p>
      </div>
    </div>
  )
}

export default Register