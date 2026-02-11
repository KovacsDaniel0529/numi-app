import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    firstName: '',
    gender: 'female',
    age: '',
    height: '',
    weight: '',
    goal: 'maintain',
    activityLevel: 1.2,
    dietaryPreference: 'omnivore',
    allergies: [],
    digestiveIssues: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleList = (listName, item) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].includes(item)
        ? prev[listName].filter(i => i !== item)
        : [...prev[listName], item]
    }));
  };

  // Napi kalóriaigény kiszámítása
  const calculateDailyGoal = () => {
    const { weight, height, age, gender, goal, activityLevel } = formData;
    if (!weight || !height || !age) return 2000;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let tdee = bmr * activityLevel;

    if (goal === 'lose') tdee -= 500;
    if (goal === 'gain') tdee += 400;

    return Math.round(tdee);
  };

  const handleFinish = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return navigate('/login');

    const calorieGoal = calculateDailyGoal();
    
    const finalData = {
      ...formData,
      dailyCalorieGoal: calorieGoal,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    };

    try {
      const response = await fetch(`http://localhost:8080/api/auth/profile/${storedUser.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        const savedProfile = await response.json();
        // Fontos: Frissítjük a localStorage-t, hogy a Diary már lássa az adatokat
        storedUser.profileDetail = savedProfile;
        localStorage.setItem('user', JSON.stringify(storedUser));
        navigate('/diary');
      }
    } catch (error) {
      console.error("Hiba a mentéskor:", error);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden text-white font-lemon">
      <div className="max-w-2xl w-full bg-[#101317]/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/10 z-10">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">
            <span className={step >= 1 ? "text-[#68D391]" : ""}>Adatok</span>
            <span className={step >= 2 ? "text-[#68D391]" : ""}>Célok</span>
            <span className={step >= 3 ? "text-[#68D391]" : ""}>Aktivitás</span>
            <span className={step >= 4 ? "text-[#68D391]" : ""}>Egészség</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#68D391] to-emerald-400 transition-all duration-700" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center mb-8">Ki vagy te?</h2>
            <input type="text" name="firstName" placeholder="Keresztneved" value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
            <div className="flex gap-4">
                <button onClick={() => setFormData({...formData, gender: 'male'})} className={`flex-1 py-3 rounded-xl border ${formData.gender === 'male' ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/10'}`}>Férfi</button>
                <button onClick={() => setFormData({...formData, gender: 'female'})} className={`flex-1 py-3 rounded-xl border ${formData.gender === 'female' ? 'bg-pink-500/20 border-pink-500' : 'bg-white/5 border-white/10'}`}>Nő</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input type="number" name="age" placeholder="Kor" onChange={handleChange} className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
              <input type="number" name="height" placeholder="cm" onChange={handleChange} className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
              <input type="number" name="weight" placeholder="kg" onChange={handleChange} className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
            </div>
            <button onClick={() => setStep(2)} className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl">Tovább</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center">Mi a célod?</h2>
            <div className="grid gap-3">
              {['lose', 'maintain', 'gain'].map(g => (
                <button key={g} onClick={() => setFormData({...formData, goal: g})} className={`p-5 rounded-2xl border ${formData.goal === g ? 'bg-[#68D391] text-[#1a1f26]' : 'bg-white/5 border-white/10'}`}>
                  {g === 'lose' ? 'Fogyás' : g === 'maintain' ? 'Súlytartás' : 'Izomépítés'}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl">Tovább</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center">Aktivitás</h2>
            <div className="grid gap-3">
              {[
                {l: 'Ülőmunka', v: 1.2}, {l: 'Mérsékelt', v: 1.375}, {l: 'Aktív', v: 1.55}, {l: 'Nagyon aktív', v: 1.725}
              ].map(a => (
                <button key={a.v} onClick={() => setFormData({...formData, activityLevel: a.v})} className={`p-4 rounded-2xl border ${formData.activityLevel === a.v ? 'bg-[#68D391] text-[#1a1f26]' : 'bg-white/5 border-white/10'}`}>
                  {a.l}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(4)} className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl">Tovább</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl uppercase tracking-widest text-center">Allergiák és panaszok</h2>
            <div className="grid grid-cols-2 gap-2">
              {['Glutén', 'Laktóz', 'Mogyoró', 'Tojás'].map(a => (
                <button key={a} onClick={() => toggleList('allergies', a)} className={`p-3 rounded-xl border text-xs ${formData.allergies.includes(a) ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/10'}`}>{a}</button>
              ))}
            </div>
            <button onClick={handleFinish} className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl">Beállítások mentése</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;