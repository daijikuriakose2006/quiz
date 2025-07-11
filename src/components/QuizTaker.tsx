
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
}

interface QuizTakerProps {
  quizId: string;
  onComplete: () => void;
}

export const QuizTaker = ({ quizId, onComplete }: QuizTakerProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [userName, setUserName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load quiz from localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const foundQuiz = quizzes.find((q: Quiz) => q.id === quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setAnswers(new Array(foundQuiz.questions.length).fill(-1));
    }
  }, [quizId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && quiz) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, quiz]);

  const startQuiz = () => {
    if (!userName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name to start the quiz",
        variant: "destructive"
      });
      return;
    }
    setIsStarted(true);
  };

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    if (!quiz) return;

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Save result
    const result = {
      id: Date.now().toString(),
      quizId,
      userName: userName.trim(),
      score,
      totalQuestions: quiz.questions.length,
      timeElapsed,
      submittedAt: new Date(),
      answers
    };

    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    localStorage.setItem('quizResults', JSON.stringify([...existingResults, result]));

    toast({
      title: "Quiz Submitted!",
      description: `You scored ${score} out of ${quiz.questions.length}`,
    });

    onComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <p>Quiz not found.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <p className="text-gray-600 mt-2">{quiz.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg">Questions: {quiz.questions.length}</p>
            <p className="text-gray-600">Enter your name to begin</p>
          </div>
          
          <div className="max-w-sm mx-auto">
            <Label htmlFor="userName">Your Name</Label>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-gray-400" />
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
              />
            </div>
          </div>

          <div className="text-center">
            <Button onClick={startQuiz} className="px-8 py-3 text-lg">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-gray-600">Welcome, {userName}</p>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              {formatTime(timeElapsed)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectAnswer(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={submitQuiz}
                disabled={answers[currentQuestion] === -1}
                className="px-8"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === -1}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
