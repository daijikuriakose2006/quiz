
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, User, Award, Medal, Target } from "lucide-react";

interface QuizResult {
  id: string;
  quizId: string;
  userName: string;
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  submittedAt: Date;
  answers: number[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: Date;
}

interface QuizResultsProps {
  quizId: string;
}

export const QuizResults = ({ quizId }: QuizResultsProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    // Load quiz and results
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const foundQuiz = quizzes.find((q: Quiz) => q.id === quizId);
    setQuiz(foundQuiz);

    const allResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const quizResults = allResults
      .filter((result: QuizResult) => result.quizId === quizId)
      .map((result: QuizResult) => ({
        ...result,
        submittedAt: new Date(result.submittedAt)
      }))
      .sort((a: QuizResult, b: QuizResult) => {
        // Sort by score (descending), then by time (ascending)
        if (b.score !== a.score) return b.score - a.score;
        return a.timeElapsed - b.timeElapsed;
      });

    setResults(quizResults);
  }, [quizId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <Target className="w-6 h-6 text-gray-400" />;
    }
  };

  if (!quiz) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <p>Quiz not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{quiz.title} - Results</CardTitle>
          <p className="text-gray-600">
            {results.length} participant{results.length !== 1 ? 's' : ''} completed this quiz
          </p>
        </CardHeader>
      </Card>

      {results.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No results yet</p>
            <p className="text-gray-400">Results will appear here once someone takes the quiz</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="text-center py-6">
                <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{results.length}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-6">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">
                  {Math.round((results.reduce((sum, r) => sum + r.score, 0) / results.length / quiz.questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-6">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">
                  {formatTime(Math.round(results.reduce((sum, r) => sum + r.timeElapsed, 0) / results.length))}
                </div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-6">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">
                  {Math.max(...results.map(r => r.score))}/{quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Best Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index === 0 ? 'bg-yellow-50 border-yellow-200' :
                      index === 1 ? 'bg-gray-50 border-gray-200' :
                      index === 2 ? 'bg-orange-50 border-orange-200' :
                      'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="text-lg font-semibold">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{result.userName}</h3>
                        <p className="text-sm text-gray-600">
                          Completed {result.submittedAt.toLocaleDateString()} at {result.submittedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
                        {result.score}/{result.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((result.score / result.totalQuestions) * 100)}% • {formatTime(result.timeElapsed)}
                      </div>
                      <Badge variant={
                        result.score / result.totalQuestions >= 0.9 ? "default" :
                        result.score / result.totalQuestions >= 0.7 ? "secondary" :
                        "outline"
                      }>
                        {result.score / result.totalQuestions >= 0.9 ? "Excellent" :
                         result.score / result.totalQuestions >= 0.7 ? "Good" :
                         result.score / result.totalQuestions >= 0.5 ? "Average" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
