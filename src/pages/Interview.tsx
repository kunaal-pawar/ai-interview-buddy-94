import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Pause, SkipForward, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Interview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [response, setResponse] = useState("");
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Tell me about yourself and your background.",
      category: "General",
      timeLimit: 120
    },
    {
      id: 2,
      question: "What are your greatest strengths and how do they apply to this role?",
      category: "Strengths",
      timeLimit: 90
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      category: "Problem Solving",
      timeLimit: 180
    },
    {
      id: 4,
      question: "Where do you see yourself in 5 years?",
      category: "Career Goals",
      timeLimit: 90
    },
    {
      id: 5,
      question: "Why are you interested in this position and our company?",
      category: "Motivation",
      timeLimit: 120
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && isRecording) {
      setIsRecording(false);
    }
    return () => clearInterval(interval);
  }, [isRecording, timer]);

  const startInterview = () => {
    setIsInterviewStarted(true);
    setTimer(questions[currentQuestion].timeLimit);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setTimer(questions[currentQuestion].timeLimit);
    }
    setIsRecording(!isRecording);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setResponse("");
      setIsRecording(false);
      setTimer(questions[currentQuestion + 1].timeLimit);
    } else {
      setIsCompleted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-card">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <CardTitle className="text-2xl">Interview Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              Great job! You've completed all {questions.length} questions. 
              Your responses are being analyzed by our AI system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/results">
                <Button variant="interview" size="lg">
                  View Results
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Take Another Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">AI Interview Session</CardTitle>
            <p className="text-muted-foreground">
              Get ready for your mock interview! You'll be asked {questions.length} questions 
              covering various aspects of a typical job interview.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Interview Guidelines:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Each question has a time limit</li>
                <li>• You can type or use voice recording</li>
                <li>• Take your time to think before responding</li>
                <li>• Be honest and specific in your answers</li>
              </ul>
            </div>
            <Button variant="hero" size="lg" onClick={startInterview} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <Badge variant="secondary">
                {questions[currentQuestion].category}
              </Badge>
            </div>
            <Progress 
              value={((currentQuestion + 1) / questions.length) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                <div className="text-lg font-mono">
                  Time: {formatTime(timer)}
                </div>
              </div>
              {isRecording && (
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </div>
            
            <Textarea
              placeholder="Type your response here or use voice recording..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[200px] text-base"
            />
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                {response.length > 0 && `${response.length} characters`}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={nextQuestion}>
                  <SkipForward className="h-4 w-4 mr-2" />
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next Question"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">💡 Interview Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
              <li>• Be specific with examples from your experience</li>
              <li>• Keep your answers concise but comprehensive</li>
              <li>• Show enthusiasm and passion for the role</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;