import { useState } from "react";
import styled from "styled-components";
import {
  ChartConfiguration,
  ChartTypeRegistry,
  ScatterDataPoint,
  BubbleDataPoint,
} from "chart.js";
import { useVisualizer } from "../VisualizeContext";

const StyledForm = styled.div`
  margin-top: 2em;
  label {
    font-size: 14px;
    margin-right: 0.5em;
    font-weight: 500;
  }
  .input_label {
    display: block;
  }
  .input_label + input {
    display: block;
    margin-bottom: 0.5em;
  }
  button {
    color: #fff;
    padding: 0.5em;
    width: 10em;
    background-color: #6ecb63;
    border: none;
    border-radius: 5px;
    margin-top: 0.3em;
  }
  div {
    margin-bottom: 0.5em;
  }
`;

type Aggregate = {
  [name: string]: number;
};

type ConfigProps = {
  setConfig: React.Dispatch<
    React.SetStateAction<
      | ChartConfiguration<
          keyof ChartTypeRegistry,
          (number | ScatterDataPoint | BubbleDataPoint | null)[],
          unknown
        >
      | undefined
    >
  >;
};

const setBg = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

export default function Config({ setConfig }: ConfigProps) {
  const [labelField, setLabels] = useState("");
  const [dataField, setData] = useState("");
  const [aggregate, setAggregate] = useState(false);
  const [label, setLabel] = useState("");
  const { documents } = useVisualizer();
  const fields = Object.keys(documents[0]);

  const onSave = () => {
    let labels = documents.map((document) => document[labelField]);
    let data = documents.map((document) => document[dataField]);
    const agg: Aggregate = {};
    if (aggregate) {
      labels.forEach((label, i) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!agg.hasOwnProperty(label)) {
          agg[label] = data[i];
        } else {
          agg[label] += data[i];
        }
      });
      labels = Object.keys(agg);
      data = Object.values(agg);
    }

    setConfig({
      //we set line as defualt but its overriden in the action chart component
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: labels.map(() => setBg()),
          },
        ],
      },
    });
  };

  return (
    <StyledForm>
      <h3>Configuration</h3>
      <label className="input_label" htmlFor="label">
        Label
      </label>
      <input
        id="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <div>
        <label htmlFor="label_field">Label Fields</label>
        <select
          id="label_field"
          value={labelField}
          onChange={(e) => setLabels(e.target.value)}
        >
          <option>Select a label field</option>
          {fields.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="data_field">Data Field</label>
        <select
          id="data_field"
          value={dataField}
          onChange={(e) => setData(e.target.value)}
        >
          <option>Select a data field</option>
          {fields.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend>Advanced</legend>
        <label htmlFor="aggregate">
          <input
            type="checkbox"
            checked={aggregate}
            onChange={() => setAggregate((p) => !p)}
          />
          Aggregate
        </label>
      </fieldset>
      <button onClick={onSave}>Save</button>
    </StyledForm>
  );
}
