import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuizContainer, QuizQuestion } from "@/components/Education/QuizContainer";

interface Quiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
  xpReward: number;
}

export default function QuizPage({ quizId }: { quizId?: string }) {
  const params = useParams<{ quizId: string }>();
  const resolvedQuizId = quizId || params.quizId;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  
  useEffect(() => {
    if (resolvedQuizId) {
      fetch(`/api/v1/education/quiz/${resolvedQuizId}`)
        .then(res => res.json())
        .then(data => setQuiz(data.quiz))
        .catch(err => console.error("Failed to fetch quiz:", err));
    }
  }, [resolvedQuizId]);
  
  if (!quiz) return <div className="p-8 text-center text-gray-500">Loading Quiz...</div>;
  
  return (
    <QuizContainer
      title={quiz.title}
      description={quiz.description}
      questions={quiz.questions}
      xpReward={quiz.xpReward}
      // onComplete={...} // handle quiz submission here
    />
  );
}
