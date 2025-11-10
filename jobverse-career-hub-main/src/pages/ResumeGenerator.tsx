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
  const [resumeData, setResumeData] = useState(null);
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
        { progress: 95, message: "Final touches..." }
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
      setGenerationProgress(100);
      setCurrentStep("Complete!");
      setResumeData(data);

      setTimeout(() => {
        toast({
          title: "Resume Generated!",
          description: "Your professional resume is ready",
        });
      }, 500);
    } catch (error) {
      console.error('Error generating resume:', error);
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
      {/* ...Rest of your unchanged JSX code... */}
      {/* Only change is in handleGenerate */}
      {/* Paste your UI code here, same as before */}
    </div>
  );
}
