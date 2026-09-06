import { useState } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { problems } from '@/data/problems';

export function ProblemSolving() {
  const { theme } = useTheme();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleAnswer = (problemId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [problemId]: optionIndex }));
  };

  const handleSubmit = (problemId: number) => {
    setSubmitted((prev) => ({ ...prev, [problemId]: true }));
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted({});
  };

  const correctCount = problems.filter(
    (p) => submitted[p.id] && answers[p.id] === p.correctIndex
  ).length;
  const totalAnswered = Object.keys(submitted).length;
  const score = totalAnswered > 0 ? `${correctCount}/${problems.length}` : `0/${problems.length}`;

  return (
    <Section
      id="problem-solving"
      title="Solve a Sorting Problem"
      subtitle="Test your understanding with practical scenarios. Choose an answer, check it, and read the explanation."
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
            <Award className="w-4 h-4" />
            Score: {score}
          </div>
          <button
            onClick={handleReset}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {problems.map((problem, idx) => {
          const selected = answers[problem.id];
          const isSubmitted = submitted[problem.id];
          const isCorrect = isSubmitted && selected === problem.correctIndex;

          return (
            <div
              key={problem.id}
              className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                  {idx + 1}
                </span>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {problem.question}
                </p>
              </div>

              <div className="space-y-2 ml-8">
                {problem.options.map((option, optIdx) => {
                  const isSelected = selected === optIdx;
                  const isCorrectOption = problem.correctIndex === optIdx;
                  let optionClass = '';

                  if (isSubmitted) {
                    if (isCorrectOption) {
                      optionClass = theme === 'dark' ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-700';
                    } else if (isSelected) {
                      optionClass = theme === 'dark' ? 'bg-red-500/15 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700';
                    } else {
                      optionClass = theme === 'dark' ? 'bg-gray-800/50 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400';
                    }
                  } else if (isSelected) {
                    optionClass = theme === 'dark' ? 'bg-blue-500/15 border-blue-500/50 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-700';
                  } else {
                    optionClass = theme === 'dark' ? 'bg-gray-800/50 border-gray-800 text-gray-300 hover:border-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !isSubmitted && handleAnswer(problem.id, optIdx)}
                      disabled={isSubmitted}
                      className={`flex items-center gap-3 w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-all ${optionClass}`}
                    >
                      <span className="font-mono text-xs">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1">{option}</span>
                      {isSubmitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted && selected !== undefined && (
                <button
                  onClick={() => handleSubmit(problem.id)}
                  className="mt-3 ml-8 rounded-lg px-4 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all"
                >
                  Check Answer
                </button>
              )}

              {isSubmitted && (
                <div className={`mt-4 ml-8 rounded-lg p-4 text-sm ${isCorrect ? (theme === 'dark' ? 'bg-emerald-950/30 border border-emerald-900/40' : 'bg-emerald-50 border border-emerald-200') : (theme === 'dark' ? 'bg-red-950/30 border border-red-900/40' : 'bg-red-50 border border-red-200')}`}>
                  <p className={`font-medium mb-2 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </p>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {problem.explanation}
                  </p>
                  <p className={`mt-2 text-xs font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {problem.complexity}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
