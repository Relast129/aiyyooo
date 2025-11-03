// Vercel Serverless Function for Packages Management
// Uses Vercel Blob Store for persistent storage
import { put, list, del } from '@vercel/blob';

const PACKAGES_BLOB_PATH = 'packages-data.json';

// Helper to get packages from Blob Store
async function getPackages() {
  try {
    // List all blobs and find the packages file
    const { blobs } = await list();
    const packagesBlob = blobs.find(blob => blob.pathname === PACKAGES_BLOB_PATH);
    
    if (packagesBlob) {
      // Fetch the packages file
      const response = await fetch(packagesBlob.url);
      if (response.ok) {
        const data = await response.json();
        console.log('Packages loaded from Blob Store:', data.length, 'packages');
        return data;
      }
    }
    
    // If file doesn't exist yet, return default packages
    console.log('No packages found in Blob Store, returning default packages');
    return getDefaultPackages();
  } catch (error) {
    console.error('Error fetching packages from Blob:', error.message);
    return getDefaultPackages();
  }
}

async function savePackages(data) {
  try {
    // Save packages as JSON to Blob Store
    const blob = await put(PACKAGES_BLOB_PATH, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false // Keep consistent filename
    });
    
    console.log('Packages saved to Blob Store:', blob.url);
    return true;
  } catch (error) {
    console.error('Error saving packages to Blob:', error);
    throw error;
  }
}

// Default packages (initial data)
function getDefaultPackages() {
  return [
    {
      id: '1',
      name: 'Cultural Heritage Tour',
      duration: '7 Days / 6 Nights',
      price: '$899',
      originalPrice: '$1,199',
      discount: '25% OFF',
      description: 'Explore ancient temples, UNESCO World Heritage sites, and traditional villages.',
      highlights: [
        'Visit 8 UNESCO World Heritage Sites',
        'Traditional dance performances',
        'Local cuisine experiences',
        'Expert cultural guides',
        'Temple of the Tooth Relic',
        'Ancient city of Polonnaruwa'
      ],
      included: [
        'Accommodation in 4-star hotels',
        'All meals (breakfast, lunch, dinner)',
        'Air-conditioned transportation',
        'Professional English-speaking guide',
        'Entrance fees to all sites',
        'Airport transfers'
      ],
      image: 'images/tours/cultural-tour.jpg',
      badge: 'Most Popular',
      season: 'All Year',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Adventure & Wildlife Safari',
      duration: '5 Days / 4 Nights',
      price: '$749',
      originalPrice: '$999',
      discount: '25% OFF',
      description: 'Experience thrilling wildlife safaris and outdoor adventures in Sri Lanka\'s national parks.',
      highlights: [
        'Yala National Park safari',
        'Elephant watching in Udawalawe',
        'White water rafting',
        'Hiking in Horton Plains',
        'Wildlife photography opportunities',
        'Bird watching tours'
      ],
      included: [
        'Luxury safari lodge accommodation',
        'All meals and refreshments',
        '4x4 safari vehicles',
        'Experienced wildlife guides',
        'Park entrance fees',
        'Binoculars and field guides'
      ],
      image: 'images/tours/wildlife-safari.jpg',
      badge: 'Adventure',
      season: 'All Year',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Beach & Relaxation Package',
      duration: '4 Days / 3 Nights',
      price: '$599',
      originalPrice: '$799',
      discount: '25% OFF',
      description: 'Unwind on pristine beaches with luxury spa treatments and water sports.',
      highlights: [
        'Beachfront luxury resort',
        'Spa and wellness treatments',
        'Water sports activities',
        'Sunset boat cruises',
        'Seafood dining experiences',
        'Yoga and meditation sessions'
      ],
      included: [
        '5-star beachfront resort',
        'Daily breakfast and dinner',
        'Spa treatments (2 sessions)',
        'Water sports equipment',
        'Beach activities',
        'Airport transfers'
      ],
      image: 'images/tours/beach-package.jpg',
      badge: 'Relaxation',
      season: 'All Year',
      active: true,
      createdAt: new Date().toISOString()
    }
  ];
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
      // Get all packages or only active ones
      const { active } = req.query;
      const packages = await getPackages();
      
      if (active === 'true') {
        const activePackages = packages.filter(p => p.active !== false);
        return res.status(200).json({ success: true, data: activePackages });
      }
      
      return res.status(200).json({ success: true, data: packages });
    }

    if (req.method === 'POST') {
      // Add new package
      const packageData = req.body;
      
      if (!packageData.name || !packageData.duration || !packageData.price) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const packages = await getPackages();
      const newPackage = {
        id: Date.now().toString(),
        ...packageData,
        active: packageData.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      packages.push(newPackage);
      await savePackages(packages);
      
      return res.status(200).json({ success: true, data: newPackage });
    }

    if (req.method === 'PUT') {
      // Update package
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing package ID' });
      }

      const packages = await getPackages();
      const packageIndex = packages.findIndex(p => p.id === id);
      
      if (packageIndex === -1) {
        return res.status(404).json({ success: false, error: 'Package not found' });
      }

      packages[packageIndex] = {
        ...packages[packageIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await savePackages(packages);
      
      return res.status(200).json({ success: true, data: packages[packageIndex] });
    }

    if (req.method === 'DELETE') {
      // Delete package by ID
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing package ID' });
      }

      const packages = await getPackages();
      const filteredPackages = packages.filter(p => p.id !== id);
      
      if (filteredPackages.length === packages.length) {
        return res.status(404).json({ success: false, error: 'Package not found' });
      }
      
      await savePackages(filteredPackages);
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Packages API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
