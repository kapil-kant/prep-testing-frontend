import React, { useState, useEffect } from 'react';
import useBlind75 from '../hooks/useBlind75';
import { getSolvedCount } from '../services/blind75Service';

const DIFFICULTY_STYLES = {
  EASY:   'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HARD:   'bg-red-100 text-red-700',
};

const STATUS_STYLES = {
  NOT_STARTED: 'bg-gray-100 text-gray-600',
  SOLVED:      'bg-green-100 text-green-700',
  ATTEMPTED:   'bg-yellow-100 text-yellow-700',
  TODO:        'bg-blue-100 text-blue-700',
};

const SELECTABLE_STATUSES = ['SOLVED', 'ATTEMPTED', 'TODO'];

function QuestionRow({ index, question, statuses, onProgressUpdate }) {
  const {
    title,
    difficulty,
    topic,
    pattern,
    practiceLink,
    videoSolutionLink,
    videoAvailability,
    status,
  } = question;

  const isVideoAvailable = videoAvailability === 'AVAILABLE';
  const selectableOptions = statuses?.length ? statuses : SELECTABLE_STATUSES;
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-purple-50/40';

  return (
    <tr className={`${rowBg} hover:bg-purple-50 transition-colors`}>
      {/* # */}
      <td className="px-4 py-3 text-xs text-gray-400 font-mono w-10 text-center">
        {index + 1}
      </td>

      {/* Title */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs">
        {title}
      </td>

      {/* Difficulty */}
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${DIFFICULTY_STYLES[difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
          {difficulty}
        </span>
      </td>

      {/* Topic */}
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {topic ?? '—'}
      </td>

      {/* Pattern */}
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {pattern ?? '—'}
      </td>

      {/* Status */}
      <td className="px-4 py-3 text-center">
        <select
          value={status ?? 'NOT_STARTED'}
          onChange={(e) => onProgressUpdate(question.id, e.target.value)}
          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer focus:ring-2 focus:ring-purple-300 ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {(status === 'NOT_STARTED' || !status) && (
            <option value="NOT_STARTED">NOT STARTED</option>
          )}
          {selectableOptions.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </td>

      {/* Practice */}
      <td className="px-4 py-3">
        <a
          href={practiceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-md transition-colors whitespace-nowrap"
        >
          Practice
        </a>
      </td>

      {/* Video */}
      <td className="px-4 py-3">
        {isVideoAvailable ? (
          <button
            onClick={() => window.open(videoSolutionLink, '_blank', 'noopener,noreferrer')}
            className="w-7 h-7 flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white rounded-full transition-colors"
            aria-label="Watch video solution"
          >
            ▶
          </button>
        ) : (
          <span className="text-xs text-gray-400">Soon</span>
        )}
      </td>
    </tr>
  );
}

function Blind75Page() {
  const { questions, statuses, loading, error, handleProgressUpdate } = useBlind75();
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(75); // default total count

  useEffect(() => {
    getSolvedCount()
      .then(response => {
        setSolvedCount(response.data.data.solvedCount || 0);
        setTotalCount(response.data.data.totalCount || 75);
      })
      .catch(() => {
        setSolvedCount(0);
        setTotalCount(75);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Inter',sans-serif] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Blind 75</h1>

        {(() => {
          const pct = Math.round((solvedCount / totalCount) * 100);
          return (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">
                <span className="font-semibold text-purple-700">{solvedCount}</span> / {totalCount} questions solved
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-700 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-purple-700 w-10 text-right">{pct}%</span>
              </div>
            </div>
          );
        })()}

        <div className="rounded-xl border border-purple-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-purple-900 via-purple-800 to-violet-900 sticky top-0 z-10">
                  {['#', 'Title', 'Difficulty', 'Topic', 'Pattern', 'Status', 'Practice', 'Video'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-xs font-semibold text-purple-200 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <QuestionRow
                    key={q.id ?? q._id}
                    index={i}
                    question={q}
                    statuses={statuses}
                    onProgressUpdate={handleProgressUpdate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blind75Page;
