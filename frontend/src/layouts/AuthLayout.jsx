import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">
      <div className="max-w-6xl w-full px-6 md:px-10 lg:px-12 py-10 md:py-0 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        {/* 왼쪽 소개 영역 (고정) */}
        <section className="text-white md:w-1/2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 border border-white/30 shadow-lg">
              <span className="text-2xl font-semibold leading-none">🧠</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-indigo-100/80">
                AI LEARNING ASSISTANT
              </p>
              <h1 className="mt-1 text-2xl md:text-3xl lg:text-[32px] font-semibold tracking-tight">
                AI 학습 보조
              </h1>
            </div>
          </div>

          <p className="text-sm md:text-base text-indigo-100/90">
            인공지능이 함께하는 맞춤형 학습 플랫폼
          </p>

          <div className="space-y-4 text-sm md:text-base">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 border border-white/30">
                <span className="text-lg">📒</span>
              </div>
              <div>
                <p className="font-medium">스마트 노트 관리</p>
                <p className="mt-1 text-xs md:text-sm text-indigo-100/80">
                  이미지/PDF에서 텍스트 자동 추출 및 AI 요약
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 border border-white/30">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="font-medium">맞춤형 퀴즈 생성</p>
                <p className="mt-1 text-xs md:text-sm text-indigo-100/80">
                  학습 자료 기반 자동 문제 생성 및 분석
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 border border-white/30">
                <span className="text-lg">👥</span>
              </div>
              <div>
                <p className="font-medium">소셜 학습</p>
                <p className="mt-1 text-xs md:text-sm text-indigo-100/80">
                  친구와 노트 공유 및 학습 기록 비교
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 오른쪽: 흰색 박스 + Outlet (폼 내용 교체) */}
        <section className="w-full md:max-w-md">
          <div className="rounded-3xl bg-white shadow-2xl shadow-indigo-900/20 px-7 py-8 md:px-9 md:py-9">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

