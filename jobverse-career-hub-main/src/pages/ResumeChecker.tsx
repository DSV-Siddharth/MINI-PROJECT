import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResumeChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  let progressInterval: NodeJS.Timeout;

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const text = new TextDecoder().decode(typedarray);
          const cleanText = text
            .replace(/[^\x20-\x7E\n]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          resolve(cleanText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.includes("pdf") && !file.type.includes("document")) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const resumeText = await extractTextFromPDF(file);

      if (!resumeText || resumeText.length < 50) {
        throw new Error(
          "Could not extract enough text from the resume. Please ensure the PDF is not scanned or image-based."
        );
      }

      setUploadProgress(95);

      // API call to backend
      const response = await fetch("http://localhost:5000/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to analyze resume.");
      }

      const data = await response.json();

      setUploadProgress(100);
      setAnalysis(data);
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been analyzed",
      });

      // NEW: increment "Resume Scores" stat for dashboard
      try {
        await fetch("http://localhost:5000/api/stats/increment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field: "resumeScoresChecked" }),
        });
      } catch (err) {
        console.error("Failed to increment resumeScoresChecked stat:", err);
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
      setFileName(null);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-5xl font-semibold tracking-luxury text-foreground">
          Resume Checker
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Upload your resume and get instant feedback
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-luxury text-foreground">
              Upload Resume
            </CardTitle>
            <CardDescription>Upload your resume in PDF or DOCX format</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center transition-all ${
                isDragging ? "border-accent bg-accent/5 scale-105" : "border-border hover:border-accent"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload
                className={`h-12 w-12 mb-4 transition-colors ${
                  isDragging ? "text-accent" : "text-muted-foreground"
                }`}
              />
              <p className="text-sm text-muted-foreground mb-4">
                {isDragging ? "Drop your resume here" : "Click to upload or drag and drop"}
              </p>

              {fileName && !isAnalyzing && (
                <div className="mb-4 flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  <FileText className="h-4 w-4" />
                  <span>{fileName}</span>
                  <button onClick={clearFile} className="ml-2 hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="w-full max-w-xs mb-4 space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">Analyzing your resume...</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
                disabled={isAnalyzing}
              />
              <label htmlFor="resume-upload">
                <Button
                  asChild
                  disabled={isAnalyzing}
                  className="bg-gradient-accent text-accent-foreground shadow-glow-accent hover:opacity-90 font-semibold"
                >
                  <span className="cursor-pointer">
                    {isAnalyzing ? "Analyzing..." : fileName ? "Upload Different File" : "Select File"}
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-luxury text-foreground">
              Analysis Results
            </CardTitle>
            <CardDescription>Your resume analysis will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-accent shadow-glow-accent mb-4 animate-in zoom-in-50 duration-500">
                    <span className="text-3xl font-bold text-accent-foreground">
                      {analysis.score}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
                <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 animate-in slide-in-from-left-2 duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Badge
                          variant="outline"
                          className="mt-0.5 bg-success/10 text-success border-success/20"
                        >
                          ✓
                        </Badge>
                        <span className="text-sm text-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 animate-in slide-in-from-left-2 duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Badge
                          variant="outline"
                          className="mt-0.5 bg-warning/10 text-warning border-warning/20"
                        >
                          !
                        </Badge>
                        <span className="text-sm text-foreground">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Upload a resume to see the analysis
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
