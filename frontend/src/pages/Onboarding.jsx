import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
  const navigate = useNavigate()
  
  // Állapotok tárolása (itt gyűjtjük az adatokat)
  const [step, setStep] = useState(1) // Melyik lépésnél tartunk?
  const [formData, setFormData] = useState({
    firstName: '',
    gender: 'female',
    age: '',
    height: '',
    weight: '',
    goal: 'lose', // lose (fogyás), maintain (tartás), gain (hízás)
    activityLevel: '1.2', // Ülőmunka az alap
    allergies: {
      gluten: false,
      lactose: false,
      peanut: false,
      egg: false
    }
  })

  // Adatváltozás kezelése (amikor írsz egy mezőbe)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
        setFormData(prev => ({
            ...prev,
            allergies: { ...prev.allergies, [name]: checked }
        }))
    } else {
        setFormData({ ...formData, [name]: value })
    }
  }

  // Kalória kiszámolása (Mifflin-St Jeor képlet) - Csak tájékoztató jellegű a végén
  const calculateCalories = () => {
    let bmr = 0;
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseFloat(formData.age)

    if (formData.gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    }

    let tdee = bmr * parseFloat(formData.activityLevel)

    if (formData.goal === 'lose') return Math.round(tdee - 500)
    if (formData.goal === 'gain') return Math.round(tdee + 300)
    return Math.round(tdee)
  }

  // --- A LÉNYEG: MENTÉS AZ ADATBÁZISBA ---
  const handleFinish = async () => {
    const finalCalories = calculateCalories()
    
    // 1. Megnézzük, ki van bejelentkezve
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      alert("Hiba: Nem vagy bejelentkezve!")
      navigate('/login')
      return
    }

    const user = JSON.parse(storedUser)
    const username = user.username 

    // 2. Összeállítjuk az adatokat a Java Backendnek (ProfileDetail)
    const profileData = {
        firstName: formData.firstName,
        age: parseInt(formData.age),      // Számmá alakítjuk
        weight: parseFloat(formData.weight), // Tört számmá alakítjuk
        height: parseFloat(formData.height),
        gender: formData.gender,
        goal: formData.goal
    }

    try {
        // 3. Küldés a Backendnek
        const response = await fetch(`http://localhost:8080/api/auth/profile/${username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        })

        if (!response.ok) {
            throw new Error("Nem sikerült menteni a profilt.")
        }

        // 4. Ha sikerült, frissítjük a helyi tárolót is, hogy tudjuk: VAN profilja
        user.profileDetail = profileData; 
        localStorage.setItem('user', JSON.stringify(user));

        alert(`Szuper, ${formData.firstName}! A profilod mentve. A napi célod kb: ${finalCalories} kcal.`)
        navigate('/dashboard')

    } catch (error) {
        console.error("Hiba:", error)
        alert("Hiba történt a mentéskor. Lehet, hogy nem fut a szerver?")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                <span className={step >= 1 ? "text-blue-600" : ""}>Név</span>
                <span className={step >= 2 ? "text-blue-600" : ""}>Test</span>
                <span className={step >= 3 ? "text-blue-600" : ""}>Cél</span>
                <span className={step >= 4 ? "text-blue-600" : ""}>Egyéb</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
        </div>

        {/* --- 1. LÉPÉS: NÉV --- */}
        {step === 1 && (
            <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Hogy szólíthatunk? 👋</h2>
                <p className="text-gray-500 mb-6">Kezdjük az alapokkal.</p>
                
                <label className="block text-sm font-medium text-gray-700 mb-1">Keresztnév</label>
                <input 
                    type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                    placeholder="pl. Anna"
                />
                <button onClick={() => setStep(2)} disabled={!formData.firstName}
                    className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                    Tovább
                </button>
            </div>
        )}

        {/* --- 2. LÉPÉS: TESTALKAT --- */}
        {step === 2 && (
            <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Milyenek a paramétereid? 📏</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nemed</label>
                        <div className="flex gap-4">
                            <button onClick={() => setFormData({...formData, gender: 'male'})} 
                                className={`flex-1 py-3 rounded-xl border ${formData.gender === 'male' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-200 text-gray-600'}`}>
                                👨 Férfi
                            </button>
                            <button onClick={() => setFormData({...formData, gender: 'female'})}
                                className={`flex-1 py-3 rounded-xl border ${formData.gender === 'female' ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold' : 'border-gray-200 text-gray-600'}`}>
                                👩 Nő
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600">Kor (év)</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="pl. 25" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Magasság (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="pl. 170" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Súly (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="pl. 70" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Vissza</button>
                    <button onClick={() => setStep(3)} className="w-2/3 bg-blue-600 text-white py-3 rounded-xl font-bold">Tovább</button>
                </div>
            </div>
        )}

        {/* --- 3. LÉPÉS: CÉLOK --- */}
        {step === 3 && (
            <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi a célod? 🎯</h2>
                <div className="space-y-3">
                    <button onClick={() => setFormData({...formData, goal: 'lose'})}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition ${formData.goal === 'lose' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                        <span className="text-2xl">📉</span>
                        <div><div className="font-bold text-gray-800">Fogyás</div></div>
                    </button>
                    <button onClick={() => setFormData({...formData, goal: 'maintain'})}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition ${formData.goal === 'maintain' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                        <span className="text-2xl">⚖️</span>
                        <div><div className="font-bold text-gray-800">Súlytartás</div></div>
                    </button>
                    <button onClick={() => setFormData({...formData, goal: 'gain'})}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition ${formData.goal === 'gain' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                        <span className="text-2xl">💪</span>
                        <div><div className="font-bold text-gray-800">Izomépítés</div></div>
                    </button>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(2)} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Vissza</button>
                    <button onClick={() => setStep(4)} className="w-2/3 bg-blue-600 text-white py-3 rounded-xl font-bold">Tovább</button>
                </div>
            </div>
        )}

        {/* --- 4. LÉPÉS: ALLERGIÁK --- */}
        {step === 4 && (
            <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Van valami tiltólistás? 🚫</h2>
                <p className="text-gray-500 mb-6">Ezeket egyelőre csak eltároljuk.</p>
                
                <div className="grid grid-cols-1 gap-3 mb-8">
                    {['gluten', 'lactose', 'peanut', 'egg'].map((allergy) => (
                        <label key={allergy} className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${formData.allergies[allergy] ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50'}`}>
                            <input 
                                type="checkbox" 
                                name={allergy}
                                checked={formData.allergies[allergy]}
                                onChange={handleChange}
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                            />
                            <span className="ml-3 font-medium text-gray-700 capitalize">
                                {allergy === 'gluten' ? 'Gluténérzékenység' : 
                                 allergy === 'lactose' ? 'Laktózintolerancia' : 
                                 allergy === 'peanut' ? 'Mogyoróallergia' : 'Tojásallergia'}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setStep(3)} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Vissza</button>
                    {/* Ez a gomb hívja meg a handleFinish-t, ami elmenti az adatokat! */}
                    <button onClick={handleFinish} className="w-2/3 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition transform hover:scale-105">
                        Kész vagyok! 🎉
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  )
}

export default Onboarding