import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function normalizeRenderableText(content) {
  const normalized = String(content || "").replace(/\r\n?/g, "\n");

  return normalized.includes("\\n")
    ? normalized.replace(/\\n/g, "\n").replace(/\\t/g, "\t")
    : normalized;
}

function preprocessMarkdown(content) {
  return normalizeRenderableText(content)
    .replace(/<br\s*\/?>/gi, "<br>")
    .replace(/\[([^\]]+)\]\(\)/g, "$1");
}

function renderChildrenWithBreaks(children, keyPrefix = "chunk") {
  const result = [];
  let chunkIndex = 0;

  const pushTextWithBreaks = (text) => {
    const parts = String(text).split(/<br\s*\/?>/gi);

    parts.forEach((part, index) => {
      if (index > 0) {
        result.push(<br key={`${keyPrefix}-br-${chunkIndex}`} />);
        chunkIndex += 1;
      }

      if (part) {
        result.push(part);
        chunkIndex += 1;
      }
    });
  };

  children.forEach((child) => {
    if (typeof child === "string") {
      pushTextWithBreaks(child);
      return;
    }

    result.push(child);
    chunkIndex += 1;
  });

  return result;
}

const markdownComponents = {
  a: ({ href, children }) => {
    if (!href || href.startsWith("kb://")) {
      return <>{children}</>;
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-red-300 underline underline-offset-2 hover:text-red-200"
      >
        {children}
      </a>
    );
  },
  p: ({ children }) => (
    <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-neutral-200">
      {renderChildrenWithBreaks(
        Array.isArray(children) ? children : [children],
        "p",
      )}
    </p>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">
      {renderChildrenWithBreaks(
        Array.isArray(children) ? children : [children],
        "li",
      )}
    </li>
  ),
  td: ({ children }) => (
    <td className="border-t border-neutral-800 px-4 py-3 align-top text-neutral-300">
      {renderChildrenWithBreaks(
        Array.isArray(children) ? children : [children],
        "td",
      )}
    </td>
  ),
  th: ({ children }) => (
    <th className="border-b border-neutral-700 px-4 py-3 text-left align-top font-medium text-neutral-100">
      {renderChildrenWithBreaks(
        Array.isArray(children) ? children : [children],
        "th",
      )}
    </th>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-2xl border border-neutral-700">
      <table className="min-w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-950/70">{children}</thead>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-5 text-neutral-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-5 text-neutral-300">{children}</ol>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-2xl bg-neutral-950 p-4 text-xs text-neutral-200">
      {children}
    </pre>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded bg-neutral-900 px-1.5 py-0.5">{children}</code>
    ) : (
      <code>{children}</code>
    ),
  h1: ({ children }) => <h1 className="text-2xl font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>,
  hr: () => <hr className="border-neutral-700" />,
};

const ChatMessageList = ({ messages, className = "", renderMeta }) => {
  return (
    <div className={className}>
      {messages.map((msg) => {
        const isUser = msg.type === "user" || msg.role === "user";
        const normalizedText = preprocessMarkdown(msg.text);

        return (
          <div
            key={msg.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                isUser
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800/70 text-neutral-200"
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap wrap-break-word">
                  {normalizeRenderableText(msg.text)}
                </p>
              ) : (
                <div className="space-y-4 wrap-break-word">
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:font-semibold 
                  prose-p:leading-relaxed
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {normalizedText}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              {renderMeta?.(msg)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessageList;
