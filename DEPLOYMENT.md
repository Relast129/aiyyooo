# Deployment Instructions

## Prerequisites

- A static hosting provider (GitHub Pages, Netlify, Vercel, or similar)
- Basic understanding of file management

## Deployment Options

### Option 1: GitHub Pages

1. Create a new repository on GitHub
2. Upload all files from the `static-website` directory to the repository
3. Go to repository Settings > Pages
4. Select the branch containing your files (usually main)
5. Your site will be available at `https://[username].github.io/[repository-name]/`

### Option 2: Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign up or log in to your account
3. Drag and drop the entire `static-website` folder to the deployment area
4. Netlify will automatically deploy your site and provide a URL

### Option 3: Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up or log in to your account
3. Import the `static-website` folder as a new project
4. Vercel will automatically detect it as a static site and deploy it

### Option 4: Traditional Web Hosting

1. Upload all files from the `static-website` directory to your web server's public directory
2. Ensure all files are accessible via HTTP
3. Your site will be available at your domain

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test all navigation links
- [ ] Check WhatsApp links open correctly
- [ ] Verify mobile responsiveness
- [ ] Confirm social media links work
- [ ] Test contact form functionality
- [ ] Check that all images load properly

## Custom Domain Setup

If you want to use a custom domain:

1. Purchase a domain from a registrar (GoDaddy, Namecheap, etc.)
2. Point your domain's DNS records to your hosting provider
3. Update any absolute URLs in the code to use your custom domain
4. Update the sitemap.xml with your custom domain

## Updates and Maintenance

To update your website:

1. Make changes to the HTML, CSS, or JavaScript files
2. Re-upload the modified files to your hosting provider
3. Clear your browser cache to see the changes immediately

For significant updates, consider version controlling your changes with Git.
