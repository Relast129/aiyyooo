# Ceyora Holidays - Sri Lanka Travel Website

A fully responsive, mobile-friendly static website for Ceyora Holidays, showcasing luxury Sri Lankan travel experiences.

## Features

- **Fully Responsive Design**: Works seamlessly on all devices from mobile phones to desktop computers
- **WhatsApp Integration**: Primary booking and communication channel integrated throughout the site
- **Modern UI/UX**: Beautiful animations, gradients, and interactive elements
- **Performance Optimized**: Lightweight and fast-loading
- **SEO Ready**: Includes sitemap and robots.txt for search engine optimization
- **Cross-Browser Compatible**: Works on all modern browsers

## Pages

1. **Home Page** (`index.html`) - Main landing page with hero section, journey overview, and call-to-action
2. **About Page** (`about.html`) - Company information, gallery, and why choose us section
3. **Contact Page** (`contact.html`) - Contact form, company details, and booking information

## Technology Stack

- **HTML5** - Semantic markup for better SEO and accessibility
- **CSS3** - Modern styling with Flexbox, Grid, and animations
- **Vanilla JavaScript** - Interactive elements and form handling
- **No Frameworks** - Pure static files for maximum performance

## Key Components

### Navigation

- Responsive header with mobile menu toggle
- Fixed navigation on scroll
- Smooth scrolling to sections

### Hero Section

- Full-screen background images with overlay
- Animated badges and text
- Call-to-action buttons

### Journey Section

- Interactive phase selection
- Animated card transitions
- Dynamic content updating

### Gallery

- Lightbox image viewer
- Responsive grid layout
- Hover effects and animations

### Contact & Booking

- WhatsApp-first approach for all communications
- Form validation
- Direct linking to WhatsApp with pre-filled messages

### Footer

- Comprehensive contact information
- Quick links
- Newsletter signup (redirects to WhatsApp)
- Social media links

### Update Contact Information

**Phone Numbers** (Search and replace in all HTML files):
- `94772885558` → Your WhatsApp number
- `94768118780` → Your phone number

**Email:**
- `aklaabulkalam01@gmail.com` → Your email

**Social Media:**
- Facebook: `https://www.facebook.com/CeyoraHoliday`
- Instagram: `https://www.instagram.com/_ceyora_holidays_`
- TikTok: `https://www.tiktok.com/@Ceyora_Holidays`

### Change Admin Password

Edit `js/admin-auth.js`:
```javascript
const ADMIN_PASSWORD = 'your-secure-password-here';
```

Then redeploy:
```bash
vercel --prod
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

This project is proprietary to Ceyora Holidays and should not be distributed without permission.

## Support

For technical support or questions about the website, please contact the development team.
