import { privateAxios } from './axiosInstance';

export const getAllQuestions = () => {
  return privateAxios.get('/api/v1/blind75');
};

export const getStatuses = () => {
  return privateAxios.get('/api/v1/blind75/statuses');
};

export const updateProgress = (questionId, status) => {
  return privateAxios.post(`/api/v1/blind75/${questionId}/progress`, { status });
};

export const getStats = () => {
  return privateAxios.get('/api/v1/blind75/stats');
};

