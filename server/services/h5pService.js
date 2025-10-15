const path = require('path');
const fs = require('fs');

class H5PService {
  constructor() {
    this.initialized = false;
    this.content = new Map(); // Simple in-memory storage for now
    this.nextId = 1;
  }

  async initialize() {
    try {
      // Create H5P directories if they don't exist
      const h5pDir = path.join(__dirname, '..', 'h5p');
      const librariesDir = path.join(h5pDir, 'libraries');
      const contentDir = path.join(h5pDir, 'content');
      const tempDir = path.join(h5pDir, 'temp');
      const userDataDir = path.join(h5pDir, 'userData');

      [h5pDir, librariesDir, contentDir, tempDir, userDataDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      this.initialized = true;
      console.log('✅ H5P Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Error initializing H5P service:', error);
      return false;
    }
  }

  async createContent(contentData) {
    if (!this.initialized) {
      throw new Error('H5P service not initialized');
    }

    try {
      const content = {
        id: this.nextId++,
        title: contentData.params?.title || 'Untitled Content',
        description: contentData.params?.description || '',
        library: contentData.library,
        params: contentData.params,
        metadata: contentData.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.content.set(content.id, content);
      
      return {
        success: true,
        contentId: content.id,
        content: content
      };
    } catch (error) {
      console.error('Error creating H5P content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getContent(contentId) {
    if (!this.initialized) {
      throw new Error('H5P service not initialized');
    }

    try {
      const content = this.content.get(parseInt(contentId));
      
      if (!content) {
        return {
          success: false,
          error: 'Content not found'
        };
      }

      return {
        success: true,
        content: content
      };
    } catch (error) {
      console.error('Error getting H5P content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteContent(contentId) {
    if (!this.initialized) {
      throw new Error('H5P service not initialized');
    }

    try {
      const deleted = this.content.delete(parseInt(contentId));
      
      if (!deleted) {
        return {
          success: false,
          error: 'Content not found'
        };
      }

      return {
        success: true,
        message: 'Content deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting H5P content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listContent() {
    if (!this.initialized) {
      throw new Error('H5P service not initialized');
    }

    try {
      const contents = Array.from(this.content.values());
      return {
        success: true,
        contents: contents
      };
    } catch (error) {
      console.error('Error listing H5P content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getLibraries() {
    if (!this.initialized) {
      throw new Error('H5P service not initialized');
    }

    try {
      // Return available H5P content types
      const libraries = [
        {
          id: 'H5P.InteractiveVideo',
          name: 'Interactive Video',
          description: 'Create videos with embedded questions and interactions',
          version: '1.0.0'
        },
        {
          id: 'H5P.DragQuestion',
          name: 'Drag & Drop',
          description: 'Create drag and drop exercises',
          version: '1.0.0'
        },
        {
          id: 'H5P.QuestionSet',
          name: 'Question Set',
          description: 'Create multiple choice and other question types',
          version: '1.0.0'
        },
        {
          id: 'H5P.Presentation',
          name: 'Presentation',
          description: 'Create interactive presentations',
          version: '1.0.0'
        },
        {
          id: 'H5P.ImageHotspots',
          name: 'Image Hotspots',
          description: 'Create interactive images with clickable areas',
          version: '1.0.0'
        }
      ];

      return {
        success: true,
        libraries: libraries
      };
    } catch (error) {
      console.error('Error getting H5P libraries:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async installLibrary(libraryId) {
    if (!this.initialized) {
      throw new Error('H5P service not initialized');
    }

    try {
      // For now, just return success since we're using predefined libraries
      const library = {
        id: libraryId,
        name: libraryId.split('.').pop(),
        version: '1.0.0',
        installed: true
      };

      return {
        success: true,
        library: library
      };
    } catch (error) {
      console.error('Error installing H5P library:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const h5pService = new H5PService();

module.exports = h5pService;