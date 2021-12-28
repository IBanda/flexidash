import { ChartConfiguration } from "chart.js";
import { useState } from "react";
import ChartComponent from "../ChartComponent";
import Config from "../ChartConfig";

type Props = {
  type: "line" | "bar" | "radar" | "pie" | "doughnut";
};

export default function BaseChart({ type }: Props) {
  const [config, setConfig] = useState<ChartConfiguration>();

  return (
    <>
      {config ? <ChartComponent config={{ ...config, type }} /> : null}

      <Config setConfig={setConfig} />
    </>
  );
}
