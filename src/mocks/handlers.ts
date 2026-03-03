import { http, HttpResponse } from "msw";

const donutData = {
  label: "카테고리별 매출",
  data: [
    { category: "전자제품", value: 4200, color: "#4e79a7" },
    { category: "의류", value: 2800, color: "#f28e2b" },
    { category: "식품", value: 1900, color: "#e15759" },
    { category: "가구", value: 1500, color: "#76b7b2" },
    { category: "도서", value: 900, color: "#59a14f" },
  ],
};

const pieData = {
  label: "월별 지출 비율",
  data: [
    { category: "주거", value: 850000, color: "#b07aa1" },
    { category: "식비", value: 420000, color: "#ff9da7" },
    { category: "교통", value: 180000, color: "#9c755f" },
    { category: "여가", value: 230000, color: "#bab0ac" },
    { category: "의료", value: 120000, color: "#edc948" },
    { category: "기타", value: 200000, color: "#76b7b2" },
  ],
};

const lineData = {
  label: "월별 판매량 추이",
  series: [
    {
      name: "서울",
      color: "#4e79a7",
      points: [
        { date: "2024-01-01", value: 420 },
        { date: "2024-02-01", value: 380 },
        { date: "2024-03-01", value: 510 },
        { date: "2024-04-01", value: 470 },
        { date: "2024-05-01", value: 620 },
        { date: "2024-06-01", value: 580 },
      ],
    },
    {
      name: "부산",
      color: "#f28e2b",
      points: [
        { date: "2024-01-01", value: 210 },
        { date: "2024-02-01", value: 250 },
        { date: "2024-03-01", value: 290 },
        { date: "2024-04-01", value: 310 },
        { date: "2024-05-01", value: 270 },
        { date: "2024-06-01", value: 340 },
      ],
    },
    {
      name: "대구",
      color: "#e15759",
      points: [
        { date: "2024-01-01", value: 150 },
        { date: "2024-02-01", value: 170 },
        { date: "2024-03-01", value: 160 },
        { date: "2024-04-01", value: 200 },
        { date: "2024-05-01", value: 230 },
        { date: "2024-06-01", value: 210 },
      ],
    },
  ],
};

const radarData = {
  label: "팀별 역량 평가",
  axes: ["기획력", "개발력", "디자인", "소통", "문제해결"],
  series: [
    { name: "팀 A", color: "#4e79a7", values: [80, 90, 70, 85, 75] },
    { name: "팀 B", color: "#f28e2b", values: [65, 75, 85, 70, 90] },
  ],
};

const boxPlotData = {
  label: "지역별 일별 판매량 분포",
  categories: [
    {
      name: "서울",
      color: "#4e79a7",
      values: [120, 145, 160, 170, 175, 180, 185, 190, 195, 200, 205, 210, 220, 230, 240, 250, 260, 280, 300, 350],
    },
    {
      name: "부산",
      color: "#f28e2b",
      values: [80, 90, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 170, 180, 190, 210, 260],
    },
    {
      name: "대구",
      color: "#e15759",
      values: [60, 70, 75, 80, 85, 90, 92, 95, 98, 100, 102, 105, 108, 112, 118, 125, 135, 145, 165, 200],
    },
    {
      name: "인천",
      color: "#76b7b2",
      values: [90, 95, 100, 108, 115, 120, 125, 130, 132, 135, 138, 140, 145, 150, 158, 165, 175, 185, 200, 240],
    },
  ],
};

const stackedBarData = {
  label: "분기별 카테고리 매출",
  keys: ["전자제품", "의류", "식품", "가구"],
  colors: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"],
  data: [
    { quarter: "2023 Q1", "전자제품": 1200, "의류": 800, "식품": 600, "가구": 400 },
    { quarter: "2023 Q2", "전자제품": 1500, "의류": 950, "식품": 700, "가구": 350 },
    { quarter: "2023 Q3", "전자제품": 1100, "의류": 1100, "식품": 800, "가구": 500 },
    { quarter: "2023 Q4", "전자제품": 1800, "의류": 1300, "식품": 900, "가구": 600 },
    { quarter: "2024 Q1", "전자제품": 1300, "의류": 900, "식품": 650, "가구": 450 },
    { quarter: "2024 Q2", "전자제품": 1600, "의류": 1050, "식품": 750, "가구": 380 },
  ],
};

const treemapData = {
  label: "카테고리별 제품 매출 구성",
  name: "전체",
  children: [
    {
      name: "전자제품",
      children: [
        { name: "스마트폰", value: 2800 },
        { name: "노트북", value: 1900 },
        { name: "태블릿", value: 900 },
        { name: "이어폰", value: 600 },
      ],
    },
    {
      name: "의류",
      children: [
        { name: "상의", value: 1200 },
        { name: "하의", value: 950 },
        { name: "아우터", value: 850 },
      ],
    },
    {
      name: "식품",
      children: [
        { name: "건강식품", value: 780 },
        { name: "음료", value: 520 },
        { name: "간식", value: 380 },
      ],
    },
    {
      name: "가구",
      children: [
        { name: "소파", value: 650 },
        { name: "책상", value: 480 },
        { name: "침대", value: 870 },
      ],
    },
  ],
};

