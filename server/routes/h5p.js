const express = require('express');
const router = express.Router();
const h5pService = require('../services/h5pService');
const path = require('path');

// Initialize H5P service
let h5pInitialized = false;

const initializeH5P = async () => {
  if (!h5pInitialized) {
    h5pInitialized = await h5pService.initialize();
  }
  return h5pInitialized;
};

// Get H5P configuration
router.get('/config', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    res.json({
      success: true,
      config: {
        baseUrl: process.env.CLIENT_URL || 'http://localhost:3000',
        contentUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/h5p/content`,
        librariesUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/h5p/libraries`,
        editorUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/h5p/editor`
      }
    });
  } catch (error) {
    console.error('Error getting H5P config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get H5P configuration',
      error: error.message
    });
  }
});

// Create new H5P content
router.post('/content', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    const { params, metadata, library } = req.body;
    
    if (!params || !metadata || !library) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: params, metadata, library'
      });
    }

    const result = await h5pService.createContent({
      params,
      metadata,
      library
    });

    if (result.success) {
      res.json({
        success: true,
        contentId: result.contentId,
        content: result.content,
        message: 'H5P content created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to create H5P content',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error creating H5P content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create H5P content',
      error: error.message
    });
  }
});

// Get H5P content by ID
router.get('/content/:id', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    const { id } = req.params;
    const result = await h5pService.getContent(parseInt(id));

    if (result.success) {
      res.json({
        success: true,
        content: result.content
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'H5P content not found',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error getting H5P content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get H5P content',
      error: error.message
    });
  }
});

// List all H5P content
router.get('/content', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    const result = await h5pService.listContent();

    if (result.success) {
      res.json({
        success: true,
        contents: result.contents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to list H5P content',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error listing H5P content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list H5P content',
      error: error.message
    });
  }
});

// Delete H5P content
router.delete('/content/:id', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    const { id } = req.params;
    const result = await h5pService.deleteContent(parseInt(id));

    if (result.success) {
      res.json({
        success: true,
        message: 'H5P content deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete H5P content',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error deleting H5P content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete H5P content',
      error: error.message
    });
  }
});

// Get available H5P libraries
router.get('/libraries', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    const result = await h5pService.getLibraries();

    if (result.success) {
      res.json({
        success: true,
        libraries: result.libraries
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get H5P libraries',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error getting H5P libraries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get H5P libraries',
      error: error.message
    });
  }
});

// Install H5P library
router.post('/libraries/install', async (req, res) => {
  try {
    const initialized = await initializeH5P();
    
    if (!initialized) {
      return res.status(500).json({
        success: false,
        message: 'H5P service not available'
      });
    }

    const { libraryId } = req.body;
    
    if (!libraryId) {
      return res.status(400).json({
        success: false,
        message: 'Library ID is required'
      });
    }

    const result = await h5pService.installLibrary(libraryId);

    if (result.success) {
      res.json({
        success: true,
        library: result.library,
        message: 'H5P library installed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to install H5P library',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error installing H5P library:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to install H5P library',
      error: error.message
    });
  }
});

// Serve H5P static files
router.use('/content', express.static(path.join(__dirname, '..', 'h5p', 'content')));
router.use('/libraries', express.static(path.join(__dirname, '..', 'h5p', 'libraries')));

module.exports = router;
