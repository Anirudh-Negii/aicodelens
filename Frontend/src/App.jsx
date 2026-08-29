import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import { useRef, useState } from "react";
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
  const [copiedCodeText, setCopiedCodeText] = useState("");
  const copyResetTimeoutRef = useRef(null);

  async function reviewCode() {
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, {
        code,
      });

      setReview(response.data);
    } catch (error) {
      console.error("Code review failed:", error);
      setReview("Unable to review your code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode(code) {
    await navigator.clipboard.writeText(code);

    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }

    setCopiedCodeText(code);
    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopiedCodeText("");
    }, 1200);
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
    <div className="min-h-screen bg-[#070b16] text-slate-100">
      <div className="w-full px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-3 shadow-[0_0_0_1px_rgba(148,163,184,0.1)] backdrop-blur-sm sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <img
                src="/logo.png"
                alt="AICodeLens logo"
                className="h-16 w-16 rounded-xl object-cover shadow-lg shadow-indigo-500/20"
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold tracking-tight text-white">
                    AI Code Lens
                  </span>
                </div>

                <span className="text-xs capitalize text-slate-200">
                  Review Code. Build Better.
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                Bug detection
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                Security
              </span>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          <section className="rounded-[28px] border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.72))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.55)] sm:p-8 lg:px-10 lg:py-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8">
              <div className="w-full lg:w-[60%]">
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                  Write better code with AI-powered reviews.
                </h1>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  AI Code Lens analyzes your code to identify bugs, security
                  issues, performance problems, and practical improvements
                  before you ship.
                </p>
              </div>

              <div className="w-full max-w-110 shrink-0 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4 shadow-inner shadow-slate-950/50">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Bugs", "AI catches logic issues"],
                    ["Security", "Flags risky patterns"],
                    ["Performance", "Finds bottlenecks"],
                    ["Quality", "Improves clarity"],
                  ].map(([label, text]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                    >
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        {label}
                      </div>

                      <p className="mt-2 text-sm text-slate-200">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-800/80 bg-slate-900/70 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.7)] sm:p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex w-full flex-col overflow-hidden rounded-[22px] border border-slate-800 bg-[#0e1527] lg:w-[52%] lg:max-h-170">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-5">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      Your Code
                    </span>
                  </div>

                  <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-300">
                    Code-Editor
                  </span>
                </div>

                <div className="relative flex-1 overflow-auto bg-[#0c1322]">
                  <Editor
                    value={code}
                    onValueChange={(nextCode) => setCode(nextCode)}
                    highlight={(currentCode) =>
                      prism.highlight(
                        currentCode,
                        prism.languages.javascript,
                        "javascript",
                      )
                    }
                    onClick={(event) => {
                      const textarea = event.currentTarget;
                      const lineHeight = 24;
                      const padding = 10;
                      const lineCount = code.split("\n").length;
                      const codeHeight = padding * 2 + lineCount * lineHeight;

                      if (event.nativeEvent.offsetY > codeHeight) {
                        textarea.setSelectionRange(code.length, code.length);
                      }
                    }}
                    padding={18}
                    className="min-h-full"
                    preClassName="!m-0 !bg-transparent !text-[15px] !leading-7"
                    style={{
                      fontFamily: '"Fira Code", "Fira Mono", monospace',
                      fontSize: 15,
                      lineHeight: 1.75,
                      minHeight: "420px",
                      width: "100%",
                      backgroundColor: "transparent",
                      color: "#e2e8f0",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                    textareaStyle={{
                      color: "transparent",
                      WebkitTextFillColor: "transparent",
                      caretColor: "white",
                      backgroundColor: "transparent",
                      outline: "none",
                      resize: "none",
                      lineHeight: "1.75",
                      fontFamily: '"Fira Code", "Fira Mono", monospace',
                      fontSize: "15px",
                      letterSpacing: "normal",
                      tabSize: 2,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/90 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Ready to review
                  </div>
                  <button
                    type="button"
                    onClick={reviewCode}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? "Reviewing..." : "Review"}
                  </button>
                </div>
              </div>
              <div className="w-full overflow-hidden rounded-[22px] border border-slate-800 bg-[#0d172a] lg:w-[48%]">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-5">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      AI Review
                    </span>
                  </div>

                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-200">
                    Insights
                  </span>
                </div>
                <div className="min-h-105 max-h-157 overflow-auto bg-[#0a1221] px-4 py-4 sm:px-5 lg:px-6">
                  {loading ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <RingLoader color="#c4d3ff" size={70} />

                      <p className="text-lg font-medium text-slate-200">
                        Reviewing your code...
                      </p>
                    </div>
                  ) : review ? (
                    <div className="prose prose-invert max-w-none leading-8 text-slate-200 prose-headings:scroll-mt-6 prose-headings:font-semibold prose-headings:text-white prose-h1:mt-0 prose-h1:mb-5 prose-h1:text-2xl prose-h1:tracking-[-0.04em] prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-xl prose-h2:tracking-[-0.03em] prose-h3:mt-7 prose-h3:mb-2 prose-h3:text-[11px] prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-[0.16em] prose-h3:text-orange-300 prose-p:my-4 prose-p:leading-8 prose-p:text-slate-200 prose-ul:my-5 prose-ul:space-y-2 prose-ul:pl-6 prose-ol:my-5 prose-ol:space-y-2 prose-ol:pl-6 prose-li:my-1 prose-li:leading-7 prose-li:text-slate-200 prose-li:marker:text-orange-300 prose-strong:text-orange-100 prose-a:text-orange-300 prose-code:rounded-md prose-code:border prose-code:border-slate-700/80 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-orange-200 prose-code:before:content-none prose-code:after:content-none prose-pre:my-5 prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-700 prose-pre:bg-[#0b1120] prose-pre:p-5 prose-pre:shadow-inner prose-pre:shadow-slate-950/30 prose-pre:code:text-[0.82rem] prose-pre:code:leading-7 prose-pre:code:whitespace-pre prose-hr:my-8 prose-hr:border-slate-700/80 prose-blockquote:border-l-2 prose-blockquote:border-orange-400/70 prose-blockquote:pl-4 prose-blockquote:text-slate-300">
                      <Markdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );
                            const code = getCodeText(children).replace(
                              /\n$/,
                              "",
                            );

                            if (!match) {
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <div className="relative my-5">
                                <button
                                  type="button"
                                  onClick={() => copyCode(code)}
                                  className="absolute right-2.5 top-2.5 z-10 cursor-pointer rounded-md border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
                                >
                                  {copiedCodeText === code ? "Copied" : "Copy"}
                                </button>

                                <pre className="overflow-x-auto rounded-2xl border border-slate-700 bg-[#0b1120] p-5 shadow-inner shadow-slate-950/30">
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
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 shadow-inner shadow-slate-950/40">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-300">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              d="M8 10.5V7.75A4.25 4.25 0 0 1 12.25 3.5h0A4.25 4.25 0 0 1 16.5 7.75v2.75M8 10.5h8M8 10.5V15.5A2.5 2.5 0 0 0 10.5 18h3A2.5 2.5 0 0 0 16 15.5v-5M9.5 14.5H14.5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <h2 className="text-xl font-semibold text-white">
                          Ready for a fresh review
                        </h2>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
                          Submit your code to get AI feedback on bugs, security
                          risks, performance issues, and opportunities to
                          improve quality.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
