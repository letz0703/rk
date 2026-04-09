"use client"

import { useState, useRef, useEffect } from "react"

type Step = {
  key: string
  label: string
  prompt: string
  placeholder: string
  optional?: boolean
  multiline?: boolean
}

const STEPS: Step[] = [
  {
    key: "topic",
    label: "TOPIC",
    prompt: "> 어떤 내용의 동영상인가요? 주제와 핵심 내용을 입력하세요.",
    placeholder: "예: 광합성의 원리와 식물이 에너지를 만드는 과정",
  },
  {
    key: "audience",
    label: "AUDIENCE",
    prompt: "> 대상 시청자는 누구인가요?",
    placeholder: "예: 초등학교 5학년, 중학생, 일반 성인, 직장인...",
  },
  {
    key: "duration",
    label: "DURATION",
    prompt: "> 동영상 길이는 몇 분으로 할까요?",
    placeholder: "예: 5, 10, 15",
  },
  {
    key: "tone",
    label: "TONE",
    prompt: "> 톤과 스타일을 선택하세요.",
    placeholder: "예: 친근하고 재미있게 / 전문적이고 학술적으로 / 다큐멘터리 스타일",
  },
  {
    key: "characters",
    label: "CHARACTERS",
    prompt: "> 등장인물을 설명해주세요. (건너뛰면 AI가 자동 설정)",
    placeholder: "예: 지민 - 여성, 20대, 호기심 많은 학생 / 박사님 - 남성, 50대, 친절한 교수",
    optional: true,
    multiline: true,
  },
  {
    key: "source",
    label: "SOURCE",
    prompt: "> 참고할 자료가 있으면 붙여넣으세요. (건너뛰면 주제만으로 생성)",
    placeholder: "기사, 강의 노트, 텍스트 등 자유롭게 붙여넣기...",
    optional: true,
    multiline: true,
  },
]

export default function LMPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [input, setInput] = useState("")
  const [log, setLog] = useState<string[]>([
    "╔══════════════════════════════════════════════╗",
    "║     NotebookLM Script Generator v1.0        ║",
    "╚══════════════════════════════════════════════╝",
    "",
    "NotebookLM 동영상 개요 스크립트와",
    "Chibi 캐릭터 프롬프트를 생성합니다.",
    "",
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const currentStepData = STEPS[currentStep]

  useEffect(() => {
    if (currentStep < STEPS.length && !isGenerating) {
      setLog(prev => [...prev, STEPS[currentStep].prompt, ""])
    }
  }, [currentStep, isGenerating])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [log, result])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentStep])

  const handleSubmit = async () => {
    const val = input.trim()
    const step = STEPS[currentStep]

    if (!val && !step.optional) return

    const displayVal = val || "(건너뜀)"
    setLog(prev => [...prev, `$ ${displayVal}`, ""])
    setAnswers(prev => ({ ...prev, [step.key]: val }))
    setInput("")

    const nextStep = currentStep + 1

    if (nextStep >= STEPS.length) {
      await generate({ ...answers, [step.key]: val })
    } else {
      setCurrentStep(nextStep)
    }
  }

  const generate = async (finalAnswers: Record<string, string>) => {
    setIsGenerating(true)
    setLog(prev => [
      ...prev,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      ">> 생성 중... (스트리밍)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
    ])

    try {
      const res = await fetch("/api/lm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6).trim()
          if (data === "[DONE]") continue
          try {
            const json = JSON.parse(data)
            const text =
              json.type === "content_block_delta"
                ? json.delta?.text ?? ""
                : ""
            if (text) fullText += text
          } catch {}
        }

        setResult(fullText)
      }

      setLog(prev => [...prev, "", ">> 생성 완료!", ""])
      setIsDone(true)
    } catch {
      setLog(prev => [...prev, "[ERROR] 생성 실패. 다시 시도해주세요."])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setInput("")
    setResult("")
    setIsDone(false)
    setIsGenerating(false)
    setLog([
      "╔══════════════════════════════════════════════╗",
      "║     NotebookLM Script Generator v1.0        ║",
      "╚══════════════════════════════════════════════╝",
      "",
      "NotebookLM 동영상 개요 스크립트와",
      "Chibi 캐릭터 프롬프트를 생성합니다.",
      "",
    ])
  }

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono p-4 flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">

        {/* Terminal log */}
        <div className="flex-1 mb-4 space-y-0.5">
          {log.map((line, i) => (
            <div key={i} className={`text-sm leading-relaxed ${
              line.startsWith("$") ? "text-white" :
              line.startsWith(">>") ? "text-yellow-400" :
              line.startsWith("[ERROR]") ? "text-red-400" :
              line.startsWith("━") || line.startsWith("╔") || line.startsWith("║") || line.startsWith("╚") ? "text-green-600" :
              "text-green-400"
            }`}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>

        {/* Result output */}
        {result && (
          <div className="mb-4 border border-green-800 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-green-950/50 border-b border-green-800">
              <span className="text-xs text-green-500 uppercase tracking-widest">OUTPUT</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 border border-green-700 rounded hover:bg-green-900/40 transition text-green-400"
                >
                  {copied ? "COPIED!" : "COPY"}
                </button>
                {isDone && (
                  <button
                    onClick={handleReset}
                    className="text-xs px-3 py-1 border border-yellow-700 rounded hover:bg-yellow-900/40 transition text-yellow-400"
                  >
                    NEW
                  </button>
                )}
              </div>
            </div>
            <pre className="p-4 text-sm text-green-300 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto">
              {result}
            </pre>
          </div>
        )}

        {/* Input area */}
        {!isDone && !isGenerating && currentStep < STEPS.length && (
          <div className="border border-green-800 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-950/30 border-b border-green-800">
              <span className="text-xs text-green-600 uppercase tracking-widest">
                [{currentStep + 1}/{STEPS.length}] {currentStepData.label}
              </span>
              {currentStepData.optional && (
                <span className="text-xs text-gray-600">optional — Enter로 건너뜀</span>
              )}
            </div>
            <div className="flex items-end gap-2 p-3">
              <span className="text-green-600 text-sm mb-1">$</span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentStepData.placeholder}
                rows={currentStepData.multiline ? 3 : 1}
                className="flex-1 bg-transparent text-green-300 placeholder-green-900 text-sm resize-none outline-none leading-relaxed"
              />
              <button
                onClick={handleSubmit}
                className="text-xs px-3 py-1.5 border border-green-700 rounded hover:bg-green-900/40 transition text-green-500 mb-0.5 shrink-0"
              >
                ENTER
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="text-center text-green-600 text-sm animate-pulse py-4">
            ▋ generating...
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
