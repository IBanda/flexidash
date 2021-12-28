import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useConnectionStatus } from "../ConnectionContext";
import { useFetch } from "../utils/useFetch";
import { useVisualizer } from "../VisualizeContext";

const StyledForm = styled.form`
  margin-top: 1em;
  h5 {
    margin-bottom: 0.2em;
  }
  ul {
    background-color: #f7f7f7;
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    width: 300px;
    overflow-y: auto;
    border-radius: 2px;
    border: 1px solid;
  }
  label {
    display: flex;
    align-items: center;
    text-transform: capitalize;
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
`;

type Data = {
  fields: string[];
};

type Props = {
  collection: string;
};

type VisualizationData = {
  documents: unknown[];
};
export default function FieldList({ collection }: Props) {
  const { Fetch, data } = useFetch<Data>();
  const {
    Fetch: fetchVisualizationData,
    data: visualizationData,
    status,
  } = useFetch<VisualizationData>();
  const { updateVisualizedData } = useVisualizer();
  const { isConnected } = useConnectionStatus();
  const [fields, setFields] = useState<string[]>([]);

  useEffect(() => {
    if (collection) {
      Fetch(`http://localhost:4000/introspect/${collection}`);
    }
  }, [collection]);

  useEffect(() => {
    if (visualizationData) {
      updateVisualizedData(visualizationData.documents);
    }
  }, [visualizationData]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCheckbox = e.target.value;
    if (fields.includes(selectedCheckbox)) {
      return setFields((prevFields) =>
        prevFields.filter((field) => field !== selectedCheckbox)
      );
    }
    setFields((prevFields) => [...prevFields, selectedCheckbox]);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    fields.forEach((field) => {
      params.append("fields", field);
    });

    await fetchVisualizationData(
      `http://localhost:4000/introspect/${collection}?${params.toString()}`
    );
  };

  return (
    <>
      {isConnected && !!data?.fields.length && (
        <StyledForm onSubmit={onSubmit}>
          <h5>Fields</h5>
          <ul>
            {data?.fields?.map((field) => (
              <li key={field}>
                <label htmlFor="field">
                  <input
                    value={field}
                    type={"checkbox"}
                    id={field}
                    onChange={onChange}
                  />
                  {field}
                </label>
              </li>
            ))}
          </ul>

          <button type="submit">
            {status === "pending" ? "Visualizing..." : "Visualize"}
          </button>
        </StyledForm>
      )}
    </>
  );
}
