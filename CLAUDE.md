# D3 차트 라이브러리 프로젝트

## 1. 프로젝트 개요 및 목적

D3.js를 활용한 다양한 차트 UI 컴포넌트를 Lesson 단위로 구현하고, 현업에서 필요한 차트 코드를 빠르게 복사해 사용하기 위한 레퍼런스 라이브러리다.

- 각 Lesson은 하나의 차트 주제를 독립적으로 다룬다.
- 코드 복사·재사용을 전제로 하므로, 컴포넌트는 외부 의존성 없이 자급자족(self-contained) 형태로 작성한다.
- 실험적인 코드를 자유롭게 작성하는 학습 공간이므로 완성도보다 명확성을 우선한다.

---

## 2. 기술 스택 및 패키지 매니저 규칙

### 스택

- **Bundler**: Vite v7
- **UI**: React 18 + TypeScript 5
- **차트**: D3 v7
- **라우팅**: react-router-dom v7 (BrowserRouter)

### 패키지 매니저: pnpm v10

반드시 `pnpm`을 사용한다. `npm`이나 `yarn`은 사용하지 않는다.
pnpm v10은 보안상 빌드 스크립트를 기본 차단하며, esbuild 허용을 위해 `package.json`에 아래 설정이 적용되어 있다.

```json
"pnpm": {
  "onlyBuiltDependencies": ["esbuild"]
}
```

### 주요 명령어

```bash
pnpm dev        # 개발 서버 실행 (localhost:5173)
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과물 미리보기
pnpm lint       # ESLint 검사
pnpm add <pkg>        # 런타임 의존성 설치
pnpm add -D <pkg>     # 개발 의존성 설치
```

---

## 3. 파일/디렉토리 구조 컨벤션

```
d3-practice/
├── public/                       # 정적 파일 (JSON 데이터)
│   ├── food.json
│   └── planets.json
├── src/
│   ├── main.tsx                  # 진입점 (BrowserRouter 설정)
│   ├── App.tsx                   # 라우팅 + 네비게이션
│   └── components/
│       └── lesson/
│           ├── Lesson01.tsx      # SVG 기본 도형
│           ├── Lesson02.tsx      # D3 기본 DOM 조작
│           ├── Lesson03.tsx      # Scatter plot (행성)
│           └── Lesson04.tsx      # Bar chart (막대)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 명명 규칙

- Lesson 컴포넌트 파일명: `LessonXX.tsx` (두 자리 숫자, 예: `Lesson05.tsx`)
- 컴포넌트 함수명: 파일명과 동일 (예: `const Lesson05 = () => { ... }`)
- JSON 데이터 파일명: 소문자 + 케밥 케이스 (예: `heatmap.json`)

---

## 4. D3 + React 컴포넌트 표준 패턴

### 핵심 원칙: React의 DOM과 D3의 DOM 조작 충돌 방지

React는 Virtual DOM을 통해 DOM을 관리하고, D3는 실제 DOM을 직접 조작한다.
이 프로젝트에서는 **React는 빈 컨테이너 `div`만 렌더링하고, D3가 `useEffect` 안에서 SVG를 생성·관리**하는 방식을 사용한다.

### 표준 컴포넌트 템플릿 (useRef 패턴)

```tsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
  name: string;
  value: number;
}

const LessonXX = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. useRef로 컨테이너 선택 (className 선택자 충돌 방지)
    const canvas = d3.select(canvasRef.current);

    // 2. SVG 중복 방지: 기존 SVG 제거 후 재생성
    //    (React StrictMode에서 useEffect가 두 번 실행될 수 있으므로 필수)
    canvas.select("svg").remove();

    // 3. SVG 생성
    const svg = canvas.append("svg").attr("width", 600).attr("height", 600);

    // 4. margin 컨벤션 (축, 레이블 공간 확보)
    const margin = { top: 20, bottom: 100, left: 100, right: 20 };
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    // 5. 그래프 그룹 생성 (margin 적용)
    const graph = svg
      .append("g")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 6. 데이터 로딩 및 차트 그리기
    d3.json<DataItem[]>("/data-file.json").then((data) => {
      if (!data) return; // null 체크 필수
      // scale, axis, shape 생성 ...
    });

    // 7. cleanup: 컴포넌트 언마운트 시 SVG 제거
    return () => {
      canvas.select("svg").remove();
    };
  }, []); // 마운트 시 1회만 실행

  // 8. 빈 컨테이너만 반환 (D3가 내부를 채움)
  return <div ref={canvasRef}></div>;
};

export default LessonXX;
```

### SVG 중복 방지 규칙

`canvas.select("svg").remove()`를 `useEffect` 시작 시 반드시 호출한다.
React의 StrictMode는 개발 환경에서 `useEffect`를 두 번 실행하므로, 생략하면 SVG가 중복 추가된다.

### TypeScript 타입 지정

```tsx
// 데이터 타입은 컴포넌트 상단에 interface로 정의
interface FoodData {
  name: string;
  orders: number;
}

// d3.json의 제네릭 타입 지정 + null 체크
d3.json<FoodData[]>("/food.json").then((data) => {
  if (!data) return;
  // ...
});

