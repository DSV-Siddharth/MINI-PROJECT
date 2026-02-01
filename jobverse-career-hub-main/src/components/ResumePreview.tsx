import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ResumePreviewProps {
  resumeMarkdown: string;
  setResumeMarkdown: (value: string) => void;
}

// Simple markdown to HTML converter
const parseMarkdown = (markdown: string): string => {
  let html = markdown;

  // Horizontal rule (--- or ***)
  html = html.replace(/^---$/gim, '<hr class="my-6 border-t-2 border-gray-300"/>');
  html = html.replace(/^\*\*\*$/gim, '<hr class="my-6 border-t-2 border-gray-300"/>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>');

  // Line breaks
  html = html.replace(/\n\n/g, "<br/><br/>");
  html = html.replace(/\n/g, "<br/>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 underline">$1</a>',
  );

  return html;
};

export default function ResumePreview({
  resumeMarkdown,
  setResumeMarkdown,
}: ResumePreviewProps) {
  const htmlContent = useMemo(() => parseMarkdown(resumeMarkdown), [resumeMarkdown]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("resume-content");
      if (!element) return;

      // Convert the whole resume area to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Extra pages if content is taller than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!resumeMarkdown.trim()) {
    return <div className="text-muted-foreground text-center p-8">No resume generated yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Mode:</span>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className={
              !editMode
                ? "font-semibold underline text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Preview
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className={
              editMode
                ? "font-semibold underline text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Edit
          </button>
        </div>

        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-gradient-accent text-accent-foreground shadow-glow-accent hover:opacity-90"
        >
          {isDownloading ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-pulse" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <div
        id="resume-content"
        className="bg-white border border-border rounded-lg p-8 shadow-sm"
      >
        {editMode ? (
          <textarea
            className="w-full min-h-[600px] outline-none resize-vertical text-sm font-normal"
            value={resumeMarkdown}
            onChange={(e) => setResumeMarkdown(e.target.value)}
          />
        ) : (
          <div
            className="prose prose-sm max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
}
