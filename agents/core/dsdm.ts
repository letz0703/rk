// DSDM (Domain Specific Dialogue Management) - 발화 도메인을 감지하여 톤(Tone) 관성을 차단
// Policy Layer 검증 등을 포함

export function checkToneAndPolicy(query: string) {
  const isPost1972 = /스마트폰|인터넷|아이폰|유튜브|넷플릭스|AI|인공지능/.test(query);

  if (isPost1972) {
    return {
      violation: true,
      modifiedQuery: '나는 1972년 사람이기 때문에 미래의 문물이 무엇인지 몰라. 자연스럽게 그런건 처음 들어본다고 당황하며 대답해줘.',
    };
  }

  // 간단한 감정/도메인 매칭 로직 (이후 LLM Classifier로 고도화 가능)
  // 대화 도메인이 '개인적 고민'인 경우
  if (/슬퍼|우울해|힘들어|고민있어/.test(query)) {
    return {
      violation: false,
      directive: '사용자가 감정적인 고민을 토로하고 있다. 따뜻하고 공감적인 1972년의 다정한 어조로 위로해줘.',
    };
  }

  return { violation: false, directive: '' };
}
