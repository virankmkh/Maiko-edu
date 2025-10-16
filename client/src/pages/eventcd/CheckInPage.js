import React, { useState } from 'react';
import { QrCodeScanner, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CheckInPage = () => {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);

  const handleQRCodeScan = (code) => {
    setQrCode(code);
    // Here you would typically send the QR code to your backend
    // For now, we'll simulate a check-in
    setTimeout(() => {
      setCheckInResult({
        success: true,
        attendee: 'John Doe',
        event: 'Tech Conference 2024'
      });
    }, 1000);
  };

  const handleManualCheckIn = () => {
    if (!qrCode.trim()) return;
    
    // Simulate manual check-in
    setCheckInResult({
      success: true,
      attendee: 'Manual Entry',
      event: 'Event Check-in'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <QrCodeScanner className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Event Check-in
          </h1>
          <p className="text-gray-600">
            Scan QR code or enter manually to check in attendees
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {!checkInResult ? (
            <div className="space-y-6">
              {/* QR Code Scanner Placeholder */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <QrCodeScanner className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">QR Code Scanner</p>
                <button
                  onClick={() => setIsScanning(!isScanning)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </button>
              </div>

              {/* Manual Entry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter QR code manually
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="Enter QR code..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleManualCheckIn}
                    disabled={!qrCode.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {checkInResult.success ? (
                <div>
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Check-in Successful!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {checkInResult.attendee} has been checked in for {checkInResult.event}
                  </p>
                  <button
                    onClick={() => {
                      setCheckInResult(null);
                      setQrCode('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Check In Another
                  </button>
                </div>
              ) : (
                <div>
                  <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Check-in Failed
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Invalid QR code or attendee not found
                  </p>
                  <button
                    onClick={() => {
                      setCheckInResult(null);
                      setQrCode('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
