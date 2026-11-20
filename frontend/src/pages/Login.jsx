import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { login } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  // A regisztráció után ide érkezünk, és a Register oldal egy jelzést ad át
  const justRegistered = location.state?.registered === true;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const userData = await login({
        username: formData.username.trim(),
        password: formData.password,
      });
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate(userData.profileDetail ? "/diary" : "/onboarding");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#12161b]/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-white/5"
      >
        <div className="flex flex-col items-center mb-8">
          <img src="/numi.png" alt="Numi Logo" className="h-16 w-auto mb-4" />
          <h2 className="text-3xl font-lemon text-white uppercase tracking-widest text-center">
            Üdv újra itt!
          </h2>
          <p className="text-slate-400 font-lemon italic text-sm mt-2 text-center">
            "Az út az egészséghez a következő lépéssel kezdődik."
          </p>
        </div>

        {justRegistered && !error && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-3 rounded-2xl mb-6 text-sm text-center font-lemon">
            Sikeres regisztráció! Most már beléphetsz.
          </div>
        )}

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
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#68D391] transition-colors" />
            <input
              type="text"
              name="username"
              placeholder="Felhasználónév"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
              className="w-full bg-[#1a1f26] border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#68D391] transition-colors" />
            <input
              type="password"
              name="password"
              placeholder="Jelszó"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full bg-[#1a1f26] border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#68D391] to-teal-500 text-white py-4 rounded-2xl font-lemon text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(104,211,145,0.3)] hover:shadow-[0_0_30px_rgba(104,211,145,0.5)] transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-60"
          >
            {submitting ? "Belépés..." : "Bejelentkezés"}
            {!submitting && (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 font-lemon text-sm">
          Még nincs fiókod?
          <Link
            to="/register"
            className="text-[#68D391] font-bold hover:underline ml-2 transition-all"
          >
            Regisztrálj itt
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;