import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, MessageSquare, HelpCircle } from "lucide-react";

interface Stats {
  resumesCreated: number;
  resumeScoresChecked: number;
  interviewSessions: number;
  questionsViewed: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    loadStats();
  }, []);

  const cards = [
    {
      title: "Resumes Created",
      value: stats?.resumesCreated ?? 0,
      icon: FileText,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Resume Scores",
      value: stats?.resumeScoresChecked ?? 0,
      icon: CheckCircle,
      gradient: "bg-gradient-success",
    },
    {
      title: "Interview Sessions",
      value: stats?.interviewSessions ?? 0,
      icon: MessageSquare,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Questions Viewed",
      value: stats?.questionsViewed ?? 0,
      icon: HelpCircle,
      gradient: "bg-gradient-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-5xl font-semibold tracking-luxury text-foreground">
          Welcome to Job-verse
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your all-in-one platform for career preparation and success
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Card
            key={stat.title}
            className="overflow-hidden border-border bg-gradient-card shadow-md transition-all hover:shadow-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-4xl font-semibold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-luxury text-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/resume-generator"
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Create Resume</p>
                <p className="text-sm text-muted-foreground">
                  Generate your professional resume
                </p>
              </div>
            </a>
            <a
              href="/resume-checker"
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
            >
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Check Resume</p>
                <p className="text-sm text-muted-foreground">
                  Analyze and improve your resume
                </p>
              </div>
            </a>
            <a
              href="/interview-coach"
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
            >
              <MessageSquare className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Practice Interview</p>
                <p className="text-sm text-muted-foreground">
                  Improve your English skills
                </p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-luxury text-foreground">
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Generate Your Resume</p>
                <p className="text-sm text-muted-foreground">
                  Start by creating a professional resume with AI assistance
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Check Your Score</p>
                <p className="text-sm text-muted-foreground">
                  Get detailed feedback and improvement suggestions
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Practice Interviews</p>
                <p className="text-sm text-muted-foreground">
                  Master common questions and improve your communication
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
