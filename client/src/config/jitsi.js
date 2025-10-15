// Jitsi Meet Configuration
export const jitsiConfig = {
  // Use public Jitsi Meet service initially
  domain: 'meet.jit.si',
  
  // Basic configuration
  options: {
    width: '100%',
    height: '100%',
    parentNode: null,
    roomName: '',
    userInfo: {
      displayName: '',
      email: ''
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

// Room management functions
export const createRoom = (roomName) => {
  return {
    ...jitsiConfig,
    options: {
      ...jitsiConfig.options,
      roomName: roomName || `maiko-room-${Date.now()}`
    }
  };
};

// User info setup
export const setUserInfo = (displayName, email) => {
  return {
    displayName: displayName || 'Anonymous User',
    email: email || ''
  };
};

export default jitsiConfig;
