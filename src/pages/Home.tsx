import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, MessageSquare, BarChart3, Users, CheckCircle, Star } from "lucide-react";
import heroImage from "@/assets/hero-ai-interview.jpg";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI analyzes your responses and provides personalized feedback"
    },
    {
      icon: MessageSquare,
      title: "Real-time Interaction",
      description: "Natural conversation flow with adaptive questioning based on your answers"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Comprehensive performance metrics and improvement suggestions"
    },
    {
      icon: Users,
      title: "Industry-Specific",
      description: "Tailored questions for different roles and industries"
    }
  ];

  const benefits = [
    "Practice unlimited interviews",
    "Get instant feedback",
    "Track progress over time",
    "Boost confidence",
    "Improve communication skills"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Master Your{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Interview Skills
                </span>{" "}
                with AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Practice with our advanced AI interviewer, get real-time feedback, 
                and land your dream job with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/interview">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Start Interview
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="AI Interview Platform" 
                className="rounded-2xl shadow-card animate-float"
              />
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-elegant">
                ✨ AI Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose AI Interviewer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with proven interview techniques
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Unlock Your Interview Potential
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Transform your interview performance with our comprehensive AI-driven platform
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/interview">
                  <Button variant="interview" size="lg">
                    Try It Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic text-muted-foreground">
                  "The AI interviewer helped me practice and gain confidence. 
                  I landed my dream job after just one week of using the platform!"
                </blockquote>
                <cite className="text-sm font-semibold text-foreground mt-4 block">
                  - Sarah Johnson, Software Engineer
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful candidates who've improved their interview skills with AI
          </p>
          <Link to="/interview">
            <Button variant="premium" size="lg" className="text-lg px-8 py-4">
              Start Your Free Interview
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;