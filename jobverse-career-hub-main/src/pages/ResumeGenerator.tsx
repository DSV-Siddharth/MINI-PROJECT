import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileText, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumePreview from "@/components/ResumePreview";

export default function ResumeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeMarkdown, setResumeMarkdown] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isGenerating) {
      const steps = [
        { progress: 20, message: "Analyzing your profile..." },
        { progress: 40, message: "Structuring content..." },
        { progress: 60, message: "Crafting professional summary..." },
        { progress: 80, message: "Formatting experience..." },
        { progress: 95, message: "Final touches..." },
      ];
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          setGenerationProgress(steps[stepIndex].progress);
          setCurrentStep(steps[stepIndex].message);
          stepIndex++;
        }
      }, 800);
      return () => clearInterval(interval);
    } else {
      setGenerationProgress(0);
      setCurrentStep("");
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate your resume",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);

    try {
      const response = await fetch("http://localhost:5000/api/resumes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate resume.");
      }

      const data = await response.json();
      console.log("Received resume data:", data);

      const markdown = data.resume || data.result || "";
      setResumeMarkdown(markdown);

      setGenerationProgress(100);
      setCurrentStep("Complete!");

      // NEW: increment "Resumes Created" stat for dashboard
      try {
        await fetch("http://localhost:5000/api/stats/increment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field: "resumesCreated" }),
        });
      } catch (err) {
        console.error("Failed to increment resumesCreated stat:", err);
      }

      setTimeout(() => {
        toast({
          title: "Resume Generated!",
          description: "Your professional resume is ready",
        });
      }, 500);
    } catch (error: any) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Generator</h1>
          <p className="text-muted-foreground">
            Create your professional resume with AI assistance
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate Your Resume
            </CardTitle>
            <CardDescription>
              Describe your experience, skills, and goals. Our AI will create a professional resume
              for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: I'm a software engineer with 3 years of experience in React, Node.js, and MongoDB. I've worked on e-commerce platforms and want to highlight my full-stack development skills..."
              className="min-h-[200px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={generationProgress} className="w-full" />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  {currentStep}
                </p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Preview
            </CardTitle>
            <CardDescription>Your generated resume will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {resumeMarkdown ? (
              <ResumePreview
                resumeMarkdown={resumeMarkdown}
                setResumeMarkdown={setResumeMarkdown}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <p>No resume generated yet</p>
                <p className="text-sm mt-2">
                  Enter your details and click &quot;Generate Resume&quot; to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
