import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { EmergencyInfo } from '../types';
import { motion } from 'framer-motion';

const EmergencyInfoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get('qr');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    emergencyContact: '',
    emergencyContactName: '',
    bloodGroup: '',
    allergies: '',
    medicalConditions: '',
    customMessage: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingInfo, setExistingInfo] = useState<EmergencyInfo | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!qrCode) {
      navigate('/scanner');
      return;
    }

    // Check if QR code already has emergency info
    const existing = storage.getEmergencyInfoByQR(qrCode);
    if (existing) {
      setExistingInfo(existing);
      setFormData({
        name: existing.name,
        emergencyContact: existing.emergencyContact,
        emergencyContactName: existing.emergencyContactName,
        bloodGroup: existing.bloodGroup,
        allergies: existing.allergies,
        medicalConditions: existing.medicalConditions,
        customMessage: existing.customMessage,
      });
    } else {
      // Pre-fill with user's name
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user, qrCode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !qrCode) return;

    setIsLoading(true);
    setError('');

    try {
      const emergencyInfo: EmergencyInfo = {
        id: existingInfo?.id || Date.now().toString(),
        qrCode,
        name: formData.name,
        emergencyContact: formData.emergencyContact,
        emergencyContactName: formData.emergencyContactName,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
        medicalConditions: formData.medicalConditions,
        customMessage: formData.customMessage,
        isActive: true,
        createdAt: existingInfo?.createdAt || new Date().toISOString(),
      };

      storage.saveEmergencyInfo(emergencyInfo);

      // Update QR code status
      const qrCodeData = storage.findQRCode(qrCode);
      if (qrCodeData) {
        qrCodeData.status = 'linked';
        qrCodeData.linkedUserId = user.id;
        qrCodeData.emergencyInfoId = emergencyInfo.id;
        storage.saveQRCode(qrCodeData);
      }

      // Update user's QR codes list
      if (!user.qrCodes.includes(qrCode)) {
        user.qrCodes.push(qrCode);
        storage.saveUser(user);
      }

      navigate('/dashboard', { 
        state: { message: 'Emergency information saved successfully!' }
      });
    } catch (err) {
      setError('Failed to save emergency information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !qrCode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {existingInfo ? 'Update' : 'Setup'} Emergency Information
          </h1>
          <p className="text-gray-600">
            QR Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{qrCode}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white shadow rounded-lg"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder="e.g., John Doe (Brother)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  required
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={3}
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., Penicillin, Peanuts, Shellfish"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">
                Medical Conditions
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                rows={3}
                value={formData.medicalConditions}
                onChange={handleChange}
                placeholder="e.g., Diabetes, Asthma, Heart condition"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700">
                Custom Message for Emergency Responders
              </label>
              <textarea
                id="customMessage"
                name="customMessage"
                rows={3}
                value={formData.customMessage}
                onChange={handleChange}
                placeholder="Any additional information you want emergency responders to know"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? 'Saving...' : 'Save Emergency Info'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyInfoPage;
