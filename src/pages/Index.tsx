
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, QrCode, Trophy, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { QuizCreator } from "@/components/QuizCreator";
import { QuizTaker } from "@/components/QuizTaker";
import { QuizResults } from "@/components/QuizResults";
import { QuizList } from "@/components/QuizList";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'take' | 'results' | 'list'>('home');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const quizId = params.get("quiz");
    if (quizId) {
      setSelectedQuizId(quizId);
      setCurrentView("take");
    }
  }, [location.search]);

  const handleTakeQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentView('take');
  };

  const handleViewResults = (quizId: string) => {
    navigate(`/results/${quizId}`);
  };

  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setCurrentView('home')} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Home
          </Button>
          <QuizCreator onComplete={() => setCurrentView('home')} />
        </div>
      </div>
    );
  }

  if (currentView === 'take' && selectedQuizId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setCurrentView('home')} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Home
          </Button>
          <QuizTaker 
            quizId={selectedQuizId} 
            onComplete={() => {
              setCurrentView('results');
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'results' && selectedQuizId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setCurrentView('home')} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Home
          </Button>
          <QuizResults quizId={selectedQuizId} />
        </div>
      </div>
    );
  }

  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setCurrentView('home')} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Home
          </Button>
          <QuizList 
            onTakeQuiz={handleTakeQuiz}
            onViewResults={handleViewResults}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Quiz Master
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create engaging quizzes, share with QR codes, and track results in real-time
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <Button 
              onClick={signOut} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('create')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Create Quiz</CardTitle>
              <CardDescription>
                Design custom quizzes with multiple choice questions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('list')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Browse Quizzes</CardTitle>
              <CardDescription>
                View all available quizzes and generate QR codes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('list')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Take Quiz</CardTitle>
              <CardDescription>
                Join a quiz session and test your knowledge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('list')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">View Results</CardTitle>
              <CardDescription>
                Check scores, rankings, and detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">How it Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                  <h3 className="font-semibold mb-2">Create</h3>
                  <p className="text-sm text-gray-600">Design your quiz with questions and answers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                  <h3 className="font-semibold mb-2">Share</h3>
                  <p className="text-sm text-gray-600">Generate QR codes for easy access</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                  <h3 className="font-semibold mb-2">Analyze</h3>
                  <p className="text-sm text-gray-600">View results and rankings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
