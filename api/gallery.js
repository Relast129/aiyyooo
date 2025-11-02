// Vercel Serverless Function for Gallery Management
// Uses Vercel Blob Store for both images and metadata
import { put, del, list } from '@vercel/blob';

const GALLERY_METADATA_PATH = 'gallery-metadata.json';

// Helper to get gallery metadata from Blob Store
async function getGalleryMetadata() {
  try {
    // List all blobs and find the metadata file
    const { blobs } = await list();
    const metadataBlob = blobs.find(blob => blob.pathname === GALLERY_METADATA_PATH);
    
    if (metadataBlob) {
      // Fetch the metadata file
      const response = await fetch(metadataBlob.url);
      if (response.ok) {
        const data = await response.json();
        console.log('Gallery metadata loaded from Blob Store:', data.length, 'images');
        return data;
      }
    }
    
    // If file doesn't exist yet, return empty array
    console.log('No gallery metadata found in Blob Store, returning empty array');
    return [];
  } catch (error) {
    console.error('Error fetching gallery metadata from Blob:', error.message);
    return [];
  }
}

async function saveGalleryMetadata(data) {
  try {
    // Save metadata as JSON to Blob Store
    const blob = await put(GALLERY_METADATA_PATH, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false // Keep consistent filename
    });
    
    console.log('Gallery metadata saved to Blob Store:', blob.url);
    return true;
  } catch (error) {
    console.error('Error saving gallery metadata to Blob:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all gallery images
      const images = await getGalleryMetadata();
      return res.status(200).json({ success: true, data: images });
    }

    if (req.method === 'POST') {
      // Add new image
      const { data, caption, date } = req.body;
      
      if (!data || !caption) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      // Upload image to Blob Store
      let imageUrl = data;
      let blobUrl = null;
      
      try {
        // Convert base64 to buffer and upload
        const base64Data = data.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `gallery-${Date.now()}.jpg`;
        
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: 'image/jpeg'
        });
        
        blobUrl = blob.url;
        imageUrl = blob.url;
        console.log('Image uploaded to Blob Store:', blob.url);
      } catch (blobError) {
        console.error('Blob upload failed:', blobError.message);
        return res.status(500).json({ success: false, error: 'Failed to upload image to Blob Store' });
      }

      // Get current metadata and add new image
      const images = await getGalleryMetadata();
      const newImage = {
        id: Date.now().toString(),
        data: imageUrl,
        blobUrl: blobUrl,
        caption,
        date: date || new Date().toISOString()
      };
      
      images.push(newImage);
      await saveGalleryMetadata(images);
      
      return res.status(200).json({ success: true, data: newImage });
    }

    if (req.method === 'DELETE') {
      // Delete image by ID
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing image ID' });
      }

      const images = await getGalleryMetadata();
      const imageToDelete = images.find(img => img.id === id);
      
      // Delete from Blob Store
      if (imageToDelete && imageToDelete.blobUrl) {
        try {
          await del(imageToDelete.blobUrl);
          console.log('Image deleted from Blob Store:', imageToDelete.blobUrl);
        } catch (blobError) {
          console.error('Blob deletion failed:', blobError.message);
        }
      }
      
      const filteredImages = images.filter(img => img.id !== id);
      await saveGalleryMetadata(filteredImages);
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Gallery API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
