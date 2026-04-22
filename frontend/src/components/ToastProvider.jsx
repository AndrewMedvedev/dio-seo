// ToastContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import MiniErrorToast from "./Error";
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastData, setToastData] = useState(null);

  const showError = useCallback((data) => {
    setToastData({
      statusCode: data.statusCode,
      message: data.message,
      variant: data.variant || "error",
      autoClose: data.autoClose || 6500,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastData(null);
  }, []);

  // ← Ключевой момент: регистрируем глобальную функцию
  useEffect(() => {
    window.showGlobalError = showError;

    // Очистка при размонтировании (на всякий случай)
    return () => {
      delete window.showGlobalError;
    };
  }, [showError]);

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}

      {toastData && (
        <MiniErrorToast
          statusCode={toastData.statusCode}
          message={toastData.message}
          variant={toastData.variant}
          autoClose={toastData.autoClose}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
