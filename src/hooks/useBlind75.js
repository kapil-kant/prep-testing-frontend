import { useState, useEffect } from 'react';
import { getAllQuestions, getStatuses, updateProgress } from '../services/blind75Service';

function useBlind75() {
  const [questions, setQuestions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProgress, setUserProgress] = useState({ solvedCount: 0, totalCount: 0 });
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState(null);

  useEffect(() => {
    Promise.all([getAllQuestions(), getStatuses()])
      .then(([questionsRes, statusesRes]) => {
        setQuestions(questionsRes.data.data);
        setStatuses(statusesRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load questions.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setProgressLoading(true);
    setProgressError(null);
    getUserProgressSummary()
      .then((res) => {
        setUserProgress(res.data.data || { solvedCount: 0, totalCount: 0 });
      })
      .catch((err) => {
        setProgressError(err.response?.data?.message || 'Failed to load user progress.');
        setUserProgress({ solvedCount: 0, totalCount: 0 });
      })
      .finally(() => setProgressLoading(false));
  }, []);

  const handleProgressUpdate = (questionId, status) => {
    updateProgress(questionId, status)
      .then(() => {
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...q, status } : q))
        );
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to update progress.'));
  };

  return { questions, statuses, loading, error, userProgress, progressLoading, progressError, handleProgressUpdate };
}

export default useBlind75;
