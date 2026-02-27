import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 임시로 인증 없이 메인 퀴즈 화면으로 이동
    navigate("/main");
  };

  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
        로그인
      </h2>
      <p className="mt-2 text-xs md:text-sm text-slate-500">
        계정에 로그인하여 학습을 계속하세요
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-xs md:text-sm font-medium text-slate-700"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-[0_0_0_1px_rgba(15,23,42,0.02)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-xs md:text-sm font-medium text-slate-700"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-[0_0_0_1px_rgba(15,23,42,0.02)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm md:text-base font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-slate-800 transition"
        >
          로그인
        </button>
      </form>

      <p className="mt-5 text-center text-xs md:text-sm text-slate-500">
        계정이 없으신가요?{" "}
        <Link
          to="/signup"
          className="font-medium text-indigo-500 hover:text-indigo-600"
        >
          회원가입
        </Link>
      </p>
    </>
  );
}

