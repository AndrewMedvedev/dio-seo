import { useState, useEffect } from "react";
import { PromotionApi } from "../../api/Promotion";

export function useHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async (page = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setHistoryLoading(true);
    setHistoryError(null);

    try {
      const data = await PromotionApi.history(page, 10);
      const newItems = data.results || data || [];

      if (isLoadMore) {
        setHistoryData((prev) => [...prev, ...newItems]);
      } else {
        setHistoryData(newItems);
      }
      setHasMore(newItems.length === 10);
      setCurrentPage(page);
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
      setHistoryError("Не удалось загрузить историю генераций");
    } finally {
      setHistoryLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      setCurrentPage(1);
      setHistoryData([]);
      setHasMore(true);
      fetchHistory(1, false);
    }
  }, [showHistory]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    fetchHistory(nextPage, true);
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return {
    historyData,
    historyLoading,
    historyError,
    showHistory,
    hasMore,
    loadingMore,
    currentPage,
    toggleHistory,
    loadMore,
    fetchHistory,
  };
}
