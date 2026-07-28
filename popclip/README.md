# RAINSKISS Shorten — PopClip 익스텐션

선택한 URL을 `rainskiss.com/s/xxxxxx` 단축링크로 만들어 클립보드에 자동 복사.

## 설치
1. Finder에서 `RAINSKISS-Shorten.popclipext` 폴더를 더블클릭.
2. PopClip이 "설치할까요?" 물으면 승인.
3. PopClip 환경설정 → RAINSKISS Shorten → **API Token** 에
   서버 `.env` 의 `SHORTLINK_TOKEN` 값을 붙여넣기.

## 사용
어느 앱에서든 `http(s)://…` URL을 드래그 선택 → PopClip 팝업의
🔗 **RAINSKISS Shorten** 클릭 → 단축링크가 클립보드에 복사됨. 붙여넣기만.

## 동작 전제 (중요)
이 익스텐션은 `POST rainskiss.com/s/api/create` 를 호출한다. 서버는
Firebase Admin SDK로 쓰기를 처리한다(적용 완료). 작동하려면 서버 환경에
`SHORTLINK_TOKEN` 과 `FIREBASE_SERVICE_ACCOUNT`(서비스계정 JSON) 두 env가
설정돼 있어야 한다. 로컬 테스트는 `localhost:3000`, 실사용은 배포된
`rainskiss.com` 엔드포인트.

## 문제 해결
- `ERR: unauthorized` → 토큰 불일치. 환경설정의 API Token 재확인.
- `ERR: db write failed` → 서버에 Admin SDK 미적용. 서버 쪽 조치 필요.
- 팝업에 버튼이 안 뜸 → 선택한 텍스트가 http(s) URL 형식인지 확인.
