// Vercel Serverless Function for Reviews Management
// Uses Vercel Blob Store for persistent storage
import { put, list } from '@vercel/blob';

const REVIEWS_BLOB_PATH = 'reviews-data.json';

// Helper to get reviews from Blob Store
async function getReviews() {
  try {
    // List all blobs and find the reviews file
    const { blobs } = await list();
    const reviewsBlob = blobs.find(blob => blob.pathname === REVIEWS_BLOB_PATH);
    
    if (reviewsBlob) {
      // Fetch the reviews file
      const response = await fetch(reviewsBlob.url);
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews loaded from Blob Store:', data.length, 'reviews');
        return data;
      }
    }
    
    // If file doesn't exist yet, return empty array
    console.log('No reviews found in Blob Store, returning empty array');
    return [];
  } catch (error) {
    console.error('Error fetching reviews from Blob:', error.message);
    return [];
  }
}

async function saveReviews(data) {
  try {
    // Save reviews as JSON to Blob Store
    const blob = await put(REVIEWS_BLOB_PATH, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false // Keep consistent filename
    });
    
    console.log('Reviews saved to Blob Store:', blob.url);
    return true;
  } catch (error) {
    console.error('Error saving reviews to Blob:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all reviews or only approved ones
      const { approved } = req.query;
      const reviews = await getReviews();
      
      if (approved === 'true') {
        const approvedReviews = reviews.filter(r => r.status === 'approved');
        return res.status(200).json({ success: true, data: approvedReviews });
      }
      
      return res.status(200).json({ success: true, data: reviews });
    }

    if (req.method === 'POST') {
      // Add new review
      const { name, email, country, rating, text, source } = req.body;
      
      if (!name || !country || !rating || !text) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const reviews = await getReviews();
      const newReview = {
        id: Date.now().toString(),
        name,
        email: email || '',
        country,
        rating: parseInt(rating),
        text,
        date: new Date().toISOString(),
        status: source === 'admin' ? 'approved' : 'pending',
        source: source || 'user'
      };
      
      reviews.unshift(newReview);
      await saveReviews(reviews);
      
      return res.status(200).json({ success: true, data: newReview });
    }

    if (req.method === 'PUT') {
      // Update review (approve/reject)
      const { id, status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const reviews = await getReviews();
      const updatedReviews = reviews.map(review => 
        review.id === id ? { ...review, status } : review
      );
      await saveReviews(updatedReviews);
      
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      // Delete review by ID
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing review ID' });
      }

      const reviews = await getReviews();
      const filteredReviews = reviews.filter(review => review.id !== id);
      await saveReviews(filteredReviews);
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Reviews API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
