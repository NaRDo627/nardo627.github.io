# 모바일 청첩장

GitHub Pages를 이용한 모바일 최적화 결혼 청첩장 웹사이트

## 🎊 주요 기능

### ✨ 핵심 섹션
- **메인 커버**: 신랑신부 사진, D-day 카운트다운
- **인사말**: 결혼 인사말, 가족 소개, 연락처
- **결혼식 정보**: 일시, 장소, 오시는 길, 교통편 안내
- **갤러리**: 터치 스와이프 지원 사진 슬라이드
- **축의금 안내**: 계좌번호 복사, 간편송금 링크

### 🛠 기술 스택
- **HTML5**: 시맨틱 마크업
- **CSS3**: Grid/Flexbox, CSS Variables, 반응형 디자인
- **Vanilla JavaScript**: 경량화된 인터랙션
- **외부 라이브러리**:
  - Swiper.js (갤러리 슬라이드)
  - AOS (스크롤 애니메이션)
  - 카카오맵 API (지도 연동)

## 📁 프로젝트 구조

```
nardo627.github.io/
├── index.html              # 메인 HTML 파일
├── css/
│   ├── style.css          # 메인 스타일시트
│   └── responsive.css     # 반응형 스타일
├── js/
│   ├── main.js           # 메인 JavaScript 기능
│   ├── countdown.js      # D-day 카운트다운
│   ├── gallery.js        # 갤러리 (Swiper.js)
│   └── kakao-map.js      # 카카오맵 연동
├── images/
│   ├── cover/            # 커버 이미지
│   ├── gallery/          # 갤러리 이미지들
│   └── icons/            # 아이콘 이미지들
└── README.md
```

## 🚀 설정 가이드

### 1. 개인정보 수정
`index.html` 파일에서 다음 정보들을 수정하세요:

- **신랑신부 이름**: `○○○` 부분들을 실제 이름으로 변경
- **결혼식 날짜**: `2024년 12월 21일` 부분을 실제 날짜로 변경
- **예식장 정보**: 장소명, 주소, 시간 등
- **계좌번호**: 축의금 안내 섹션의 계좌 정보
- **연락처**: 전화번호 링크들

### 2. 이미지 교체
다음 이미지들을 실제 사진으로 교체하세요:

- `images/cover/main-cover.jpg` - 메인 커버 사진
- `images/gallery/photo1.jpg ~ photo6.jpg` - 갤러리 사진들

### 3. 카카오 API 설정

#### 카카오맵 API
1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. `index.html`의 `YOUR_KAKAO_MAP_API_KEY`를 실제 키로 교체
3. `js/kakao-map.js`에서 결혼식장 좌표 수정

#### 카카오톡 공유 API
1. `js/main.js`의 `YOUR_KAKAO_JAVASCRIPT_KEY`를 실제 키로 교체
2. 공유 메시지 내용 커스터마이징

### 4. D-day 설정
`js/countdown.js`에서 결혼식 날짜를 수정하세요:
```javascript
const weddingDate = '2024-12-21T14:00:00'; // 실제 날짜와 시간으로 변경
```

## 📱 모바일 최적화

- **반응형 디자인**: 모든 디바이스에서 최적화된 레이아웃
- **터치 인터랙션**: 스와이프, 탭 등 모바일 친화적 조작
- **성능 최적화**: 이미지 지연 로딩, 압축된 리소스
- **PWA 준비**: 오프라인 지원 가능한 구조

## 🎨 커스터마이징

### 색상 변경
`css/style.css`의 CSS 변수들을 수정하여 색상 테마를 변경할 수 있습니다:

```css
:root {
    --primary-color: #8B4F92;    /* 메인 컬러 */
    --secondary-color: #D4A5A5;  /* 보조 컬러 */
    --accent-color: #F2E7DC;     /* 강조 컬러 */
}
```

### 폰트 변경
Google Fonts를 통해 다른 폰트를 사용할 수 있습니다.

## 🚀 배포

### GitHub Pages 자동 배포
1. GitHub 저장소 Settings > Pages
2. Source를 "Deploy from a branch" 선택
3. Branch를 "main" 선택
4. 몇 분 후 `https://username.github.io`에서 확인

### 커스텀 도메인 (선택사항)
1. 도메인 구매 후 CNAME 설정
2. Repository Settings > Pages > Custom domain 설정

## 📞 지원

이 템플릿에 대한 문의사항이나 개선사항이 있으시면 이슈를 등록해주세요.

## 📄 라이선스

MIT License - 자유롭게 사용하시되, 출처를 밝혀주시면 감사하겠습니다.

---

💝 **소중한 순간을 아름답게 공유하세요!** 💝