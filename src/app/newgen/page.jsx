"use client" // 상태 관리 및 사용자 입력을 위해 클라이언트 컴포넌트로 지정

import {GoogleGenAI, Type} from "@google/genai"
import {useState, useCallback, useEffect} from "react"

// 환경 변수 설정
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const ai = GEMINI_API_KEY ? new GoogleGenAI({apiKey: GEMINI_API_KEY}) : null

// 응답 JSON 스키마 정의 (동일)
const lookbookStyleSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {type: Type.STRING, description: "스타일 이름"},
      concept: {type: Type.STRING, description: "핵심 컨셉 요약"},
      color: {type: Type.STRING, description: "주요 컬러 팔레트"},
      item: {type: Type.STRING, description: "주요 의상 및 액세서리 아이템"},
      shooting_tip: {type: Type.STRING, description: "주요 촬영 배경 및 포즈"}
    },
    required: ["name", "concept", "color", "item", "shooting_tip"]
  }
}

/**
 * 텍스트 스타일 제안을 JSON 형식으로 받아옵니다.
 */
async function getGeneratedContentJson(
  basePrompt,
  currentAttributes,
  count = 5
) {
  // currentAttributes 인자 추가
  if (!ai || !GEMINI_API_KEY) {
    return {
      error:
        "API Key is missing or invalid. (NEXT_PUBLIC_GEMINI_API_KEY 확인 필요)"
    }
  }

  // [수정] 기본 속성(Attributes)과 사용자 입력을 결합하여 프롬프트 생성
  const PROMPT = `${currentAttributes} ${basePrompt}에 대한 스타일 ${count}가지를 제안해줘. (응답은 정의된 JSON 스키마를 따라야 함)`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: lookbookStyleSchema
      }
    })

    const contentArray = JSON.parse(response.text.trim())
    return contentArray
  } catch (error) {
    console.error("Failed to process Gemini API response:", error)
    return {
      error: `API 호출 또는 JSON 파싱 실패: ${error.message}. (프롬프트를 확인하거나 다시 시도해 주세요)`
    }
  }
}

// 스타일 항목을 렌더링하는 컴포넌트
function StyleItem({style, index, baseAttributes, userInput}) {
  // baseAttributes, userInput 인자 추가

  // [추가] 모든 정보를 결합하여 합본 프롬프트 생성
  const combinedPrompt = `
    ${baseAttributes} ${userInput}의 룩북 포토: 스타일 "${style.name}" 컨셉 "${style.concept}".
    주요 아이템: ${style.item}. 컬러: ${style.color}.
    촬영 디테일: ${style.shooting_tip}.
    하이 퀄리티 포토 리얼리즘, K-Pop 스타일, 전신 샷, 조명 효과.
  `
    .replace(/\s+/g, " ")
    .trim() // 연속된 공백 제거 및 정리

  return (
    <div
      key={index}
      className="border border-gray-200 rounded-xl p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl bg-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">
        {index + 1}. {style.name}
      </h2>

      {/* 설명 그리드 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-6">
        {/* 컨셉 */}
        <div className="p-3 bg-indigo-50 rounded-lg col-span-1 border border-indigo-200">
          <p className="font-semibold text-base text-indigo-800 mb-1">컨셉</p>
          <p className="text-gray-700">{style.concept}</p>
        </div>

        {/* 컬러 */}
        <div className="p-3 bg-pink-50 rounded-lg col-span-1 border border-pink-200">
          <p className="font-semibold text-base text-pink-800 mb-1">컬러</p>
          <p className="text-gray-700">{style.color}</p>
        </div>

        {/* 아이템 */}
        <div className="p-3 bg-green-50 rounded-lg col-span-1 border border-green-200">
          <p className="font-semibold text-base text-green-800 mb-1">아이템</p>
          <p className="text-gray-700">{style.item}</p>
        </div>

        {/* 촬영 팁 */}
        <div className="p-3 bg-yellow-50 rounded-lg col-span-1 border border-yellow-200">
          <p className="font-semibold text-base text-yellow-800 mb-1">
            촬영 팁
          </p>
          <p className="text-gray-700">{style.shooting_tip}</p>
        </div>
      </div>

      {/* [추가] 합본 프롬프트 영역 */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg border-dashed border-2 border-gray-400">
        <p className="font-semibold text-gray-700 mb-2 flex justify-between items-center">
          이미지 생성용 합본 프롬프트 (클릭 후 복사)
          <span className="text-xs text-indigo-500 font-normal">
            클릭하여 전체 텍스트를 쉽게 복사하세요.
          </span>
        </p>
        <pre
          id={`prompt-${index}`}
          className="whitespace-pre-wrap break-words text-sm cursor-copy select-all bg-transparent"
          onClick={e => {
            // 텍스트 복사 힌트 (navigator.clipboard 사용)
            navigator.clipboard
              .writeText(e.currentTarget.innerText)
              .then(() => {
                e.currentTarget.style.backgroundColor = "#d1e7dd" // 임시 배경색 변경
                setTimeout(() => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }, 500)
              })
              .catch(() => {
                // 복사 실패 시 select-all로 사용자에게 복사 유도
                window.getSelection().selectAllChildren(e.currentTarget)
              })
          }}
        >
          {combinedPrompt}
        </pre>
      </div>
    </div>
  )
}

