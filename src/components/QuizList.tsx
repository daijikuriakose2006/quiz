
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Play, BarChart3, Calendar, Users, Clock } from "lucide-react";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: Date;
}

interface QuizListProps {
  onTakeQuiz: (quizId: string) => void;
  onViewResults: (quizId: string) => void;
}

export const QuizList = ({ onTakeQuiz, onViewResults }: QuizListProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizForQR, setSelectedQuizForQR] = useState<string | null>(null);
  const [resultsMap, setResultsMap] = useState<{ [quizId: string]: any[] }>({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await supabase.from("quizzes").select("*");
      if (data) {
        setQuizzes(
          data.map((quiz: any) => ({
            ...quiz,
            createdAt: quiz.created_at ? new Date(quiz.created_at) : new Date(),
            questions: Array.isArray(quiz.questions) ? quiz.questions : [],
          }))
        );
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase.from("quiz_results").select("*");
      if (data) {
        // Group results by quiz_id
        const map: { [quizId: string]: any[] } = {};
        data.forEach((result: any) => {
          if (!map[result.quiz_id]) map[result.quiz_id] = [];
          map[result.quiz_id].push(result);
        });
        setResultsMap(map);
      }
    };
    fetchResults();
  }, []);

  const getQuizResults = (quizId: string) => {
    return resultsMap[quizId] || [];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Available Quizzes</CardTitle>
          <p className="text-gray-600">Choose a quiz to take or view results</p>
        </CardHeader>
      </Card>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 mb-2">No quizzes available</p>
            <p className="text-gray-400">Create your first quiz to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {quizzes.map((quiz) => {
            const results = getQuizResults(quiz.id);
            const avgScore = results.length > 0 
              ? Math.round((results.reduce((sum: number, r: any) => sum + r.score, 0) / results.length / quiz.questions.length) * 100)
              : 0;

            return (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                      {quiz.description && (
                        <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {quiz.questions.length} questions
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {quiz.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      {results.length} taken
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <BarChart3 className="w-4 h-4" />
                      {avgScore}% avg
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => onTakeQuiz(quiz.id)}
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Take Quiz
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => onViewResults(quiz.id)}
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Results
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedQuizForQR(quiz.id)}
                      className="flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </Button>
                  </div>

                  {results.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Recent Participants:</h4>
                      <div className="space-y-1">
                        {results.slice(0, 3).map((result: any, index: number) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>{result.userName}</span>
                            <span className="text-gray-600">
                              {result.score}/{quiz.questions.length}
                            </span>
                          </div>
                        ))}
                        {results.length > 3 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{results.length - 3} more participants
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedQuizForQR && (
        <QRCodeGenerator 
          quizId={selectedQuizForQR}
          onClose={() => setSelectedQuizForQR(null)}
        />
      )}
    </div>
  );
};
