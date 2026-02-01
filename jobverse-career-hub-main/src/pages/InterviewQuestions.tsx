import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // NEW
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Building2, Briefcase, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const questions = [
  {
    company: "Google",
    role: "Software Engineer",
    difficulty: "Hard",
    question: "Design a URL shortening service like bit.ly",
    sampleAnswer:
      "Start by discussing the key requirements: generating unique short URLs, redirecting to original URLs, and handling high traffic. Cover database design, hashing algorithms (like Base62), caching strategies (Redis), and scalability considerations with load balancing.",
    tips: [
      "Discuss trade-offs between different approaches",
      "Mention scalability from the start",
      "Consider edge cases like URL expiration",
    ],
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    difficulty: "Medium",
    question: "Implement a LRU Cache with O(1) operations",
    sampleAnswer:
      "Use a combination of a doubly-linked list and a hash map. The hash map provides O(1) access to nodes, while the doubly-linked list maintains the order of access. Most recently used items are at the front, least recently used at the back.",
    tips: [
      "Explain both data structures and why you need both",
      "Walk through get and put operations",
      "Discuss space complexity",
    ],
  },
  {
    company: "Amazon",
    role: "Software Engineer",
    difficulty: "Medium",
    question: "Design a recommendation system for e-commerce",
    sampleAnswer:
      "Discuss collaborative filtering (user-based and item-based), content-based filtering, and hybrid approaches. Mention the importance of data collection, feature engineering, and real-time vs batch processing. Cover personalization, cold start problems, and evaluation metrics.",
    tips: [
      "Start with simple approaches before complex ones",
      "Discuss data requirements",
      "Consider both online and offline components",
    ],
  },
  {
    company: "TCS",
    role: "Data Analyst",
    difficulty: "Easy",
    question: "Explain the difference between supervised and unsupervised learning",
    sampleAnswer:
      "Supervised learning uses labeled data to train models for prediction (e.g., classification, regression). Unsupervised learning finds patterns in unlabeled data (e.g., clustering, dimensionality reduction). Provide examples like spam detection (supervised) vs customer segmentation (unsupervised).",
    tips: [
      "Use clear, real-world examples",
      "Mention use cases for each",
      "Explain when to use which approach",
    ],
  },
  {
    company: "Infosys",
    role: "Full Stack Developer",
    difficulty: "Medium",
    question: "How would you optimize a slow-loading web application?",
    sampleAnswer:
      "Start with identifying bottlenecks using browser DevTools and profiling. Discuss optimizations: code splitting, lazy loading, image optimization, caching strategies, CDN usage, database query optimization, minification, and reducing bundle size. Prioritize based on impact.",
    tips: [
      "Measure first, optimize second",
      "Discuss both frontend and backend optimizations",
      "Mention specific tools and techniques",
    ],
  },
  {
    company: "Google",
    role: "Product Manager",
    difficulty: "Hard",
    question: "How would you improve Google Maps?",
    sampleAnswer:
      "Start by identifying user segments and their pain points. Propose improvements like AR navigation, better offline maps, social features, integration with calendar for smart suggestions, improved public transit data, and accessibility features. Back each with user research and metrics.",
    tips: [
      "Define success metrics",
      "Consider different user personas",
      "Balance business and user needs",
    ],
  },
];

export default function InterviewQuestions() {
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const navigate = useNavigate(); // NEW

  // increment "Questions Viewed" once when this page is visited
  useEffect(() => {
    const incrementQuestionsViewed = async () => {
      try {
        await fetch("http://localhost:5000/api/stats/increment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field: "questionsViewed" }),
        });
      } catch (err) {
        console.error("Failed to increment questionsViewed stat:", err);
      }
    };
    incrementQuestionsViewed();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.company.toLowerCase().includes(search.toLowerCase()) ||
      q.role.toLowerCase().includes(search.toLowerCase());
    const matchesCompany = companyFilter === "all" || q.company === companyFilter;
    const matchesRole = roleFilter === "all" || q.role === roleFilter;
    return matchesSearch && matchesCompany && matchesRole;
  });

  const companies = Array.from(new Set(questions.map((q) => q.company)));
  const roles = Array.from(new Set(questions.map((q) => q.role)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-5xl font-semibold tracking-luxury text-foreground">
          Interview Questions
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse frequently asked questions from top companies
        </p>
      </div>

      <Card className="border-border bg-gradient-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
                <Briefcase className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredQuestions.map((q, index) => (
          <Card
            key={index}
            className="border-border bg-gradient-card shadow-md transition-all hover:shadow-lg cursor-pointer"
            onClick={() =>
              setExpandedQuestion(expandedQuestion === index ? null : index)
            }
          >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="font-serif text-xl font-medium tracking-luxury text-foreground flex items-start justify-between gap-2">
                    <span>{q.question}</span>
                    {expandedQuestion === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </CardTitle>
                </div>
                <Badge
                  variant={
                    q.difficulty === "Easy"
                      ? "default"
                      : q.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {q.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-primary text-primary">
                  <Building2 className="mr-1 h-3 w-3" />
                  {q.company}
                </Badge>
                <Badge variant="outline" className="border-accent text-accent">
                  <Briefcase className="mr-1 h-3 w-3" />
                  {q.role}
                </Badge>
              </div>

              {expandedQuestion === index && (
                <div className="space-y-4 mt-4 pt-4 border-t border-border animate-in fade-in-50 duration-300">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-accent" />
                      Sample Answer Approach
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {q.sampleAnswer}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Tips</h4>
                    <ul className="space-y-2">
                      {q.tips.map((tip, tipIndex) => (
                        <li
                          key={tipIndex}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-accent mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/interview-coach", { state: { question: q.question } });
                    }}
                  >
                    Practice This Question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card className="border-border bg-gradient-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No questions found matching your criteria
          </CardContent>
        </Card>
      )}
    </div>
  );
}
