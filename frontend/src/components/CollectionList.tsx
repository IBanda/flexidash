import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useConnectionStatus } from "../ConnectionContext";
import { useFetch } from "../utils/useFetch";
import FieldList from "./FieldList";

type Data = {
  collectionNames: string[];
};

const StyledDIV = styled.div`
  margin-top: 1em;
  label {
    font-size: 14px;
    margin-right: 0.5em;
    font-weight: 500;
  }
`;

export default function CollectionList() {
  const { Fetch, data } = useFetch<Data>();
  const [selectedCollection, setCollection] = useState("");
  const { isConnected } = useConnectionStatus();
  useEffect(() => {
    if (isConnected) {
      Fetch("http://localhost:4000/introspect");
    }
  }, [isConnected]);

  const onSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollection(e.target.value);
  };

  return (
    <>
      {isConnected && (
        <StyledDIV>
          <label htmlFor="collections">Collections</label>
          <select
            id="collections"
            onChange={onSelected}
            value={selectedCollection}
          >
            <option>Select</option>
            {data?.collectionNames.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
          <FieldList collection={selectedCollection} />
        </StyledDIV>
      )}
    </>
  );
}
