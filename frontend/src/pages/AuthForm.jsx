import { createElement, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, User, Video } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../contexts/auth-context";

function Field({ id, label, icon, type = "text", value, onChange, autoComplete, action }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-300">{label}</label><div className="relative">{createElement(icon, { className: "absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" })}<input id={id} name={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete} required className="min-h-12 w-full rounded-xl border border-white/10 bg-slate-950 pl-11 pr-12 text-base outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />{action}</div></div>;
}

export function AuthForm() {
  const navigate = useNavigate();
  const { handleRegister, handleLogin } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const message = isLogin ? await handleLogin(form.username, form.password) : await handleRegister(form.name, form.username, form.email, form.password);
      toast.success(message);
      if (isLogin) navigate(`/join/${crypto.randomUUID().slice(0, 8)}`);
      else { setIsLogin(true); setForm({ name: "", email: "", username: "", password: "" }); }
    } catch (error) { toast.error(error.response?.data?.message || "Could not complete the request. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  const continueAsGuest = () => navigate(`/join/${crypto.randomUUID().slice(0, 8)}`);

  return (
    <div className="grid min-h-dvh bg-slate-950 text-white lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden border-r border-white/10 bg-blue-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -left-24 top-1/3 size-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-600"><Video className="size-5" /></span><span className="text-xl font-extrabold">AuraMeet</span></Link>
        <div className="relative max-w-lg"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Stay in flow</p><h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight">Your conversations, one calm space.</h1><p className="mt-5 text-lg leading-8 text-blue-100/70">Sign in to host a room, or skip the account entirely and join as a guest.</p><div className="mt-8 space-y-4">{["Start unlimited browser-based rooms", "Share a link with anyone", "Join as a guest without registration"].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-blue-100"><CheckCircle2 className="size-5 text-cyan-300" />{item}</p>)}</div></div>
        <p className="relative text-sm text-blue-200/50">Fast. Private. Built for people.</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden"><Link to="/" className="flex items-center gap-2 font-extrabold"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-600"><Video className="size-5" /></span>AuraMeet</Link><Link to="/" aria-label="Back home" className="flex size-11 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white"><ArrowLeft /></Link></div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">{isLogin ? "Welcome back" : "Create account"}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{isLogin ? "Sign in to AuraMeet" : "Build your meeting space"}</h2>
          <p className="mt-3 leading-7 text-slate-400">{isLogin ? "Enter your details or continue directly as a guest." : "Create an account to start and manage meetings."}</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {!isLogin && <Field id="name" label="Full name" icon={User} value={form.name} onChange={update} autoComplete="name" />}
            <Field id="username" label="Username" icon={User} value={form.username} onChange={update} autoComplete="username" />
            {!isLogin && <Field id="email" label="Email address" icon={Mail} type="email" value={form.email} onChange={update} autoComplete="email" />}
            <Field id="password" label="Password" icon={Lock} type={showPassword ? "text" : "password"} value={form.password} onChange={update} autoComplete={isLogin ? "current-password" : "new-password"} action={<button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>} />
            <button disabled={isSubmitting} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}<ArrowRight className="size-5" /></button>
          </form>

          <div className="my-6 flex items-center gap-4"><div className="h-px flex-1 bg-white/10" /><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">or</span><div className="h-px flex-1 bg-white/10" /></div>
          <button onClick={continueAsGuest} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 font-bold text-cyan-200 transition-colors hover:bg-cyan-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"><User className="size-5" />Continue as guest</button>
          <p className="mt-7 text-center text-sm text-slate-400">{isLogin ? "New to AuraMeet?" : "Already have an account?"} <button onClick={() => setIsLogin((current) => !current)} className="cursor-pointer font-bold text-cyan-300 hover:text-cyan-200">{isLogin ? "Create account" : "Sign in"}</button></p>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3500} theme="dark" />
    </div>
  );
}