export default function HomePage() {
  // 상태 관리
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userInput, setUserInput] = useState(
    "가상 아이돌 지망생의 포토 룩북 제작"
  )

  // [추가] 기본 속성 상태 추가. 정책을 준수하는 선에서 매력적인 기본값 설정.
  const [baseAttributes, setBaseAttributes] = useState(
    "성년, 한국 kpop 여자 아이돌 센터 미모, 매혹적인 분위기의"
  )

  const [hasMore, setHasMore] = useState(true)

  // 텍스트 API 호출 함수
  const fetchContent = useCallback(
    async (isAppending = false, initialLoad = false) => {
      if (loading && !initialLoad && data.length > 0) return

      setLoading(true)
      if (!isAppending) {
        setError(null)
      }
      setHasMore(false)

      const currentPrompt = userInput || "트렌디한 스타일 5가지"

      const promptWithOffset = isAppending
        ? `${currentPrompt}에 대한 이전 ${data.length}가지 스타일과 중복되지 않는 새로운 스타일 5가지를 추가로 제안해줘.`
        : currentPrompt

      // [수정] getGeneratedContentJson에 기본 속성(baseAttributes) 전달
      const result = await getGeneratedContentJson(
        promptWithOffset,
        baseAttributes,
        5
      )

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      if (isAppending) {
        setData(prevData => [...prevData, ...result])
      } else {
        setData(result)
      }

      if (result.length === 5) {
        setHasMore(true)
      }

      setLoading(false)
    },
    [userInput, data.length, baseAttributes]
  ) // baseAttributes를 의존성 배열에 추가

  // 페이지 로드 시 fetchContent를 호출합니다.
  useEffect(() => {
    if (data.length === 0 && !error) {
      fetchContent(false, true)
    }
  }, [fetchContent, data.length, error])

  // UI 렌더링
  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen min-w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gray-900 border-b-4 border-indigo-600 pb-3 max-w-6xl mx-auto">
        AI 스타일 제안기 📝
      </h1>

      {/* 사용자 입력 폼 */}
      <div className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-xl shadow-lg border border-indigo-200">
        {/* 1. 주요 스타일 테마 입력 필드 */}
        <label
          htmlFor="prompt-input"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          원하는 스타일 테마를 입력하세요:
        </label>
        <div className="flex space-x-3 mb-4">
          <input
            id="prompt-input"
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="예: 가상 아이돌 룩북, 20대 여성 여름 바캉스 패션"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black"
            onKeyDown={e => {
              if (e.key === "Enter") fetchContent(false)
            }}
          />
          <button
            onClick={() => fetchContent(false)}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {loading && data.length === 0 ? "생성 중..." : "스타일 제안"}
          </button>
        </div>

        {/* 2. 기본 스타일 속성 입력 필드 */}
        <label
          htmlFor="base-attributes-input"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          기본 설정 (성년, 외모, 분위기 등):
        </label>
        <input
          id="base-attributes-input"
          type="text"
          value={baseAttributes}
          onChange={e => setBaseAttributes(e.target.value)}
          placeholder="예: 성년, 뛰어난 미모, 관능적인 분위기의"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-300 transition duration-150 text-black"
        />

        <p className="mt-2 text-sm text-gray-500">
          현재 요청: **"{baseAttributes} {userInput}"**에 대한 5가지 스타일을
          요청합니다.
        </p>
      </div>

      {/* 에러 및 로딩 상태 표시 */}
      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-lg max-w-6xl mx-auto mb-8 shadow-md text-center font-medium">
          {error}
        </p>
      )}

      {/* 데이터 표시 */}
      <div className="space-y-10 max-w-6xl mx-auto">
        {data.map((style, index) => (
          <StyleItem
            key={index}
            style={style}
            index={index}
            baseAttributes={baseAttributes} // ADDED
            userInput={userInput} // ADDED
          />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {data.length > 0 && hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => fetchContent(true)}
            disabled={loading}
            className="bg-gray-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition duration-150 disabled:opacity-50 shadow-md flex items-center mx-auto"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "스타일 5가지 더 보기"
            )}
          </button>
        </div>
      )}

      {/* 초기 로드 시 로딩 표시 */}
      {data.length === 0 && loading && !error && (
        <div className="text-center mt-20 text-gray-600">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>AI가 기본 스타일 아이디어를 로드 중입니다...</p>
        </div>
      )}
    </main>
  )
}
