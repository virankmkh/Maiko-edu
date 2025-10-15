import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Users, Settings, Share } from 'lucide-react';

const JitsiComponent = ({ jitsiData }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);

  const joinSession = () => {
    setIsJoined(true);
    setParticipantCount(Math.floor(Math.random() * 15) + 5); // Simulate random participant count
  };

  const leaveSession = () => {
    setIsJoined(false);
    setParticipantCount(0);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const shareLink = () => {
    const link = `${window.location.origin}/jitsi/${jitsiData.roomName}`;
    navigator.clipboard.writeText(link);
    alert('Session link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Video className="w-5 h-5 text-purple-600" />
          <h4 className="text-lg font-semibold text-purple-900">Live Session</h4>
        </div>
        <h5 className="text-purple-800 font-medium">{jitsiData.subject}</h5>
        <p className="text-purple-700 text-sm mt-1">{jitsiData.description}</p>
      </div>

      {!isJoined ? (
        /* Join Session */
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Live Session</h3>
          <p className="text-gray-600 mb-6">
            Connect with your instructor and fellow students for real-time discussion and Q&A.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Up to 50 participants</span>
              </div>
              <div className="flex items-center space-x-1">
                <Video className="w-4 h-4" />
                <span>Video & Audio</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={joinSession}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Video className="w-5 h-5 mr-2" />
                Join Session
              </button>
              <button
                onClick={shareLink}
                className="flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Session Interface */
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {/* Video Area */}
          <div className="relative bg-gray-800 h-64 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Live Session Active</p>
              <p className="text-sm text-gray-400">
                {participantCount} participants online
              </p>
            </div>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full ${
                  isMicOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button className="p-3 bg-gray-700 text-white rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Session Controls */}
          <div className="bg-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{participantCount} online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Connected</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={shareLink}
                  className="flex items-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </button>
                <button
                  onClick={leaveSession}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Schedule */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-900 mb-2">📅 Session Schedule</h5>
        <div className="text-sm text-yellow-800 space-y-1">
          <p><strong>Next Session:</strong> Tomorrow at 2:00 PM</p>
          <p><strong>Duration:</strong> 1 hour</p>
          <p><strong>Topic:</strong> HTML5 Fundamentals & CSS3 Styling</p>
        </div>
      </div>
    </div>
  );
};

export default JitsiComponent;

