import { useState } from "react";
import { login, register } from "../services/api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        const user = await register({ name: form.name || "Citizen", email: form.email, password: form.password });
        console.log("Registered", user);
      }
      const { token } = await login({ email: form.email, password: form.password });
      window.dispatchEvent(new CustomEvent("auth:login", { detail: { token } }));
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">{isRegister ? "Create account" : "Sign in"}</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegister && (
          <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        )}
        <input className="w-full border p-2 rounded" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">{isRegister ? "Register & Sign in" : "Sign in"}</button>
      </form>
      <button className="mt-3 text-sm text-blue-700" onClick={()=>setIsRegister(v=>!v)}>
        {isRegister ? "Already have an account? Sign in" : "New here? Create account"}
      </button>
    </div>
  );
}
