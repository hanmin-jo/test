import { useLocation } from "react-router-dom";

export default function NoteEditor() {
  const location = useLocation();
  const state = location.state || {};
  const title = state.title || "새 노트";
  const category = state.category || "일반";

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 상단: 제목 + 카테고리 뱃지 */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            학습 내용을 충분히 입력한 뒤 AI 요약과 퀴즈 생성을 진행해 보세요.
          </p>
        </div>

        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-medium">
            카테고리
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
            {category}
          </span>
        </div>
      </header>

      {/* 중단: 학습 내용 입력 */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 md:px-6 md:py-5">
          <label className="mb-2 block text-xs md:text-sm font-medium text-slate-700">
            내용
          </label>
          <textarea
            className="min-h-[320px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
            placeholder="학습 내용을 입력하거나 붙여넣기 해주세요..."
          />
        </div>
      </section>

      {/* 하단: 액션 버튼 */}
      <section className="flex items-center justify-end">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition"
        >
          ✨ AI 요약 및 퀴즈 생성
        </button>
      </section>
    </div>
  );
}

