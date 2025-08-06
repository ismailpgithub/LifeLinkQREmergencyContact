import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, FileText, Link as LinkIcon } from 'lucide-react';
import QRScannerComponent from '../components/QRScanner';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Scanner: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'link' | 'view'>('link');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleScan = (result: string) => {
    setShowScanner(false);
    
    if (scanMode === 'link') {
      // Navigate to emergency info setup with QR code
      navigate(`/emergency-info?qr=${encodeURIComponent(result)}`);
    } else {
      // Navigate to public emergency page
      navigate(`/emergency/${encodeURIComponent(result)}`);
    }
  };

  const openScanner = (mode: 'link' | 'view') => {
    setScanMode(mode);
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <QrCode className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            QR Code Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you want to use your QR scanner
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Scan to Link Your Info</h3>
              <p className="text-gray-600 mb-6">
                Scan your LifeLink keychain QR code to set up or update your emergency contact information
              </p>
              <button
                onClick={() => openScanner('link')}
                disabled={!user}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? 'Start Linking' : 'Login Required'}
              </button>
              {!user && (
                <p className="text-sm text-gray-500 mt-2">
                  You need to be logged in to link emergency information
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Scan to View Info</h3>
              <p className="text-gray-600 mb-6">
                Scan any LifeLink QR code to view the emergency contact information (for testing or emergency situations)
              </p>
              <button
                onClick={() => openScanner('view')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Viewing
              </button>
              <p className="text-sm text-gray-500 mt-2">
                No login required - accessible to everyone
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">How QR Scanning Works</h3>
          <ul className="text-yellow-700 space-y-2">
            <li>• <strong>Linking:</strong> Use this when you have a new LifeLink keychain and want to add your emergency information</li>
            <li>• <strong>Viewing:</strong> Use this in emergency situations or to test how your emergency page looks</li>
            <li>• <strong>Camera Access:</strong> Allow camera permissions for the best scanning experience</li>
            <li>• <strong>Manual Entry:</strong> If camera doesn't work, you can manually type the QR code</li>
          </ul>
        </motion.div>
      </div>

      {showScanner && (
        <QRScannerComponent
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Scanner;
