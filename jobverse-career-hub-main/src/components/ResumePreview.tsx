import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResumePreviewProps {
  resumeData: { result: string } | null;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  if (!resumeData || !resumeData.result) {
    return <div className="text-muted-foreground text-center p-8">No resume generated yet.</div>;
  }

  const handleDownload = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Your Resume</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            pre { font-size: 16px; line-height: 1.6; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${resumeData.result}</pre>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleDownload}
          className="bg-gradient-accent text-accent-foreground shadow-glow-accent hover:opacity-90"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div 
        id="resume-content"
        className="bg-background border border-border rounded-lg p-8 space-y-6"
      >
        <pre>{resumeData.result}</pre>
      </div>
    </div>
  );
}
