export interface BasePose {
  poseName: string
  description: string
  bestAngle: string
  lensSuggestion: string
}

export interface RefinedPrompt {
  angle: string
  lens: string
  prompt: string
}