const heatmapData = {
  label: "요일 × 시간대별 주문량",
  xLabels: ["월", "화", "수", "목", "금", "토", "일"],
  yLabels: ["06시", "09시", "12시", "15시", "18시", "21시"],
  data: [
    { x: "월", y: "06시", value: 12 }, { x: "월", y: "09시", value: 28 }, { x: "월", y: "12시", value: 85 }, { x: "월", y: "15시", value: 42 }, { x: "월", y: "18시", value: 95 }, { x: "월", y: "21시", value: 60 },
    { x: "화", y: "06시", value: 15 }, { x: "화", y: "09시", value: 32 }, { x: "화", y: "12시", value: 90 }, { x: "화", y: "15시", value: 38 }, { x: "화", y: "18시", value: 88 }, { x: "화", y: "21시", value: 55 },
    { x: "수", y: "06시", value: 10 }, { x: "수", y: "09시", value: 25 }, { x: "수", y: "12시", value: 78 }, { x: "수", y: "15시", value: 44 }, { x: "수", y: "18시", value: 92 }, { x: "수", y: "21시", value: 65 },
    { x: "목", y: "06시", value: 18 }, { x: "목", y: "09시", value: 35 }, { x: "목", y: "12시", value: 88 }, { x: "목", y: "15시", value: 50 }, { x: "목", y: "18시", value: 98 }, { x: "목", y: "21시", value: 72 },
    { x: "금", y: "06시", value: 22 }, { x: "금", y: "09시", value: 40 }, { x: "금", y: "12시", value: 95 }, { x: "금", y: "15시", value: 55 }, { x: "금", y: "18시", value: 105 }, { x: "금", y: "21시", value: 80 },
    { x: "토", y: "06시", value: 45 }, { x: "토", y: "09시", value: 70 }, { x: "토", y: "12시", value: 110 }, { x: "토", y: "15시", value: 90 }, { x: "토", y: "18시", value: 120 }, { x: "토", y: "21시", value: 95 },
    { x: "일", y: "06시", value: 38 }, { x: "일", y: "09시", value: 60 }, { x: "일", y: "12시", value: 100 }, { x: "일", y: "15시", value: 75 }, { x: "일", y: "18시", value: 108 }, { x: "일", y: "21시", value: 85 },
  ],
};

const networkData = {
  label: "기술 스택 의존성 그래프",
  nodes: [
    { id: "React", group: 1, size: 20 },
    { id: "TypeScript", group: 1, size: 18 },
    { id: "Vite", group: 2, size: 14 },
    { id: "D3", group: 1, size: 16 },
    { id: "TanStack Query", group: 3, size: 14 },
    { id: "MSW", group: 3, size: 12 },
    { id: "ky", group: 3, size: 10 },
    { id: "React Router", group: 1, size: 14 },
    { id: "ESLint", group: 2, size: 10 },
    { id: "Node", group: 2, size: 12 },
  ],
  links: [
    { source: "React", target: "TypeScript", value: 3 },
    { source: "React", target: "D3", value: 2 },
    { source: "React", target: "TanStack Query", value: 2 },
    { source: "React", target: "React Router", value: 3 },
    { source: "TypeScript", target: "Vite", value: 2 },
    { source: "TypeScript", target: "ESLint", value: 1 },
    { source: "TanStack Query", target: "ky", value: 2 },
    { source: "TanStack Query", target: "MSW", value: 1 },
    { source: "Vite", target: "Node", value: 1 },
  ],
};

const streamData = {
  label: "월별 카테고리 트렌드",
  keys: ["전자제품", "의류", "식품", "가구", "도서"],
  colors: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"],
  data: [
    { month: "Jan", "전자제품": 120, "의류": 80, "식품": 60, "가구": 40, "도서": 30 },
    { month: "Feb", "전자제품": 100, "의류": 90, "식품": 70, "가구": 35, "도서": 28 },
    { month: "Mar", "전자제품": 140, "의류": 110, "식품": 75, "가구": 50, "도서": 35 },
    { month: "Apr", "전자제품": 160, "의류": 130, "식품": 80, "가구": 55, "도서": 40 },
    { month: "May", "전자제품": 200, "의류": 160, "식품": 90, "가구": 60, "도서": 45 },
    { month: "Jun", "전자제품": 180, "의류": 150, "식품": 100, "가구": 65, "도서": 42 },
    { month: "Jul", "전자제품": 160, "의류": 140, "식품": 110, "가구": 70, "도서": 38 },
    { month: "Aug", "전자제품": 190, "의류": 170, "식품": 95, "가구": 58, "도서": 44 },
    { month: "Sep", "전자제품": 210, "의류": 180, "식품": 85, "가구": 62, "도서": 50 },
    { month: "Oct", "전자제품": 230, "의류": 190, "식품": 92, "가구": 72, "도서": 55 },
    { month: "Nov", "전자제품": 260, "의류": 210, "식품": 100, "가구": 80, "도서": 60 },
    { month: "Dec", "전자제품": 300, "의류": 250, "식품": 115, "가구": 90, "도서": 68 },
  ],
};

export const handlers = [
  http.get("/api/charts/donut", () => HttpResponse.json(donutData)),
  http.get("/api/charts/pie", () => HttpResponse.json(pieData)),
  http.get("/api/charts/line", () => HttpResponse.json(lineData)),
  http.get("/api/charts/radar", () => HttpResponse.json(radarData)),
  http.get("/api/charts/box-plot", () => HttpResponse.json(boxPlotData)),
  http.get("/api/charts/stacked-bar", () => HttpResponse.json(stackedBarData)),
  http.get("/api/charts/treemap", () => HttpResponse.json(treemapData)),
  http.get("/api/charts/heatmap", () => HttpResponse.json(heatmapData)),
  http.get("/api/charts/network", () => HttpResponse.json(networkData)),
  http.get("/api/charts/stream", () => HttpResponse.json(streamData)),
];
