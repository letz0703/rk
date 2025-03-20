2025.03.20 목 title

2025.01.30 목 ErrorBoundary
https://courses.webdevsimplified.com/view/courses/react-simplified-advanced/2009182-advanced-react-concepts/6307077-06-error-boundaries

eslint
.eslingrc.js
npx next lint
2025.01.17 금 Custom modal
- custome modal .jsx 만들기
- CSS 적용

todo : div 한쪽 수정할때 다른쪽도 같이 수정되게... 무슨 매칭 플러그인이 있었는데...

2025.01.16 목
Dialog Element : Imperative to Declative  깐 깐 회  장
https://courses.webdevsimplified.com/view/courses/react-simplified-advanced/2009182-advanced-react-concepts/6307036-04-modal-introduction

https://github.com/WebDevSimplified/React-Simplified-Advanced-Projects/tree/main/04-05-modal/before

# buy me a coffee : buymeacoffee.com/rainskiss
2025.01.09 목 : [Portals](https://courses.webdevsimplified.com/view장courses/react-simplified-advanced/2009182-advanced-react-concepts/6307053-02-portals)

2025.01.11 토 forwardRef :
https://courses.webdevsimplified.com/view/courses/react-simplified-advanced/2009182-advanced-react-concepts/6307042-03-forwardref

- 오류 발생: ref는 DOM 요소가 아닌 함수형 컴포넌트에서 동작하지 않음
- 기본
```
const CustomInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