// scale 타입 명시
const x = d3.scaleBand<string>()
  .domain(data.map((d) => d.name))
  .range([0, graphWidth]);

const y = d3.scaleLinear<number>()
  .domain([0, d3.max(data, (d) => d.value) ?? 0])
  .range([graphHeight, 0]);
```

### D3 데이터 바인딩 패턴 (enter-update-exit)

```tsx
const selection = graph.selectAll("rect").data(data);

// Enter: 새로 추가되는 요소
selection.enter().append("rect")
  .attr("width", x.bandwidth())
  .attr("height", (d) => graphHeight - y(d.value));

// Exit: 제거되는 요소
selection.exit().remove();
```

### axis 추가 패턴

```tsx
// x축 (하단)
const xAxisGroup = graph.append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
xAxisGroup.call(d3.axisBottom(x));

// 축 레이블 회전
xAxisGroup.selectAll("text")
  .attr("transform", "rotate(-40)")
  .attr("text-anchor", "end");

// y축 (좌측)
const yAxisGroup = graph.append("g");
yAxisGroup.call(d3.axisLeft(y));
```

---

## 5. 라우팅 추가 체크리스트

새 Lesson을 추가할 때 `src/App.tsx`를 수정한다.

1. `src/components/lesson/LessonXX.tsx` 파일 생성
2. `src/App.tsx`에 import 추가
3. `<Link>` 추가 (네비게이션)
4. `<Route>` 추가 (라우팅)

```tsx
// src/App.tsx 수정 예시 (Lesson05 추가)
import Lesson05 from "./components/lesson/Lesson05";

// <nav> 안에 Link 추가
<Link to="/lesson05">Lesson 05</Link>

// <Routes> 안에 Route 추가
<Route path="/lesson05" element={<Lesson05 />} />
```

---

## 6. 데이터 파일 관리

### 위치 및 접근 방법

- 모든 JSON 데이터는 `public/` 디렉토리에 저장한다.
- Vite는 `public/`의 파일을 루트 경로(`/`)로 서빙한다.
- `d3.json("/파일명.json")`으로 접근한다.

```tsx
// 올바른 접근 방법
d3.json<DataType[]>("/food.json").then((data) => { ... });

// 잘못된 접근 방법
d3.json("../public/food.json")  // 불가
```

### JSON 구조 컨벤션

- 파일 루트는 배열(`[]`)로 시작한다.
- 필드명은 camelCase를 사용한다.

```json
[
  { "category": "항목A", "value": 200 },
  { "category": "항목B", "value": 450 }
]
```

### 차트별 데이터 파일 명명 예시

| 차트 유형 | 데이터 파일 |
|-----------|-------------|
| Bar chart | `food.json` (기존 재활용) |
| Scatter plot | `scatter.json` |
| Heatmap | `heatmap.json` |
| Network | `network.json` (nodes, links 배열) |
| Treemap | `treemap.json` (계층형 구조) |

---

## 7. 코딩 컨벤션

### 일반 규칙

- 함수형 컴포넌트 + 화살표 함수를 사용한다.
- `strict: true` 설정이 활성화되어 있다. 타입 오류를 `any`로 우회하지 않는다.
- `d3.max()`, `d3.min()` 등의 반환값은 `undefined`일 수 있으므로 `?? 0` 처리한다.
- 차트 내부 스타일(색상, stroke 등)은 D3 `.attr()`로 인라인 처리한다.

### 색상

D3 내장 color scheme을 활용한다.

```tsx
const color = d3.scaleOrdinal(d3.schemeTableau10);
```

---

## 8. 목표 차트 목록 및 진행 현황

| Lesson | 차트 유형 | 주요 D3 API | 상태 |
|--------|-----------|-------------|------|
| Lesson01 | SVG 기본 도형 (rect, circle, line) | - | 완료 |
| Lesson02 | D3 기본 DOM 조작 | `d3.select`, `append` | 완료 |
| Lesson03 | Scatter plot (행성 데이터) | `data()`, `enter()` | 완료 |
| Lesson04 | Bar chart (막대) | `scaleBand`, `scaleLinear` | 완료 |
| Lesson05 | Donut chart (도넛) | `d3.pie()`, `d3.arc()` | 미완료 |
| Lesson06 | Pie chart (파이) | `d3.pie()`, `d3.arc()` | 미완료 |
| Lesson07 | Line chart (선) | `d3.line()`, `scaleTime()` | 미완료 |
| Lesson08 | Radar chart (레이더) | `d3.lineRadial()` | 미완료 |
| Lesson09 | Box plot (박스) | `d3.quantile()`, `d3.extent()` | 미완료 |
| Lesson10 | Stacked bar chart | `d3.stack()` | 미완료 |
| Lesson11 | Treemap | `d3.treemap()`, `d3.hierarchy()` | 미완료 |
| Lesson12 | Heatmap | `scaleSequential`, `interpolateInferno` | 미완료 |
| Lesson13 | Network graph | `forceSimulation()`, `forceLink()` | 미완료 |
| Lesson14 | Stream graph | `d3.stack()`, `stackOffsetWiggle` | 미완료 |
