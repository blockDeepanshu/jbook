import { useEffect, useState } from "react";
import * as esbuild from "esbuild-wasm";

// Module-level flag to ensure initialization happens only once
let esbuildInitialized = false;

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    if (!esbuildInitialized) {
      startService().then(() => {
        esbuildInitialized = true;
      });
    }
  }, []);

  const submitData = async () => {
    try {
      const res = await esbuild.transform(input, {
        loader: "jsx",
        target: "es2015",
      });

      if (res) {
        setCode(res.code);
        setInput("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={submitData}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;
