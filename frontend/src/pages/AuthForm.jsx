import { createElement, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, User, Video } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../contexts/auth-context";

function Field({ id, label, icon, type = "text", value, onChange, autoComplete, action }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">{label}</label><div className="relative">{createElement(icon, { className: "absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" })}<input id={id} name={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete} required className="min-h-12 w-full rounded-xl border border-line bg-canvas pl-11 pr-12 text-base outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />{action}</div></div>;
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
    <div className="grid min-h-dvh bg-canvas text-white lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden border-r border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="relative flex items-center gap-2.5"><span className="flex size-10 items-center justify-center rounded-xl bg-accent"><Video className="size-5" /></span><span className="text-xl font-extrabold">AuraMeet</span></Link>
        <div className="relative max-w-lg"><p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-soft">Stay in flow</p><h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight">Your conversations, one calm space.</h1><p className="mt-5 text-lg leading-8 text-muted">Sign in to host a room, or skip the account entirely and join as a guest.</p><div className="mt-8 space-y-4">{["Start unlimited browser-based rooms", "Share a link with anyone", "Join as a guest without registration"].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-ink"><CheckCircle2 className="size-5 text-accent-soft" />{item}</p>)}</div></div>
        <p className="relative text-sm text-muted">Fast. Private. Built for people.</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden"><Link to="/" className="flex items-center gap-2 font-extrabold"><span className="flex size-9 items-center justify-center rounded-xl bg-accent"><Video className="size-5" /></span>AuraMeet</Link><Link to="/" aria-label="Back home" className="flex size-11 items-center justify-center rounded-xl text-muted hover:bg-white/5 hover:text-white"><ArrowLeft /></Link></div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-soft">{isLogin ? "Welcome back" : "Create account"}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{isLogin ? "Sign in to AuraMeet" : "Build your meeting space"}</h2>
          <p className="mt-3 leading-7 text-muted">{isLogin ? "Enter your details or continue directly as a guest." : "Create an account to start and manage meetings."}</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {!isLogin && <Field id="name" label="Full name" icon={User} value={form.name} onChange={update} autoComplete="name" />}
            <Field id="username" label="Username" icon={User} value={form.username} onChange={update} autoComplete="username" />
            {!isLogin && <Field id="email" label="Email address" icon={Mail} type="email" value={form.email} onChange={update} autoComplete="email" />}
            <Field id="password" label="Password" icon={Lock} type={showPassword ? "text" : "password"} value={form.password} onChange={update} autoComplete={isLogin ? "current-password" : "new-password"} action={<button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>} />
            <button disabled={isSubmitting} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-5 font-bold transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}<ArrowRight className="size-5" /></button>
          </form>

          <div className="my-6 flex items-center gap-4"><div className="h-px flex-1 bg-white/10" /><span className="text-xs font-semibold uppercase tracking-wider text-muted">or</span><div className="h-px flex-1 bg-white/10" /></div>
          <button onClick={continueAsGuest} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 font-bold text-accent-soft transition-colors hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><User className="size-5" />Continue as guest</button>
          <p className="mt-7 text-center text-sm text-muted">{isLogin ? "New to AuraMeet?" : "Already have an account?"} <button onClick={() => setIsLogin((current) => !current)} className="cursor-pointer font-bold text-accent-soft hover:text-accent-soft">{isLogin ? "Create account" : "Sign in"}</button></p>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3500} theme="dark" />
    </div>
  );
}
