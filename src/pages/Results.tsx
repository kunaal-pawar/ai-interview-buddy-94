import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Target, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";

const Results = () => {
  const overallScore = 78;
  
  const categoryScores = [
    { category: "Communication", score: 85, color: "bg-success" },
    { category: "Technical Knowledge", score: 72, color: "bg-primary" },
    { category: "Problem Solving", score: 80, color: "bg-warning" },
    { category: "Cultural Fit", score: 75, color: "bg-muted" }
  ];

  const feedback = [
    {
      question: "Tell me about yourself",
      score: 85,
      strengths: ["Clear structure", "Relevant experience mentioned", "Confident delivery"],
      improvements: ["Could be more concise", "Add specific achievements"]
    },
    {
      question: "Greatest strengths",
      score: 72,
      strengths: ["Good self-awareness", "Relevant to role"],
      improvements: ["Provide concrete examples", "Show impact with numbers"]
    },
    {
      question: "Challenging project",
      score: 80,
      strengths: ["Used STAR method well", "Clear problem description", "Good outcome"],
      improvements: ["More details on your specific role", "Quantify the impact"]
    }
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: "Improvement Trend",
      description: "Your scores improved by 15% compared to your last interview",
      positive: true
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Average response time: 45 seconds (Good pace)",
      positive: true
    },
    {
      icon: MessageSquare,
      title: "Communication Style",
      description: "Clear and articulate responses with good structure",
      positive: true
    },
    {
      icon: Target,
      title: "Focus Areas",
      description: "Work on providing more specific examples and metrics",
      positive: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Interview Results
          </h1>
          <p className="text-xl text-muted-foreground">
            Detailed analysis and feedback from your AI interview session
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Overall Performance</CardTitle>
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20"></div>
              <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{overallScore}%</span>
              </div>
            </div>
            <Badge variant="secondary" className="mt-4">
              {overallScore >= 80 ? "Excellent" : overallScore >= 70 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Feedback</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="actions">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Category Scores */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoryScores.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">5/5</div>
                  <div className="text-sm text-muted-foreground">Questions Completed</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">12 min</div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">+15%</div>
                  <div className="text-sm text-muted-foreground">Improvement</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {feedback.map((item, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                    <Badge variant={item.score >= 80 ? "default" : "secondary"}>
                      {item.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-success flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {item.strengths.map((strength, i) => (
                        <li key={i}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {item.improvements.map((improvement, i) => (
                        <li key={i}>• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <insight.icon className={`h-8 w-8 ${insight.positive ? 'text-success' : 'text-warning'}`} />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
                <CardDescription>
                  Based on your performance, here's what we recommend to improve your interview skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Practice with Specific Examples</h4>
                      <p className="text-sm text-muted-foreground">Prepare 3-5 detailed examples using the STAR method for common behavioral questions.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Quantify Your Achievements</h4>
                      <p className="text-sm text-muted-foreground">Include specific numbers, percentages, and metrics to make your responses more impactful.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Take Another Practice Interview</h4>
                      <p className="text-sm text-muted-foreground">Regular practice helps build confidence and improves your natural response flow.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/interview">
                    <Button variant="interview" size="lg">
                      Take Another Interview
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;