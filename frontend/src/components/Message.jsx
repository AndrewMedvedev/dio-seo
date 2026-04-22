import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownMessage = ({ text }) => {
  return (
    <div
      className="prose prose-invert prose-sm max-w-full 
                    dark:prose-invert 
                    prose-headings:font-semibold 
                    prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                    prose-p:leading-relaxed prose-p:my-2
                    prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-2xl
                    prose-code:wrap-break-word 
                    prose-table:border prose-table:border-zinc-700
                    wrap-break-word overflow-hidden"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Подсветка кода
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              return (
                <div className="relative group my-4">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    className="rounded-2xl bg-zinc-950! border border-zinc-800"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>

                  {/* Кнопка копирования */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));
                      // Можно добавить toast-уведомление
                    }}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 
                               text-zinc-400 text-xs rounded-lg opacity-0 group-hover:opacity-100 
                               transition-all duration-200 flex items-center gap-1"
                  >
                    Копировать
                  </button>
                </div>
              );
            }

            // Inline код
            return (
              <code
                className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm wrap-break-word"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Красивые таблицы
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6 rounded-2xl border border-zinc-700 bg-zinc-950">
                <table className="min-w-full divide-y divide-zinc-700 text-sm">
                  {children}
                </table>
              </div>
            );
          },

          // Ссылки
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {children}
              </a>
            );
          },

          // Цитаты
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-zinc-600 pl-4 italic text-zinc-300 my-4">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
