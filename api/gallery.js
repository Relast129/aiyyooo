// Vercel Serverless Function for Gallery Management
import { kv } from '@vercel/kv';

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
      const images = await kv.get('gallery_images') || [];
      return res.status(200).json({ success: true, data: images });
    }

    if (req.method === 'POST') {
      // Add new image
      const { data, caption, date } = req.body;
      
      if (!data || !caption) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const images = await kv.get('gallery_images') || [];
      const newImage = {
        id: Date.now().toString(),
        data,
        caption,
        date: date || new Date().toISOString()
      };
      
      images.push(newImage);
      await kv.set('gallery_images', images);
      
      return res.status(200).json({ success: true, data: newImage });
    }

    if (req.method === 'DELETE') {
      // Delete image by ID
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing image ID' });
      }

      const images = await kv.get('gallery_images') || [];
      const filteredImages = images.filter(img => img.id !== id);
      await kv.set('gallery_images', filteredImages);
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Gallery API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
