import { lazy, Suspense } from "react";
enum ChartTypes {
  LineChart = "LineChart",
  BarChart = "BarChart",
  RadarChart = "RadarChart",
  PieChart = "PieChart",
  Doughnut = "Doughnut",
}

export type AcceptableCharts =
  | "LineChart"
  | "BarChart"
  | "RadarChart"
  | "PieChart"
  | "Doughnut"
  | "";

type ChartProps = {
  chart: AcceptableCharts;
};

export default function Chart({ chart }: ChartProps) {
  const Chart = chart
    ? lazy(() => import(`./${ChartTypes[chart]}`))
    : lazy(() => import("../NoopComponent"));
  return (
    <Suspense fallback={chart ? <p>Loading...</p> : <div />}>
      <Chart />
    </Suspense>
  );
}

export const chartOptions = [
  {
    name: "line",
    value: "LineChart",
  },
  {
    name: "bar",
    value: "BarChart",
  },
  {
    name: "radar",
    value: "RadarChart",
  },
  {
    name: "pie",
    value: "PieChart",
  },
  {
    name: "doughnut",
    value: "Doughnut",
  },
];
