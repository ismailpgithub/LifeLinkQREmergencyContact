import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Plus, QrCode, Edit, Eye, Calendar, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { EmergencyInfo } from '../types';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [userEmergencyInfo, setUserEmergencyInfo] = useState<EmergencyInfo[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      const allEmergencyInfo = storage.getEmergencyInfo();
      const userInfo = allEmergencyInfo.filter(info => 
        user.qrCodes.includes(info.qrCode)
      );
      setUserEmergencyInfo(userInfo);
    }

    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
    }
  }, [user, location.state]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <p className="text-green-700">{successMessage}</p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Manage your LifeLink emergency information
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <Link
            to="/scanner"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <QrCode className="h-8 w-8 text-red-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
                <p className="text-gray-600">Link a new keychain or view emergency info</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Get More Keychains</h3>
                <p className="text-gray-600">Order additional LifeLink keychains</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Emergency Information</h2>
          
          {userEmergencyInfo.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Linked</h3>
              <p className="text-gray-600 mb-6">
                Scan your LifeLink keychain QR code to set up emergency information
              </p>
              <Link
                to="/scanner"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Scan Your First QR Code
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {userEmergencyInfo.map((info) => (
                <div key={info.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <Heart className="h-5 w-5 text-red-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{info.name}</h3>
                        <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <QrCode className="h-4 w-4 mr-2" />
                          <span className="font-mono">{info.qrCode}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{info.emergencyContactName}: {info.emergencyContact}</span>
                        </div>
                        {info.bloodGroup && (
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            <span>Blood Group: {info.bloodGroup}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Created: {new Date(info.createdAt).toLocaleDateString()}</span>
                        </div>
                        {info.lastScanned && (
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Last scanned: {new Date(info.lastScanned).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/emergency-info?qr=${encodeURIComponent(info.qrCode)}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <Link
                        to={`/emergency/${encodeURIComponent(info.qrCode)}`}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">LifeLink Tips</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Keep your emergency contact information up to date</li>
            <li>• Test your QR code periodically by scanning it yourself</li>
            <li>• Consider getting multiple keychains for different bags or vehicles</li>
            <li>• Make sure your emergency contacts know they are listed as your emergency contact</li>
            <li>• Include any critical medical information that first responders should know</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
