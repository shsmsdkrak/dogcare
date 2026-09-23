# 멍멍 케어노트

가족이 함께 쓰는 강아지 케어 기록 웹앱이에요. 사료, 물 교체, 양치질, 산책, 배변, 약·영양제, 간식을 기록할 수 있어요.

- 가족은 **계정 없이** 초대 링크만 열면 돼요. 앱이 보이지 않는 익명 로그인을 알아서 처리해요.
- 한 명이 기록하면 다른 가족 폰에 **실시간**으로 보여요. 인터넷이 끊겨도 기록되고, 다시 연결되면 자동으로 올라가요.
- 홈 화면에 추가하면 앱처럼 쓸 수 있어요(PWA).
- Firebase 무료 요금제(Spark) 안에서 충분히 돌아가요.

```
dogcare-app/
├─ public/              ← 실제 배포되는 웹앱
│  ├─ index.html, app.js, style.css
│  ├─ firebase-config.js ← ★ 여기에 내 Firebase 설정값을 넣어요
│  ├─ manifest.webmanifest, sw.js, 아이콘들
├─ firestore.rules      ← 데이터 보안 규칙
├─ firebase.json
└─ .firebaserc          ← ★ 여기에 프로젝트 ID를 넣어요
```

## 먼저 체험해 보기 (설정 없이)

```bash
cd dogcare-app
npx serve public         # 또는 python3 -m http.server -d public
```
브라우저에서 `http://localhost:3000/?demo` 를 열면 체험 모드로 동작해요. 체험 모드 기록은 새로고침하면 사라져요.

## 1. Firebase 프로젝트 만들기 (약 5분)

1. <https://console.firebase.google.com> 에 들어가서 **프로젝트 추가**를 눌러요. 이름은 예를 들어 `dogcare-jung`처럼 짓고, 애널리틱스는 꺼도 돼요.
2. **빌드 → Authentication → 시작하기 → 로그인 방법**으로 가서 **익명**을 사용 설정해요.
3. **빌드 → Firestore Database → 데이터베이스 만들기**를 눌러요.
   - 위치는 `asia-northeast3 (서울)`을 추천해요.
   - **프로덕션 모드**로 시작해요. 보안 규칙은 3단계에서 배포돼요.
4. **프로젝트 설정(톱니바퀴) → 일반 → 내 앱 → 웹(</>)**을 눌러 앱을 등록해요. Hosting 체크는 해도 되고 안 해도 돼요.
   - 화면에 나오는 `firebaseConfig` 값을 **`public/firebase-config.js`**에 붙여넣어요.
5. **`.firebaserc`**의 `YOUR_PROJECT`를 내 프로젝트 ID로 바꿔요.

## 2. 배포하기

```bash
npm i -g firebase-tools
firebase login
cd dogcare-app
firebase deploy          # 웹앱(Hosting) + 보안 규칙(Firestore) 한 번에 배포
```
배포가 끝나면 `https://<프로젝트ID>.web.app` 주소가 나와요.

> CLI를 쓰기 싫다면: Firestore → **규칙** 탭에 `firestore.rules` 내용을 붙여넣고 게시하세요. 그다음 `public` 폴더를 Netlify Drop(<https://app.netlify.com/drop>)에 끌어다 놓거나 GitHub Pages에 올려도 똑같이 동작해요.

## 3. 가족과 쓰기

1. 배포 주소를 열고 **새 가족 기록장 만들기**를 눌러요.
2. 내 이름을 고르면 **가족 초대** 창이 떠요. **공유하기**를 눌러 카톡 가족방에 링크를 보내요. 초대 창은 오른쪽 위 사람 아이콘으로 언제든 다시 열 수 있어요.
3. 가족은 링크를 열고 이름만 고르면 바로 쓸 수 있어요.
4. 홈 화면에 추가하는 방법
   - 아이폰(Safari): **공유 버튼 → 홈 화면에 추가**
   - 안드로이드(Chrome): **⋮ 메뉴 → 홈 화면에 추가 / 앱 설치**
   - 꼭 **초대 링크로 연 화면에서** 추가해 주세요. 그래야 주소에 가족 코드가 함께 저장돼요.

## 보안에 대해

- 기록은 `families/{가족코드}/…` 아래에 저장돼요. 가족 코드는 24자리 무작위 값이라 추측할 수 없어요.
- **링크를 아는 사람은 누구나 기록을 보고 쓸 수 있어요.** 가족에게만 보내 주세요.
- 링크가 밖으로 퍼졌다면 **새 가족 기록장**을 만들어 새 링크를 다시 보내면 돼요.

## 데이터 구조

```
families/{fid}/meta/config        { dogName, targets: { food:2, water:1, ... } }
families/{fid}/days/{YYYY-MM-DD}  { date, entries: { <id>: { type, t, by, status?, note? } } }
```
하루치 기록을 문서 하나에 모아 두기 때문에 읽기 횟수가 적어요. 앱은 최근 120일치를 불러와요.

## 고치고 싶을 때

- **항목이나 선택지 바꾸기**: `app.js` 위쪽의 `TYPES` 배열을 고치세요. 아이콘은 `ICONS`에 있어요.
- **기본 목표 횟수**: `DEFAULT_CFG`에서 바꿀 수 있어요. 앱 안의 **강아지 · 목표 설정**에서도 바꿀 수 있어요.
- **Firebase SDK 버전**: `app.js`의 `FB` 상수(현재 12.19.0)에서 바꿔요.
