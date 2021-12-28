import React, { useEffect } from "react";
import styled from "styled-components";
import { useConnectionStatus } from "../ConnectionContext";
import { useVisualizer } from "../VisualizeContext";
import { chartOptions } from "./charts/Chart";
import type { AcceptableCharts } from "./charts/Chart";

const StyledDiv = styled.div`
  margin-top: 1em;
  label {
    font-size: 14px;
    margin-right: 0.5em;
    font-weight: 500;
  }
  #type {
    margin-bottom: 1em;
  }
`;

type Props = {
  selectedChart: AcceptableCharts;
  setChart: React.Dispatch<React.SetStateAction<AcceptableCharts>>;
};

export default function ChartSelect({ selectedChart, setChart }: Props) {
  const { documents } = useVisualizer();
  const { isConnected } = useConnectionStatus();

  useEffect(() => {
    if (!isConnected && selectedChart) setChart("");
  }, [isConnected]);

  return (
    <StyledDiv>
      {!!documents?.length && (
        <>
          <label htmlFor="type">Chart Type</label>
          <select
            id="type"
            value={selectedChart}
            onChange={(e) => setChart(e.target.value as AcceptableCharts)}
          >
            <option value="">Select Chart</option>
            {chartOptions.map((option) => (
              <option key={option.name} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </>
      )}
    </StyledDiv>
  );
}
