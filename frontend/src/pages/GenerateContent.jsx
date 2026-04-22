import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  MessageCircle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import Header from "../components/layout/Header";
import ChatMessageList from "../components/ChatMessageList";
import ChatInputBox from "../components/ChatInputBox";
import { GenerationApi } from "../api/Generation";

const INITIAL_MESSAGE = {
  id: "assistant-welcome",
  type: "ai",
  text: "База знаний подключена. Загрузите документы и задайте вопрос, чтобы получить ответ на основе материалов из базы знаний. Я могу помочь с генерацией текстов, ответами на вопросы и созданием контента на основе предоставленных данных.",
};

const formatBackendFiles = (items = []) =>
  items.map((file, index) => ({
    id: `${file.name || "kb-file"}-${index}`,
    name: file.name || "Без названия",
    link: file.link || "",
  }));

export default function ContentGenerationPage() {
  const fileInputRef = useRef(null);

  const [historyFiles, setHistoryFiles] = useState([]);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState("");
  const [chatStatus, setChatStatus] = useState("");

  const loadFiles = async ({ keepStatus = false } = {}) => {
    setFilesLoading(true);

    try {
      const data = await GenerationApi.listFiles();
      const nextFiles = formatBackendFiles(data.files);

      setHistoryFiles(nextFiles);
      if (nextFiles.length > 0) {
        setIsHistoryOpen(true);
      }

      if (!keepStatus) {
        setUploadStatus("");
      }
    } catch (error) {
      console.error("Ошибка загрузки файлов базы знаний:", error);
      setUploadStatus("Не удалось загрузить список файлов базы знаний.");
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    setIsUploading(true);
    setUploadStatus("");

    const uploadedNames = [];
    const failedNames = [];

    for (const file of selectedFiles) {
      try {
        await GenerationApi.upload(file);
        uploadedNames.push(file.name);
      } catch (error) {
        console.error(`Ошибка загрузки файла ${file.name}:`, error);
        failedNames.push(file.name);
      }
    }

    await loadFiles({ keepStatus: true });

    const statusChunks = [];
    if (uploadedNames.length > 0) {
      statusChunks.push(`Успешно загружено: ${uploadedNames.join(", ")}`);
    }
    if (failedNames.length > 0) {
      statusChunks.push(`Не удалось загрузить: ${failedNames.join(", ")}`);
    }

    setUploadStatus(
      statusChunks.join(". ") || "Не удалось загрузить выбранные файлы.",
    );
    setIsUploading(false);
    e.target.value = "";
  };

  const sendMessage = async () => {
    const userText = inputMessage.trim();
    if (!userText || isSending) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setChatStatus("");
    setIsSending(true);

    try {
      const response = await GenerationApi.chat(userText);
      const aiReply = {
        id: Date.now() + 1,
        type: "ai",
        text: response.answer || "Backend вернул пустой ответ.",
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          text: "Не удалось получить ответ от backend. Попробуйте ещё раз.",
        },
      ]);
      setChatStatus("Ошибка запроса к backend.");
    } finally {
      setIsSending(false);
    }
  };

  const resetChat = async () => {
    if (isResetting) return;

    setIsResetting(true);
    setChatStatus("");

    try {
      await GenerationApi.resetChat();
      setMessages([INITIAL_MESSAGE]);
      setChatStatus("Диалог очищен.");
    } catch (error) {
      console.error("Ошибка сброса чата:", error);
      setChatStatus("Не удалось сбросить чат.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />

      <div className="pt-24 lg:pt-28 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Upload className="w-6 h-6 text-red-400" />
                Загрузка файлов в базу знаний
              </h2>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 hover:border-red-500/50 rounded-2xl py-16 cursor-pointer transition-colors">
                <Upload className="w-12 h-12 text-neutral-500 mb-4" />
                <p className="text-neutral-400 text-center">
                  Перетащите файлы сюда
                  <br />
                  или нажмите для выбора
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  PDF, DOCX, TXT, XLSX, PPTX, JPG, PNG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadStatus && (
                <div className="mt-6 rounded-2xl border border-neutral-800 bg-dark-800 px-4 py-3 text-sm text-neutral-300">
                  {uploadStatus}
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mt-8 w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-2xl font-medium transition-all active:scale-[0.985] flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Загружаем...
                  </>
                ) : (
                  "Загрузить файл"
                )}
              </button>

              <button
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                className="mt-3 w-full py-3 bg-[#131313] hover:bg-dark-700 border border-neutral-700 rounded-2xl text-sm font-medium transition-colors"
              >
                {isHistoryOpen
                  ? "Скрыть загруженные файлы"
                  : "Посмотреть загруженные файлы"}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isHistoryOpen
                    ? "max-h-85 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-dark-800 border border-neutral-800 rounded-2xl overflow-hidden">
                  <div className="p-4 space-y-3 overflow-y-auto max-h-80 pr-2">
                    {filesLoading ? (
                      <div className="flex items-center gap-3 text-sm text-neutral-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Загружаем список файлов...
                      </div>
                    ) : historyFiles.length === 0 ? (
                      <p className="text-sm text-neutral-500">
                        База знаний пока пустая
                      </p>
                    ) : (
                      historyFiles.map((file) => (
                        <div
                          key={file.id}
                          className="border border-neutral-800 rounded-xl px-3 py-3"
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm truncate">{file.name}</p>
                              <p className="text-xs text-neutral-500 mt-1 break-all">
                                {file.link}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-3xl h-full flex flex-col overflow-hidden min-h-155">
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 shrink-0 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-500/10 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      Генерация контента по базе знаний
                    </div>
                    <div className="text-xs text-neutral-500">
                      AI готов к работе
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetChat}
                  disabled={isResetting}
                  className="shrink-0 px-4 py-2 rounded-2xl border border-neutral-700 hover:border-red-500/50 hover:text-white text-sm text-neutral-300 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Сброс...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-4 h-4" />
                      Очистить чат
                    </>
                  )}
                </button>
              </div>

              {chatStatus && (
                <div className="px-6 pt-4 text-sm text-neutral-400">
                  {chatStatus}
                </div>
              )}

              <ChatMessageList
                messages={messages}
                className="flex-1 p-6 overflow-y-auto space-y-6 text-sm"
              />

              {isSending && (
                <div className="px-6 pb-4">
                  <div className="inline-flex items-center gap-3 bg-neutral-800 rounded-3xl px-5 py-3 text-sm text-neutral-400">
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    Генерирую ответ...
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-neutral-800 shrink-0">
                <ChatInputBox
                  value={inputMessage}
                  onChange={setInputMessage}
                  onKeyDown={handleKeyPress}
                  onSend={sendMessage}
                  placeholder="Опишите, какой контент нужно сгенерировать..."
                  inputDisabled={isSending}
                  disabled={isSending || !inputMessage.trim()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
