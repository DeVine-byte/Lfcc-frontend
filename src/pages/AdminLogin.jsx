import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      // STORE TOKEN
      localStorage.setItem("token", data.access_token);

      alert("Login successful");

      navigate("/dashboard");

    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md border border-zinc-800"
      >

        <h1 className="text-3xl text-white font-bold mb-8 text-center">
          LFCC Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-4 outline-none"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-6 outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-600 transition-all p-4 rounded-xl text-white font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}

export default AdminLogin;
