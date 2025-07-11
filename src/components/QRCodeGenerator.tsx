
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  quizId: string;
  onClose: () => void;
}

export const QRCodeGenerator = ({ quizId, onClose }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Simple QR code generation (in a real app, you'd use a proper QR code library)
  const generateQRCode = (text: string, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Create a simple pattern (this is a placeholder - real QR codes are more complex)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    
    // Create a grid pattern as a simple QR code representation
    const cellSize = size / 20;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        // Create a pattern based on the text hash
        const hash = Array.from(text).reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        
        if ((i + j + Math.abs(hash)) % 3 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }

    // Add positioning squares (corner markers)
    const markerSize = cellSize * 3;
    
    // Top-left
    ctx.fillRect(0, 0, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
    
    // Top-right
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - markerSize + cellSize, cellSize, cellSize, cellSize);
    
    // Bottom-left
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size - markerSize, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cellSize, size - markerSize + cellSize, cellSize, cellSize);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const quizUrl = `${window.location.origin}/?quiz=${quizId}`;
      generateQRCode(quizUrl, canvasRef.current);
    }
  }, [quizId]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `quiz-${quizId}-qr-code.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      toast({
        title: "Success",
        description: "QR code downloaded successfully!",
      });
    }
  };

  const shareQuizUrl = () => {
    const quizUrl = `${window.location.origin}/?quiz=${quizId}`;
    navigator.clipboard.writeText(quizUrl).then(() => {
      toast({
        title: "Copied!",
        description: "Quiz URL copied to clipboard",
      });
    });
  };

  const quizUrl = `${window.location.origin}/?quiz=${quizId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quiz QR Code</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <canvas 
              ref={canvasRef}
              className="border border-gray-200 rounded-lg mx-auto"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Quiz URL:</p>
            <div className="bg-gray-100 p-2 rounded text-xs break-all">
              {quizUrl}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadQRCode} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={shareQuizUrl} className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Copy URL
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Scan this QR code or use the URL to access the quiz
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
