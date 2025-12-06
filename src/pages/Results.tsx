import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Results = () => {
  // Mock data - in real app, fetch from Supabase based on session
  const technicalScore = 72;
  const communicationScore = 85;
  
  const strengths = [
    "Clear and structured responses",
    "Good use of technical terminology",
    "Confident delivery and pace"
  ];
  
  const weaknesses = [
    "Could provide more specific examples",
    "Needs to quantify achievements with metrics",
    "Some technical concepts need deeper explanation"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Interview Results
          </h1>
          <p className="text-muted-foreground">
            Your performance summary
          </p>
        </div>

        {/* Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Technical Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={technicalScore} className="h-3 flex-1" />
                <span className="text-2xl font-bold text-primary">{technicalScore}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={communicationScore} className="h-3 flex-1" />
                <span className="text-2xl font-bold text-primary">{communicationScore}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-success mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-warning mt-1">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Link to="/interview">
            <Button variant="interview" size="lg">
              Take Another Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
