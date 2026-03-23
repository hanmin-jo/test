import { useEffect, useState } from "react";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "../context/ToastContext";
import api from "../api";

export default function QuizPage() {
  const toast = useToast();

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);
  const [quizData, setQuizData] = useState(null);   // { questions: [...] }
  const [quizLoading, setQuizLoading] = useState(false);

  const [userAnswers, setUserAnswers] = useState({});
  const [isGraded, setIsGraded] = useState(false);
  const [savingRecords, setSavingRecords] = useState(false);

  // 노트 목록 로드
  useEffect(() => {
    setNotesLoading(true);
    api.get("/api/notes")
      .then(({ data }) => setNotes(Array.isArray(data) ? data : []))
      .catch(() => setNotes([]))
      .finally(() => setNotesLoading(false));
  }, []);

  // 노트 클릭 → DB에 저장된 퀴즈 로드
  const handleSelectNote = async (note) => {
    setSelectedNote(note);
    setQuizData(null);
    setUserAnswers({});
    setIsGraded(false);
    setQuizLoading(true);

    try {
      const { data: quizzes } = await api.get(`/api/notes/${note.id}/quizzes`);
      if (quizzes.length > 0) {
        setQuizData({ questions: quizzes });
      }
      // quizzes가 없으면 빈 상태로 두고 "퀴즈 생성" 버튼 표시
    } catch {
      toast("퀴즈를 불러오는데 실패했습니다.", "error");
    } finally {
      setQuizLoading(false);
    }
  };

  // 퀴즈 생성 (= 재생성)
  const handleGenerateQuiz = async (noteId) => {
    setQuizLoading(true);
    setQuizData(null);
    setUserAnswers({});
    setIsGraded(false);

    try {
      const { data: quizzes } = await api.post(`/api/notes/${noteId}/regenerate-quiz`);
      setQuizData({ questions: quizzes });
      toast("새로운 퀴즈가 생성되었습니다!", "success");
    } catch (e) {
      toast(e?.message || "퀴즈 생성 중 오류가 발생했습니다.", "error");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (isGraded) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // 채점 + StudyRecord 저장
  const handleGrade = async () => {
    setIsGraded(true);

    if (!quizData?.questions?.length) return;
    setSavingRecords(true);
    try {
      const records = quizData.questions.map((q, idx) => ({
        quiz_id: q.id,
        is_correct: userAnswers[idx] === q.answer,
      }));
      await api.post("/api/study-records/batch", { records });
      toast("학습 기록이 저장되었습니다.", "success");
    } catch {
      // 기록 저장 실패해도 채점은 보여줌
    } finally {
      setSavingRecords(false);
    }
  };

  const score = isGraded && quizData?.questions
    ? quizData.questions.reduce((acc, q, i) => ({
        correct: acc.correct + (userAnswers[i] === q.answer ? 1 : 0),
        total: acc.total + 1,
      }), { correct: 0, total: 0 })
    : null;

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">퀴즈 연습</h1>
          <p className="mt-1 text-sm text-slate-500">저장된 노트에서 AI가 생성한 객관식 퀴즈를 풀어보세요.</p>
        </div>
        {score && (
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>점수: {score.correct} / {score.total} ({Math.round(score.correct / score.total * 100)}%)</span>
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]">
        {/* 노트 목록 패널 */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm md:text-base font-semibold text-slate-900">노트 목록</h2>
            {notesLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
          </div>

          {!notesLoading && notes.length === 0 && (
            <p className="text-xs text-slate-500">아직 저장된 노트가 없습니다.</p>
          )}

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {notes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <article
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`rounded-xl border px-3 py-3 text-sm cursor-pointer transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <h3 className={`font-semibold line-clamp-1 ${isSelected ? "text-white" : "text-slate-900"}`}>
                    {note.title}
                  </h3>
                  {note.category && (
                    <span className={`mt-1 inline-block text-[10px] font-medium rounded-full px-2 py-0.5 ${
                      isSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                    }`}>
                      {note.category}
                    </span>
                  )}
                  <p className={`mt-1 text-xs line-clamp-2 ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                    {note.content}
                  </p>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleGenerateQuiz(note.id); }}
                      disabled={quizLoading}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 transition disabled:opacity-60"
                    >
                      <RefreshCw className="h-3 w-3" />
                      퀴즈 재생성
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* 퀴즈 풀이 패널 */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 md:p-6 space-y-4">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">퀴즈 풀기</h2>

          {/* 초기 안내 */}
          {!selectedNote && !quizLoading && (
            <p className="text-xs md:text-sm text-slate-500">
              왼쪽에서 노트를 클릭하면 퀴즈를 불러옵니다.
            </p>
          )}

          {/* 로딩 */}
          {quizLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              <p className="text-sm text-slate-500">퀴즈를 준비하는 중...</p>
            </div>
          )}

          {/* 퀴즈 없음 */}
          {selectedNote && !quizLoading && !quizData && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-sm text-slate-500 text-center">
                저장된 퀴즈가 없습니다.<br/>AI로 퀴즈를 생성해보세요.
              </p>
              <button
                type="button"
                onClick={() => handleGenerateQuiz(selectedNote.id)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-black transition"
              >
                🎯 퀴즈 생성
              </button>
            </div>
          )}

          {/* 퀴즈 문제 */}
          {quizData?.questions && !quizLoading && (
            <div className="space-y-5">
              {quizData.questions.map((q, idx) => {
                const userAnswer = userAnswers[idx];
                return (
                  <article key={q.id ?? idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:px-5 md:py-5 space-y-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">문제 {idx + 1}</p>
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
                        {q.question}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {q.choices?.map((opt, optIdx) => {
                        let cls = "w-full text-left text-xs md:text-sm rounded-xl border px-3 py-2 transition";
                        if (!isGraded) {
                          cls += userAnswer === optIdx
                            ? " border-slate-900 bg-slate-900 text-white"
                            : " border-slate-200 bg-white hover:bg-slate-100";
                        } else {
                          if (q.answer === optIdx) cls += " border-emerald-500 bg-emerald-50 text-emerald-900";
                          else if (userAnswer === optIdx) cls += " border-red-400 bg-red-50 text-red-900";
                          else cls += " border-slate-200 bg-white text-slate-800";
                        }
                        return (
                          <button key={optIdx} type="button" onClick={() => handleSelectOption(idx, optIdx)}
                            disabled={isGraded} className={cls}
                          >
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-semibold text-slate-700 flex-shrink-0">
                                {optIdx + 1}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isGraded && q.answer === optIdx && (
                                <span className="text-[10px] font-semibold text-emerald-700">정답</span>
                              )}
                              {isGraded && userAnswer === optIdx && q.answer !== optIdx && (
                                <span className="text-[10px] font-semibold text-red-700">내 선택</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {isGraded && (
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs md:text-sm text-slate-700">
                        <p className="font-semibold mb-1 text-slate-800">해설</p>
                        <p className="leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                      </div>
                    )}
                  </article>
                );
              })}

              {!isGraded && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button" onClick={handleGrade} disabled={savingRecords}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black transition disabled:opacity-60"
                  >
                    ✅ 채점하기
                  </button>
                </div>
              )}

              {isGraded && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setUserAnswers({}); setIsGraded(false); }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    다시 풀기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateQuiz(selectedNote.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> 새 퀴즈
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
