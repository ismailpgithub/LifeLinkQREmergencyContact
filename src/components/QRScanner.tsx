import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const QRScannerComponent: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
        },
        {
          onDecodeError: () => {
            // Ignore decode errors
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScanner.start().catch((err) => {
        console.error('Failed to start camera:', err);
        setHasCamera(false);
      });

      setScanner(qrScanner);

      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, [onScan]);

  if (!hasCamera) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Camera Access Required</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Please allow camera access to scan QR codes, or manually enter a QR code below:
            </p>
            <input
              type="text"
              placeholder="Enter QR code (e.g., LL-ABC12345)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    onScan(value);
                  }
                }
              }}
            />
            <p className="text-xs text-gray-500">Press Enter to submit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden m-4 max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute inset-0 border-2 border-red-500 opacity-50 pointer-events-none" 
               style={{ margin: '20%' }} />
        </div>
        <div className="p-4 text-center">
          <p className="text-sm text-gray-600">
            Point your camera at a QR code to scan it
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScannerComponent;
