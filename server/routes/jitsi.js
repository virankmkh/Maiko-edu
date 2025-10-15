const express = require('express');
const router = express.Router();

// Jitsi Meet room management routes

// Create a new Jitsi room
router.post('/rooms', async (req, res) => {
  try {
    const { roomName, title, description, maxParticipants, settings } = req.body;
    
    // Generate unique room name if not provided
    const finalRoomName = roomName || `maiko-room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Room configuration
    const roomConfig = {
      roomName: finalRoomName,
      title: title || 'Maiko EDU Group Call',
      description: description || '',
      maxParticipants: maxParticipants || 10,
      settings: {
        allowScreenShare: settings?.allowScreenShare || true,
        allowRecording: settings?.allowRecording || false,
        muteOnJoin: settings?.muteOnJoin || true,
        requireApproval: settings?.requireApproval || false
      },
      createdAt: new Date(),
      createdBy: req.user?.id || 'anonymous'
    };

    // In a real implementation, you would save this to your database
    // For now, we'll just return the room configuration
    
    res.json({
      success: true,
      room: roomConfig,
      jitsiUrl: `https://meet.jit.si/${finalRoomName}`,
      message: 'Room created successfully'
    });
  } catch (error) {
    console.error('Error creating Jitsi room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
});

// Get room information
router.get('/rooms/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;
    
    // In a real implementation, you would fetch this from your database
    const roomInfo = {
      roomName,
      jitsiUrl: `https://meet.jit.si/${roomName}`,
      status: 'active', // or 'inactive', 'ended'
      participantCount: 0, // You would track this in real-time
      createdAt: new Date(),
      settings: {
        allowScreenShare: true,
        allowRecording: false,
        muteOnJoin: true
      }
    };

    res.json({
      success: true,
      room: roomInfo
    });
  } catch (error) {
    console.error('Error fetching room info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room information',
      error: error.message
    });
  }
});

// End/delete a room
router.delete('/rooms/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;
    
    // In a real implementation, you would:
    // 1. Update room status to 'ended' in database
    // 2. Notify all participants to leave
    // 3. Clean up any recordings or data
    
    res.json({
      success: true,
      message: 'Room ended successfully',
      roomName
    });
  } catch (error) {
    console.error('Error ending room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end room',
      error: error.message
    });
  }
});

// Get Jitsi configuration for frontend
router.get('/config', (req, res) => {
  try {
    const config = {
      domain: 'meet.jit.si',
      options: {
        width: '100%',
        height: '100%',
        parentNode: null,
        roomName: '',
        userInfo: {
          displayName: req.user?.name || 'Anonymous User',
          email: req.user?.email || ''
        },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
          SHOW_POLICY_WATERMARK: false,
          SHOW_LOBBY_BUTTON: true,
          SHOW_MEETING_TIMER: true,
          SHOW_CLOSE_PAGE: true,
          SHOW_BRAND_WATERMARK: false,
          SHOW_WATERMARK: false
        }
      }
    };

    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error fetching Jitsi config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration',
      error: error.message
    });
  }
});

// Webhook endpoint for Jitsi events (if using self-hosted)
router.post('/webhook', (req, res) => {
  try {
    const { event, roomName, participantId, data } = req.body;
    
    console.log('Jitsi webhook event:', { event, roomName, participantId, data });
    
    // Handle different Jitsi events
    switch (event) {
      case 'participantJoined':
        console.log(`Participant ${participantId} joined room ${roomName}`);
        break;
      case 'participantLeft':
        console.log(`Participant ${participantId} left room ${roomName}`);
        break;
      case 'recordingStarted':
        console.log(`Recording started for room ${roomName}`);
        break;
      case 'recordingStopped':
        console.log(`Recording stopped for room ${roomName}`);
        break;
      default:
        console.log(`Unknown event: ${event}`);
    }
    
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message
    });
  }
});

module.exports = router;
