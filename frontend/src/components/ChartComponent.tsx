import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type {
  ChartConfiguration,
  ChartTypeRegistry,
  ScatterDataPoint,
  BubbleDataPoint,
} from "chart.js";
import styled from "styled-components";

const StyledDiv = styled.div`
  max-width: 700px;
  margin: auto;
`;

type Props = { config: ChartConfiguration };

export default function ChartComponent({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef =
    useRef<
      ChartConfiguration<
        keyof ChartTypeRegistry,
        (number | ScatterDataPoint | BubbleDataPoint | null)[],
        unknown
      >
    >();
  const chartRef =
    useRef<
      Chart<
        keyof ChartTypeRegistry,
        (number | ScatterDataPoint | BubbleDataPoint | null)[],
        unknown
      >
    >();

  useEffect(() => {
    if (configRef.current) chartRef.current?.destroy();
    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, config);
      configRef.current = config;
    }
  }, [config]);

  return (
    <StyledDiv>
      <canvas ref={canvasRef} id="chart" />
    </StyledDiv>
  );
}
