import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast("모든 항목을 입력해주세요.", "warning");
      return;
    }
    if (password.length < 6) {
      toast("비밀번호는 6자 이상이어야 합니다.", "warning");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      login(data);
      toast("회원가입이 완료되었습니다!", "success");
      navigate("/dashboard");
    } catch (e) {
      toast(e?.message || "회원가입에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-slate-900">회원가입</h2>
      <p className="mt-2 text-xs md:text-sm text-slate-500">
        새로운 계정을 만들어 학습을 시작하세요
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs md:text-sm font-medium text-slate-700">
            이름
          </label>
          <input
            id="name" type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

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
            비밀번호 <span className="text-slate-400 font-normal">(6자 이상)</span>
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
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs md:text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="font-medium text-indigo-500 hover:text-indigo-600">
          로그인
        </Link>
      </p>
    </>
  );
}
