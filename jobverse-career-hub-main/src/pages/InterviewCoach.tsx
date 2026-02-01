import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // NEW
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function InterviewCoach() {
  const location = useLocation(); // NEW
  const incomingQuestion = (location.state as { question?: string } | null)?.question; // NEW

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: incomingQuestion
        ? `Let's practice this question: ${incomingQuestion}`
        : "Hello! I'm your interview coach. I'm here to help you practice your English interview skills. Let's start with a common question: Can you tell me about yourself and your background?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasIncrementedSession, setHasIncrementedSession] = useState(false); // NEW
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/interview-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get response.");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // increment interviewSessions once per page load on first successful reply
      if (!hasIncrementedSession) {
        setHasIncrementedSession(true);
        try {
          await fetch("http://localhost:5000/api/stats/increment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ field: "interviewSessions" }),
          });
        } catch (err) {
          console.error("Failed to increment interviewSessions stat:", err);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-5xl font-semibold tracking-luxury text-foreground">
          Interview Coach
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Practice your English interview skills with AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-gradient-card shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-luxury text-foreground">
              Practice Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto space-y-4 rounded-lg border border-border bg-card p-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent flex-shrink-0">
                        <Bot className="h-4 w-4 text-accent-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start animate-in fade-in-50 duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent flex-shrink-0">
                      <Bot className="h-4 w-4 text-accent-foreground animate-pulse" />
                    </div>
                    <div className="bg-muted text-foreground rounded-lg p-3">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your response..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="bg-card border-border"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-accent text-accent-foreground shadow-glow-accent hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-luxury text-foreground">
              Practice Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-2">STAR Method</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>S</strong>ituation
                </li>
                <li>
                  <strong>T</strong>ask
                </li>
                <li>
                  <strong>A</strong>ction
                </li>
                <li>
                  <strong>R</strong>esult
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-2">Common Topics</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Self Introduction</li>
                <li>• Technical Skills</li>
                <li>• Past Projects</li>
                <li>• Problem Solving</li>
                <li>• Teamwork</li>
                <li>• Career Goals</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-2">Speaking Tips</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Speak clearly and slowly</li>
                <li>• Use professional vocabulary</li>
                <li>• Structure your answers</li>
                <li>• Be specific with examples</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
