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

export const handlers = [
  http.get("/api/charts/donut", () => HttpResponse.json(donutData)),
  http.get("/api/charts/pie", () => HttpResponse.json(pieData)),
  http.get("/api/charts/line", () => HttpResponse.json(lineData)),
];
