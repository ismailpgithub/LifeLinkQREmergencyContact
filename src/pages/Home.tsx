import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Smartphone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Heart className="h-16 w-16 mx-auto mb-8 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              A smart keychain that speaks for you when you can't
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Emergency responders can instantly access your critical information through our QR-enabled keychains
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/scanner"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                Scan QR Code
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How LifeLink Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to ensure you're always prepared for emergencies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Get Your Keychain</h3>
              <p className="text-gray-600">
                Purchase a LifeLink keychain with a unique QR code. Each keychain is pre-programmed with a secure identifier.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Link Your Information</h3>
              <p className="text-gray-600">
                Scan your QR code and securely add your emergency contacts, medical information, and preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Emergency Ready</h3>
              <p className="text-gray-600">
                In case of emergency, anyone can scan your keychain to access your critical information instantly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LifeLink?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and only accessible through your unique QR code. No personal information is exposed unnecessarily.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instant Access</h3>
              <p className="text-gray-600">
                Emergency responders can access your information in seconds without needing to download apps or create accounts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Works Anywhere</h3>
              <p className="text-gray-600">
                Any smartphone can scan your QR code. No special apps required - just point and scan with any camera app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to protect yourself and your loved ones?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of people who trust LifeLink for their emergency preparedness
          </p>
          <Link
            to="/register"
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
