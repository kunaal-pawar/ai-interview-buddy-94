import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, SkipForward, CheckCircle, Camera, CameraOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface Question {
  id: string;
  question_text: string;
  category: string;
  time_limit: number;
  order_index: number;
}

const Interview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [response, setResponse] = useState("");
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadQuestions();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadQuestions = async () => {
    const { data, error } = await supabase
      .from('interview_questions')
      .select('*')
      .order('order_index');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } else if (data) {
      setQuestions(data);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && isRecording) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, timer]);

  const startInterview = async () => {
    if (!user) return;

    // Create session
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start interview session",
        variant: "destructive",
      });
      return;
    }

    setSessionId(data.id);
    setIsInterviewStarted(true);
    setTimer(questions[currentQuestion].time_limit);
    await startCamera();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Setup audio recorder
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'audio/webm'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera and microphone",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (mediaRecorder) {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      setTimer(questions[currentQuestion].time_limit);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Wait for audio chunks to be available
      setTimeout(async () => {
        await processRecording();
      }, 100);
    }
  };

  const processRecording = async () => {
    if (audioChunks.length === 0) return;

    setIsLoading(true);
    
    try {
      // Convert audio to base64
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        // Transcribe audio
        const { data: transcribeData, error: transcribeError } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });

        if (transcribeError) {
          throw transcribeError;
        }

        const transcribedText = transcribeData.text || response;
        setResponse(transcribedText);

        // Evaluate answer
        const { data: evaluationData, error: evaluationError } = await supabase.functions.invoke('evaluate-answer', {
          body: {
            question: questions[currentQuestion].question_text,
            answer: transcribedText,
            category: questions[currentQuestion].category
          }
        });

        if (evaluationError) {
          throw evaluationError;
        }

        // Save response
        await supabase
          .from('interview_responses')
          .insert({
            session_id: sessionId,
            question_id: questions[currentQuestion].id,
            audio_text: transcribedText,
            is_correct: evaluationData.is_correct,
            score: evaluationData.score,
            feedback: evaluationData.feedback
          });

        toast({
          title: "Answer Recorded",
          description: `Score: ${evaluationData.score}/100`,
        });
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing recording:', error);
      toast({
        title: "Error",
        description: "Failed to process your answer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setResponse("");
      setIsRecording(false);
      setAudioChunks([]);
      setTimer(questions[currentQuestion + 1].time_limit);
    } else {
      // Complete interview
      if (sessionId) {
        await supabase
          .from('interview_sessions')
          .update({ completed_at: new Date().toISOString() })
          .eq('id', sessionId);
      }
      setIsCompleted(true);
      stopCamera();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-3xl">Interview Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              Congratulations! You've successfully completed all interview questions.
              Your responses have been recorded and analyzed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/results')} 
                size="lg"
                className="shadow-card"
              >
                View Results
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                size="lg"
              >
                Retake Interview
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
        <Card className="max-w-3xl w-full shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Welcome to Your AI Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Interview Guidelines:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You will be asked {questions.length} questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Each question has a time limit - use your time wisely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You can record your answers using voice or type them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Your camera will be on during the interview for a realistic experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AI will evaluate your responses and provide feedback</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={startInterview} 
              size="lg" 
              className="w-full shadow-card"
              disabled={!user}
            >
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        {/* Progress Bar */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentQuestion) / questions.length) * 100} />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Camera Section */}
          <Card className="md:col-span-1 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CameraOff className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Section */}
          <Card className="md:col-span-2 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Badge variant="secondary">{questions[currentQuestion].category}</Badge>
                  <CardTitle className="text-2xl mt-2">{questions[currentQuestion].question_text}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatTime(timer)}</div>
                  <div className="text-xs text-muted-foreground">Time Remaining</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recording Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={toggleRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="flex-1 shadow-card"
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
                <Button
                  onClick={nextQuestion}
                  variant="outline"
                  className="shadow-card"
                  disabled={isLoading || isRecording}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Response Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Response</label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Your answer will appear here after recording, or you can type it directly..."
                  className="min-h-[200px]"
                  disabled={isLoading}
                />
              </div>

              {isLoading && (
                <p className="text-sm text-muted-foreground text-center">
                  Processing your answer...
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interview Tips */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Interview Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Speak clearly and maintain eye contact with the camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Structure your answers with specific examples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Keep track of time and be concise</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
