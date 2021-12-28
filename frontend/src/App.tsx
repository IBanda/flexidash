import { useState } from "react";
import styled from "styled-components";
import Chart from "./components/charts/Chart";
import type { AcceptableCharts } from "./components/charts/Chart";
import ChartSelect from "./components/ChartSelect";
import CollectionList from "./components/CollectionList";

import MongoConfigForm from "./components/MongoConfigForm";
import { VisualizeProvider } from "./VisualizeContext";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;

  @media (max-width: 767.98px) {
    grid-template-columns: 1fr;
  }
`;

function App() {
  const [selectedChart, setChart] = useState<AcceptableCharts>("");

  return (
    <div className="container">
      <StyledDiv>
        <VisualizeProvider>
          <div>
            <MongoConfigForm />
            <CollectionList />
            <ChartSelect selectedChart={selectedChart} setChart={setChart} />
          </div>
          <div>
            <Chart chart={selectedChart} />
          </div>
        </VisualizeProvider>
      </StyledDiv>
    </div>
  );
}

export default App;
