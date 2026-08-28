import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function App() {
  const [code, setCode] = useState(`// Paste your code here to get an AI review`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });

      console.log(response.data);

      setReview(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function copyCode(code) {
    await navigator.clipboard.writeText(code);
  }

  function getCodeText(node) {
    if (typeof node === "string") {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(getCodeText).join("");
    }

    if (node?.props?.children) {
      return getCodeText(node.props.children);
    }

    return "";
  }

  return (
    <main className="flex h-screen w-full min-w-[320px] gap-4 bg-black p-6">
      <div className="relative h-full basis-1/2 overflow-auto rounded-[0.7rem] bg-[#1e1e1e]">
        <div className="w-full rounded-[0.7rem] h-full">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            onClick={(e) => {
              const textarea = e.currentTarget;
              const lineHeight = 24;
              const padding = 10;
              const lineCount = code.split("\n").length;
              const codeHeight = padding * 2 + lineCount * lineHeight;
              if (e.nativeEvent.offsetY > codeHeight) {
                textarea.setSelectionRange(code.length, code.length);
              }
            }}
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
        {loading ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <RingLoader color="#c1c1c1" size={100} />
            <p className="text-2xl text-gray-300">Reviewing your code...</p>
          </div>
        ) : (
          <Markdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const code = getCodeText(children).replace(/\n$/, "");

                if (!match) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="relative my-4">
                    <button
                      onClick={() => copyCode(code)}
                      className="absolute right-3 top-3 rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 cursor-pointer"
                    >
                      Copy
                    </button>

                    <pre className="overflow-auto rounded-lg bg-[#1e1e1e] p-4">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {review}
          </Markdown>
        )}
      </div>
    </main>
  );
}

export default App;
