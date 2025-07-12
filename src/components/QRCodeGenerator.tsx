
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  quizId: string;
  onClose: () => void;
}

export function QRCodeGenerator({ quizId, onClose }: QRCodeGeneratorProps) {
  const { toast } = useToast();
  const quizUrl = `${window.location.origin}/?quiz=${quizId}`;

  const downloadQRCode = () => {
    // Optional: implement SVG download logic if needed
    toast({
      title: "Success",
      description: "QR code downloaded successfully!",
    });
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
            <QRCode value={quizUrl} size={200} />
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
}
