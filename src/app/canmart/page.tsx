"use client"

import {useEffect, useState} from "react"

export default function BusanGuidePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"})
  }

  return (
    <main className="bg-gray-50 text-gray-800 antialiased font-sans scroll-smooth">
      {/* External Dependencies: FontAwesome & Pretendard Font */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <link
        rel="stylesheet"
        as="style"
        crossOrigin="anonymous"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `body { font-family: 'Pretendard', sans-serif; }`
        }}
      />

      {/* Sticky Navigation */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md"
            : "bg-white/95 backdrop-blur-md border-b border-black/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* 로고 */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={scrollToTop}
            >
              <span className="font-black text-2xl tracking-tight text-gray-900">
                price<span className="text-teal-600">BUSAN</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a
                href="#market-trends"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                실시간 시세표
              </a>
              <a
                href="#local-tips"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                로컬 맛집 지도
              </a>
              {/* 유튜브 버튼 */}
              <a
                href="#private-inquiry"
                className="bg-[#FF0000] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#CC0000] transition-colors shadow-md flex items-center"
              >
                <i className="fa-brands fa-youtube mr-2 text-lg"></i> 유튜브
                연결
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                <i className="fa-solid fa-bars text-2xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex items-center min-h-[80vh] bg-[#1a202c] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-6 uppercase tracking-widest border border-teal-500/30">
            관광객은 모르는 진짜 부산
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg break-keep">
            수입 양주·담배 면세점보다 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-200">
              얼마나 더 쌀까요?
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-light drop-shadow-md break-keep">
            바가지 쓰지 마세요. 부산 깡통시장 최대 규모 환전소 옆에서 제공하는
            100% 리얼 실시간 시세와 로컬 맛집 정보를 확인하세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#market-trends"
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <i className="fa-solid fa-chart-line mr-2"></i> 가격정보
            </a>
            <a
              href="#private-inquiry"
              className="bg-[#FF0000] text-white px-8 py-4 rounded-full font-extrabold text-lg hover:bg-[#CC0000] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <i className="fa-brands fa-youtube text-2xl mr-2"></i> 현재가 문의
            </a>
          </div>
        </div>
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[50px] md:h-[100px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,121.22,200.21,116.3,241.69,113.34,282.87,83.9,321.39,56.44Z"
              fill="#f9fafb"
            ></path>
          </svg>
        </div>
      </section>

      {/* Smart Price Dashboard Section */}
      <section id="market-trends" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              실시간 가격 비교 대시보드
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto break-keep">
              일반 대형마트, 면세점 가격과{" "}
              <span className="font-bold text-teal-600">
                깡통시장 실제 거래가
              </span>
              를 직접 비교해 보세요. 프리미엄 주류와 수입 담배의 거품 없는
              가격을 공개합니다.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Premium Liquor Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  <i className="fa-solid fa-wine-bottle mr-2 text-teal-400"></i>{" "}
                  프리미엄 주류
                </h3>
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded">
                  오늘 업데이트됨
                </span>
              </div>
              <div className="p-6">
                {/* Item 1 */}
                <div className="mb-8 border-b border-gray-100 pb-6 last:border-0 last:mb-0 last:pb-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    조니워커 블루 라벨 (750ml)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        시중 마트가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-400 line-through">
                        ₩330,000
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        면세점가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-700">
                        ₩250,000
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border-2 border-red-200 transform scale-105 shadow-md flex flex-col justify-center relative">
                      <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        최저가
                      </div>
                      <p className="text-[11px] sm:text-xs text-red-500 font-extrabold tracking-wide mb-1">
                        깡통시장 시세
                      </p>
                      <p className="text-lg sm:text-2xl font-black text-red-500">
                        ₩210,000
                      </p>
                    </div>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="mb-0 border-b border-gray-100 pb-0 last:border-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    맥캘란 12년 더블 캐스크 (700ml)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        시중 마트가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-400 line-through">
                        ₩145,000
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        면세점가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-700">
                        ₩110,000
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border-2 border-red-200 transform scale-105 shadow-md flex flex-col justify-center relative">
                      <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        최저가
                      </div>
                      <p className="text-[11px] sm:text-xs text-red-500 font-extrabold tracking-wide mb-1">
                        깡통시장 시세
                      </p>
                      <p className="text-lg sm:text-2xl font-black text-red-500">
                        ₩95,000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tobacco Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  <i className="fa-solid fa-smoking mr-2 text-teal-400"></i>{" "}
                  수입 담배
                </h3>
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded">
                  오늘 업데이트됨
                </span>
              </div>
              <div className="p-6">
                {/* Item 1 */}
                <div className="mb-8 border-b border-gray-100 pb-6 last:border-0 last:mb-0 last:pb-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    뫼비우스 스카이블루 (1보루)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        편의점가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-400 line-through">
                        ₩45,000
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        면세점가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-700">
                        ₩32,000
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border-2 border-red-200 transform scale-105 shadow-md flex flex-col justify-center relative">
                      <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        최저가
                      </div>
                      <p className="text-[11px] sm:text-xs text-red-500 font-extrabold tracking-wide mb-1">
                        깡통시장 시세
                      </p>
                      <p className="text-lg sm:text-2xl font-black text-red-500">
                        ₩28,000
                      </p>
                    </div>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="mb-0 border-b border-gray-100 pb-0 last:border-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    면세 ESSE (1보루)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        편의점가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-400 line-through">
                        ₩48,000
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs text-gray-500 font-semibold tracking-wide mb-1">
                        면세점가
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-700">
                        ₩38,000
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border-2 border-red-200 transform scale-105 shadow-md flex flex-col justify-center relative">
                      <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        최저가
                      </div>
                      <p className="text-[11px] sm:text-xs text-red-500 font-extrabold tracking-wide mb-1">
                        깡통시장 시세
                      </p>
                      <p className="text-lg sm:text-2xl font-black text-red-500">
                        ₩37,000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 bg-gray-200/50 inline-block px-4 py-2 rounded-lg">
              * 위 가격은 최근 시장 동향을 반영한 평균 시세이며, 매일 입고
              상황과 환율에 따라 조금씩 변동될 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Local Map & Tips Section */}
      <section id="local-tips" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                로컬 가이드의 부산 숨은 꿀팁
              </h2>
              <p className="text-lg text-gray-600 break-keep">
                수입 잡화 득템은 기본! 깡통시장과 국제시장을 제대로 즐기기 위해
                현지인이 강력 추천하는 필수 코스를 소개합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tip 1 */}
            <div className="rounded-2xl overflow-hidden shadow-md group border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="씨앗호떡"
                  onError={e => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      "https://placehold.co/800x400/e2e8f0/64748b?text=Image+Unavailable"
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-teal-600 shadow-sm">
                  필수 먹거리
                </div>
              </div>
              <div className="p-6 bg-white border border-t-0 border-gray-100 rounded-b-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  BIFF 광장 씨앗호떡
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  시장 골목을 누비기 전 당 충전은 필수! 짭짤하고 달콤한 씨앗이
                  가득 찬 오리지널 부산 씨앗호떡을 꼭 맛보세요.
                </p>
                <a
                  href="#"
                  className="text-teal-600 font-bold text-sm hover:text-teal-800 flex items-center"
                >
                  위치 확인하기 <i className="fa-solid fa-arrow-right ml-1"></i>
                </a>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="rounded-2xl overflow-hidden shadow-md group border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="커피"
                  onError={e => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      "https://placehold.co/800x400/e2e8f0/64748b?text=Image+Unavailable"
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-teal-600 shadow-sm">
                  휴식 코스
                </div>
              </div>
              <div className="p-6 bg-white border border-t-0 border-gray-100 rounded-b-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  보수동 책방골목 카페
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  시장에서 도보 5분 거리. 헌책방 특유의 종이 냄새를 맡으며
                  조용하게 핸드드립 커피 한 잔의 여유를 즐겨보세요.
                </p>
                <a
                  href="#"
                  className="text-teal-600 font-bold text-sm hover:text-teal-800 flex items-center"
                >
                  위치 확인하기 <i className="fa-solid fa-arrow-right ml-1"></i>
                </a>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="rounded-2xl overflow-hidden shadow-md group border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1580519542036-ed47f3e4271d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="환전소"
                  onError={e => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      "https://placehold.co/800x400/e2e8f0/64748b?text=Image+Unavailable"
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-teal-600 shadow-sm">
                  쇼핑 꿀팁
                </div>
              </div>
              <div className="p-6 bg-white border border-t-0 border-gray-100 rounded-b-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  시장 중심 최대 규모 환전소
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  현금이 필요하신가요? 저희 가이드 안내소 바로 옆에 위치한
                  깡통시장 최대 규모 환전소에서 최고 우대 환율을 받아보세요.
                </p>
                <a
                  href="#private-inquiry"
                  className="text-teal-600 font-bold text-sm hover:text-teal-800 flex items-center"
                >
                  안내소 위치 묻기{" "}
                  <i className="fa-solid fa-arrow-right ml-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Inquiry / CTA Section */}
      <section
        id="private-inquiry"
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#FF0000] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FF0000] opacity-20 blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FF0000] rounded-full mb-6 shadow-lg shadow-red-500/30">
            <i className="fa-brands fa-youtube text-5xl text-white"></i>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 break-keep">
            실시간 재고, 영상으로 직접 확인하세요!
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed break-keep">
            인기 수입 주류와 담배 재고는 텍스트보다 영상으로 보는 것이 가장
            정확합니다.{" "}
            <span className="text-red-400 font-bold">
              price BUSAN 유튜브 채널
            </span>
            에서 매일 업데이트되는 현장 재고 상황과{" "}
            <span className="text-red-400 font-bold">비밀 매장 방문 팁</span>을
            지금 바로 확인하세요.
          </p>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-black rounded-full bg-[#FF0000] text-white hover:bg-[#CC0000] transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl w-full sm:w-auto"
          >
            <i className="fa-brands fa-youtube text-3xl mr-3"></i>
            유튜브 채널 바로가기
          </a>

          <p className="mt-8 text-sm text-gray-400 font-medium">
            <i className="fa-solid fa-bell mr-1"></i> 구독과 알림 설정을 하시면
            특가 입고 소식을 제일 먼저 받을 수 있습니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <span className="font-black text-xl tracking-tight text-gray-900">
              price<span className="text-teal-600">BUSAN</span>
            </span>
          </div>
          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>&copy; 2026 price BUSAN. All rights reserved.</p>
            <p className="mt-1">
              ※ 본 사이트는 시장 동향 정보 제공 목적이며, 통신판매를 하지
              않습니다.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
