import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useToast } from "../context/ToastContext";
import api from "../api";

export default function NoteEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const state = location.state || {};
  const noteFromState = state.note || (state.title ? state : null);

  const [title, setTitle] = useState(noteFromState?.title || "새 노트");
  const [content, setContent] = useState(noteFromState?.content || "");
  const [category, setCategory] = useState(noteFromState?.category || "일반");
  const [summaryResult, setSummaryResult] = useState("");
  const [quizResult, setQuizResult] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  // 수정 모드에서 state가 없으면 API로 노트 로드
  useEffect(() => {
    if (!id || noteFromState) return;
    setIsLoadingNote(true);
    api.get(`/api/notes/${id}`)
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category || "일반");
        }
      })
      .catch(() => {
        toast("노트를 불러오는데 실패했습니다.", "error");
        navigate("/notes", { replace: true });
      })
      .finally(() => setIsLoadingNote(false));
  }, [id]);

  const handleSaveNote = async () => {
    if (!title.trim()) { toast("노트 제목을 입력해 주세요.", "warning"); return; }
    if (!content.trim()) { toast("노트 내용을 입력해 주세요.", "warning"); return; }

    setIsSaving(true);
    try {
      let result;
      if (!id) {
        result = await api.post("/api/notes/", { title, content, category });
      } else {
        result = await api.patch(`/api/notes/${id}`, { title, content, category });
      }
      toast(id ? "노트가 수정되었습니다." : "노트가 저장되었습니다. AI 퀴즈도 생성중이에요!", "success");
      navigate("/notes", { replace: true });
    } catch (e) {
      toast(e?.message || "저장 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummary = async () => {
    if (!content.trim()) { toast("내용을 먼저 입력해 주세요.", "warning"); return; }

    setIsLoadingSummary(true);
    try {
      const { data } = await api.post("/api/summary", { text: content });
      setSummaryResult(data.summary ?? "");
      toast("요약이 완료되었습니다.", "success");
    } catch (e) {
      toast(e?.message || "요약 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleQuiz = async () => {
    if (!content.trim()) { toast("내용을 먼저 입력해 주세요.", "warning"); return; }

    setIsGeneratingQuiz(true);
    try {
      const { data } = await api.post("/api/quiz", { text: content });
      setQuizResult(data.quiz ?? null);
      toast("퀴즈가 생성되었습니다. 저장 시 DB에도 저장됩니다.", "success");
    } catch (e) {
      toast(e?.message || "퀴즈 생성 중 오류가 발생했습니다.", "error");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const PRESET_CATEGORIES = ["일반", "수학", "과학", "언어", "역사", "기술"];

  if (isLoadingNote) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button" onClick={() => navigate(-1)}
            className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 px-0"
              />
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 focus:outline-none"
              >
                {PRESET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {id && (
              <p className="mt-1 text-sm text-slate-500">
                노트 ID: <span className="font-medium text-slate-700">{id}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 md:px-6 md:py-5">
          <label className="mb-2 block text-xs md:text-sm font-medium text-slate-700">내용</label>
          <textarea
            className="min-h-[480px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
            placeholder="학습 내용을 입력하거나 붙여넣기 해주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* 요약 결과 */}
          {summaryResult && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-blue-700">요약 결과</p>
                <button
                  type="button" onClick={() => setIsEditingSummary((p) => !p)}
                  className="text-[11px] rounded-full border border-blue-200 bg-white/70 px-2.5 py-1 font-medium text-blue-700 hover:bg-blue-50 transition"
                >
                  {isEditingSummary ? "✅ 완료" : "✏️ 수정하기"}
                </button>
              </div>
              <div className="mt-2">
                {isEditingSummary ? (
                  <textarea
                    className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition"
                    rows={8} value={summaryResult}
                    onChange={(e) => setSummaryResult(e.target.value)}
                  />
                ) : (
                  <div className="prose max-w-none text-gray-800 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-4">
                    <ReactMarkdown>{summaryResult}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 퀴즈 미리보기 결과 */}
          {quizResult?.questions && (
            <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3">
              <p className="text-xs font-semibold text-purple-700 mb-3">
                퀴즈 미리보기 ({quizResult.questions.length}문제) — 저장 시 DB에 반영됩니다
              </p>
              <div className="space-y-3">
                {quizResult.questions.map((q, i) => (
                  <div key={i} className="rounded-lg bg-white border border-purple-100 px-3 py-3">
                    <p className="text-xs font-semibold text-slate-800">{i + 1}. {q.question}</p>
                    <ol className="mt-2 space-y-1">
                      {q.options.map((opt, j) => (
                        <li key={j}
                          className={`text-xs px-2 py-1 rounded ${j === q.answer ? "bg-emerald-50 text-emerald-800 font-medium" : "text-slate-600"}`}
                        >
                          {j + 1}. {opt}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button" onClick={handleSaveNote} disabled={isSaving}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-transparent px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "저장 중..." : "💾 저장"}
            </button>
            <button
              type="button" onClick={handleSummary} disabled={isLoadingSummary}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoadingSummary ? <><Loader2 className="h-4 w-4 animate-spin" />요약 중...</> : <>✨ AI 요약</>}
            </button>
            <button
              type="button" onClick={handleQuiz} disabled={isGeneratingQuiz}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGeneratingQuiz ? <><Loader2 className="h-4 w-4 animate-spin" />생성 중...</> : <>🎯 퀴즈 생성</>}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
