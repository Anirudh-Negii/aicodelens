import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import { useState } from "react";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function App() {
  const [code, setCode] = useState(`// Paste your code here to get an AI review`);
  const [review, setReview] = useState("");

  async function reviewCode() {
    const response = await axios.post("http://localhost:3000/ai/get-review", {
      code,
    });
    console.log(response.data);

    setReview(response.data);
  }

  return (
    <main className="flex h-screen w-full min-w-[320px] gap-4 bg-black p-6">
      <div className="relative h-full basis-1/2 overflow-auto rounded-[0.7rem] bg-[#1e1e1e]">
        <div className="w-full rounded-[0.7rem]">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 16,
              lineHeight: 1.5,
              borderRadius: "5px",
              minHeight: "100%",
              width: "100%",
              backgroundColor: "transparent",
              color: "white",
            }}
            textareaStyle={{
              color: "transparent",
              WebkitTextFillColor: "transparent",
              caretColor: "white",
            }}
          />
        </div>

        <div
          className="absolute bottom-4 right-4 cursor-pointer select-none bg-blue-600 px-6 py-2 text-[1.1rem] font-medium text-white hover:bg-blue-700 rounded-full"
          onClick={reviewCode}
        >
          Review
        </div>
      </div>

      <div className="h-full basis-1/2 overflow-auto rounded-[0.7rem] bg-[#343434] px-8 py-4 text-white">
        <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
      </div>
    </main>
  );
}

export default App;
