import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'

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

      alert('Sikeres regisztráció! Most lépj be.')
      navigate('/login')

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#12161b]/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-white/5"
      >
        <div className="flex flex-col items-center mb-8">
          <img src="/numi.png" alt="Numi Logo" className="h-16 w-auto mb-4" />
          <h2 className="text-3xl font-lemon text-white uppercase tracking-widest text-center">
            Csatlakozz hozzánk
          </h2>
          <p className="text-slate-400 font-lemon italic text-sm mt-2 text-center">
            "Az egészséged az új vagyonod."
          </p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-2xl mb-6 text-sm text-center font-lemon"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Felhasználónév */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#68D391] transition-colors" />
            <input 
              type="text" 
              name="username" 
              placeholder="Felhasználónév"
              onChange={handleChange} 
              required 
              className="w-full bg-[#1a1f26] border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#68D391] transition-colors" />
            <input 
              type="email" 
              name="email" 
              onChange={handleChange} 
              placeholder="Email cím"
              required 
              className="w-full bg-[#1a1f26] border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon"
            />
          </div>

          {/* Jelszó */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#68D391] transition-colors" />
            <input 
              type="password" 
              name="password" 
              onChange={handleChange} 
              placeholder="Jelszó"
              required 
              className="w-full bg-[#1a1f26] border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#68D391] to-teal-500 text-white py-4 rounded-2xl font-lemon text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(104,211,145,0.3)] hover:shadow-[0_0_30px_rgba(104,211,145,0.5)] transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            Regisztráció
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-400 font-lemon text-sm">
          Már tag vagy? 
          <Link to="/login" className="text-[#68D391] font-bold hover:underline ml-2 transition-all">
            Lépj be itt
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register