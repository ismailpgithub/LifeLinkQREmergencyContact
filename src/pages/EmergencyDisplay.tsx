import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Heart, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { storage } from '../utils/storage';
import { EmergencyInfo } from '../types';
import { motion } from 'framer-motion';

const EmergencyDisplay: React.FC = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (qrCode) {
      const decodedQR = decodeURIComponent(qrCode);
      const info = storage.getEmergencyInfoByQR(decodedQR);
      
      if (info) {
        // Record scan
        storage.incrementScanCount(decodedQR);
        // Update last scanned time
        info.lastScanned = new Date().toISOString();
        storage.saveEmergencyInfo(info);
      }
      
      setEmergencyInfo(info);
      setIsLoading(false);
    }
  }, [qrCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading emergency information...</p>
        </div>
      </div>
    );
  }

  if (!emergencyInfo) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <AlertTriangle className="h-16 w-16 text-yellow-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            QR Code Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This QR code ({qrCode}) is not linked to any emergency information yet.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              If this is your LifeLink keychain, please visit our website to set up your emergency information.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const formatPhoneNumber = (phone: string) => {
    // Simple phone number formatting for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span className="font-semibold">EMERGENCY INFORMATION</span>
          </div>
          <p className="text-red-100 text-sm">
            This person needs help. Please contact their emergency contact below.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Person Info */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">{emergencyInfo.name}</h1>
                <p className="text-red-100">LifeLink Emergency Contact</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-red-600" />
              Primary Emergency Contact
            </h2>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {emergencyInfo.emergencyContactName}
                </p>
                <a
                  href={`tel:${emergencyInfo.emergencyContact}`}
                  className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="h-5 w-5 inline mr-2" />
                  {formatPhoneNumber(emergencyInfo.emergencyContact)}
                </a>
                <p className="text-sm text-gray-600 mt-2">Tap to call</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Medical Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {emergencyInfo.bloodGroup && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-1">Blood Group</h3>
                  <p className="text-xl font-bold text-red-600">{emergencyInfo.bloodGroup}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-1">QR Code</h3>
                <p className="font-mono text-sm text-gray-600">{emergencyInfo.qrCode}</p>
              </div>
            </div>

            {emergencyInfo.allergies && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Allergies
                </h3>
                <p className="text-yellow-700">{emergencyInfo.allergies}</p>
              </div>
            )}

            {emergencyInfo.medicalConditions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Medical Conditions</h3>
                <p className="text-blue-700">{emergencyInfo.medicalConditions}</p>
              </div>
            )}

            {emergencyInfo.customMessage && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Additional Information</h3>
                <p className="text-gray-600">{emergencyInfo.customMessage}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Scanned: {new Date().toLocaleString()}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Powered by LifeLink
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-3">Emergency Response Instructions</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>1. <strong>Call the emergency contact</strong> listed above immediately</li>
            <li>2. <strong>Check for medical allergies</strong> before administering any medication</li>
            <li>3. <strong>Share medical conditions</strong> with emergency responders</li>
            <li>4. <strong>Call emergency services</strong> (911) if the situation is life-threatening</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyDisplay;
