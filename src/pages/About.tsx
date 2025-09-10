import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Our AI uses natural language processing and machine learning to provide human-like interview experiences with personalized feedback.",
      benefits: ["Natural conversation flow", "Contextual follow-up questions", "Real-time response analysis"]
    },
    {
      icon: Target,
      title: "Industry-Specific Training",
      description: "Tailored interview questions and scenarios for different industries, roles, and experience levels.",
      benefits: ["Tech, Finance, Healthcare & more", "Entry to Executive level", "Custom question banks"]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your interview data is completely secure with end-to-end encryption and privacy-first design.",
      benefits: ["End-to-end encryption", "No data sharing", "GDPR compliant"]
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Join thousands of successful candidates who've improved their interview performance with our platform.",
      benefits: ["95% satisfaction rate", "Average 40% improvement", "Trusted by top companies"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Interviews Conducted" },
    { number: "95%", label: "User Satisfaction" },
    { number: "40%", label: "Average Improvement" },
    { number: "24/7", label: "Available Practice" }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Choose Your Focus",
      description: "Select the type of interview practice you need - general, behavioral, technical, or industry-specific."
    },
    {
      step: 2,
      title: "Practice with AI",
      description: "Engage in realistic interview conversations with our AI interviewer that adapts to your responses."
    },
    {
      step: 3,
      title: "Get Detailed Feedback",
      description: "Receive comprehensive analysis of your performance with specific suggestions for improvement."
    },
    {
      step: 4,
      title: "Track Progress",
      description: "Monitor your improvement over time and identify areas that need more practice."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-6">About AI Interviewer</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Revolutionizing Interview{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Preparation
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're on a mission to help job seekers build confidence and ace their interviews 
            through AI-powered practice sessions and personalized feedback.
          </p>
          <Link to="/interview">
            <Button variant="hero" size="lg">
              Start Practicing Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to interview success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose AI Interviewer?
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive features designed for your success
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <feature.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl lg:text-3xl mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                We believe that everyone deserves the opportunity to showcase their best self in interviews. 
                Our AI-powered platform democratizes access to high-quality interview preparation, 
                helping candidates build confidence and improve their chances of landing their dream jobs.
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">Inclusive</div>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">Innovative</div>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-sm font-semibold">Results-Driven</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful candidates who've mastered their interviews with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/interview">
              <Button variant="premium" size="lg">
                Start Free Practice
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;