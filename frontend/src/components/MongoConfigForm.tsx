import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useConnectionStatus } from "../ConnectionContext";
import { useFetch } from "../utils/useFetch";

const StyledForm = styled.form`
  label {
    display: block;
    /* text-transform: uppercase; */
    margin-bottom: 0.3em;
    font-weight: 600;
  }
  input {
    padding: 1em 0.5em;
    width: 300px;
    display: block;
    padding-right: 2.7em;
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
  .input_wrapper {
    position: relative;
    width: 300px;
    .inp_btn {
      all: unset;
      position: absolute;
      right: 0.5em;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
    }
  }
`;

type Data = {
  message: string;
};

export default function MongoConfigForm() {
  const [inputType, setType] = useState<"text" | "password">("text");
  const { Fetch, data, status, error } = useFetch<Data>();
  const [uri, setUri] = useState("");
  const currentUri = useRef<string | null>();
  const { updateStatus } = useConnectionStatus();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (uri !== currentUri.current && !uri) {
      currentUri.current = uri;
      return await Fetch("http://localhost:4000/connection/open", {
        method: "POST",
        body: JSON.stringify({
          uri,
        }),
      });
    }

    if (uri !== currentUri.current) {
      await Fetch("http://localhost:4000/connection/close");
      updateStatus(false);
      await Fetch("http://localhost:4000/connection/open", {
        method: "POST",
        body: JSON.stringify({
          uri,
        }),
      });
    }
  };

  useEffect(() => {
    if (status === "resolved") {
      updateStatus(true);
    }
  }, [status]);

  const onInputTypeChange = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      {status === "rejected" && (
        <div className="" role="alert">
          {error}
        </div>
      )}
      <label htmlFor="uri">Uri</label>
      <div className="input_wrapper">
        <button className="inp_btn" type="button" onClick={onInputTypeChange}>
          {inputType === "password" ? "show" : "hide"}
        </button>
        <input
          type={inputType}
          id="uri"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
      </div>
      <button type="submit">
        {status === "pending" ? "Connecting..." : "Connect"}
      </button>
      {status === "resolved" && <div role={"alert"}>{data?.message}</div>}
    </StyledForm>
  );
}
