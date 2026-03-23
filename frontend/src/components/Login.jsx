import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast("이메일과 비밀번호를 입력해주세요.", "warning");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data);
      toast(`${data.user.name}님, 환영합니다!`, "success");
      navigate("/dashboard");
    } catch (e) {
      toast(e?.message || "로그인에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-slate-900">로그인</h2>
      <p className="mt-2 text-xs md:text-sm text-slate-500">
        계정에 로그인하여 학습을 계속하세요
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs md:text-sm font-medium text-slate-700">
            이메일
          </label>
          <input
            id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs md:text-sm font-medium text-slate-700">
            비밀번호
          </label>
          <input
            id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm md:text-base font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs md:text-sm text-slate-500">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="font-medium text-indigo-500 hover:text-indigo-600">
          회원가입
        </Link>
      </p>
    </>
  );
}
