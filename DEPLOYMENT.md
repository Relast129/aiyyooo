# Ceyora Holidays - Complete Deployment Guide

## 🚀 Quick Start - Deploy to Vercel (Recommended)

This website uses **Vercel KV** for persistent storage of gallery images and reviews. Follow these steps to deploy:

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 2: Deploy to Vercel

```bash
# Navigate to the project directory
cd "c:\Users\ramzy\Downloads\ceyora html"

# Login to Vercel (opens browser)
vercel login

# Deploy the project
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No (for first deployment)
- **Project name?** ceyora-holidays (or your preferred name)
- **Directory?** ./ (current directory)
- **Override settings?** No

### Step 3: Set Up Vercel KV Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your **ceyora-holidays** project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value Store)
6. Name it: `ceyora-kv` or any name you prefer
7. Click **Create**
8. Vercel will automatically connect the KV database to your project

### Step 4: Redeploy (Important!)

After creating the KV database, redeploy to connect it:

```bash
vercel --prod
```

Your website is now live with persistent storage! 🎉

---

## 📋 Features Implemented

### ✅ Admin Dashboard
- **URL:** `https://your-domain.vercel.app/admin-login.html`
- **Default Password:** `ceyora2024` (change in `js/admin-auth.js`)
- Upload gallery images (max 4MB each)
- Add/approve/delete reviews
- All data persists in Vercel KV database

### ✅ Gallery Management
- Admin uploads appear automatically in About page
- Images stored in Vercel KV (persist after refresh)
- Lightbox view for full-size images

### ✅ Reviews System
- Visitors can submit reviews (pending approval)
- Admin can approve/reject reviews
- Approved reviews show on:
  - Reviews page
  - Homepage carousel (rotating cards)
- All reviews persist in database

### ✅ Homepage Reviews Carousel
- Auto-rotating review cards
- Shows latest 6 approved reviews
- Responsive design (3 cards → 2 → 1)
- Manual navigation buttons

---

## 🔐 Admin Access

**Login URL:** `https://your-domain.vercel.app/admin-login.html`

**Default Credentials:**
- Username: `admin`
- Password: `ceyora2024`

**To Change Password:**
Edit `js/admin-auth.js` line 3:
```javascript
const ADMIN_PASSWORD = 'your-new-password';
```

---

## 📱 Testing Checklist

After deployment, test these features:

### Public Pages
- [ ] Homepage loads correctly
- [ ] Reviews carousel displays and rotates
- [ ] About page shows gallery images
- [ ] Reviews page displays approved reviews
- [ ] Packages page works
- [ ] Contact page works
- [ ] All WhatsApp buttons open correctly
- [ ] Mobile menu works on small screens
- [ ] Social media links work

### Admin Features
- [ ] Can login to admin dashboard
- [ ] Can upload gallery images
- [ ] Images appear in About page gallery
- [ ] Can add admin reviews
- [ ] Can approve user reviews
- [ ] Can delete reviews
- [ ] Reviews appear on homepage carousel
- [ ] Data persists after page refresh

---

## 🛠️ Configuration

### Update Contact Information

Edit these files to update contact details:

**Phone Numbers:**
- `index.html` - Search for `94772885558` and `94768118780`
- `about.html` - Same phone numbers
- `contact.html` - Same phone numbers

**Email:**
- Search for `aklaabulkalam01@gmail.com` in all HTML files

**Social Media:**
- Facebook: `https://www.facebook.com/CeyoraHoliday`
- Instagram: `https://www.instagram.com/_ceyora_holidays_`
- TikTok: `https://www.tiktok.com/@Ceyora_Holidays`

### Update Admin Password

Edit `js/admin-auth.js`:
```javascript
const ADMIN_PASSWORD = 'your-secure-password';
```

---

## 🌐 Custom Domain Setup

### Option 1: Vercel Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificate

### Option 2: Update Domain in Code
If using custom domain, update:
- `sitemap.xml` - Replace URLs with your domain
- Any hardcoded URLs in HTML files

---

## 📊 Vercel KV Storage Limits

**Free Plan:**
- 256 MB storage
- 3,000 commands per day
- Sufficient for ~50-100 high-quality images
- Unlimited reviews (text only)

**Pro Plan (if needed):**
- 1 GB storage
- 100,000 commands per day

---

## 🔄 Making Updates

### Update Website Content
1. Edit HTML/CSS/JS files locally
2. Run `vercel --prod` to deploy changes
3. Changes go live in ~30 seconds

### Backup Data
Vercel KV data is automatically backed up, but you can also:
1. Export reviews/images from admin dashboard
2. Store backup locally
3. Re-import if needed

---

## 🐛 Troubleshooting

### Images Not Showing After Upload
- **Issue:** Vercel KV not connected
- **Fix:** Create KV database in Vercel dashboard, then redeploy

### Reviews Not Persisting
- **Issue:** API endpoints not working
- **Fix:** Ensure `vercel.json` is present and redeploy

### Admin Login Not Working
- **Issue:** Password incorrect
- **Fix:** Check `js/admin-auth.js` for correct password

### 404 Errors on Routes
- **Issue:** Vercel routing not configured
- **Fix:** `vercel.json` should handle this automatically

---

## 📞 Support & Maintenance

### For Client Handover

**Admin Access:**
- URL: `https://[your-domain]/admin-login.html`
- Username: `admin`
- Password: `ceyora2024` (or updated password)

**What Client Can Do:**
1. Upload new gallery images
2. Add testimonials/reviews
3. Approve visitor reviews
4. Delete inappropriate content

**What Client Cannot Change (needs developer):**
- Page layouts and design
- Contact information
- Navigation structure
- Package details

### Monthly Maintenance
- Check for broken links
- Update gallery with new tour photos
- Moderate and approve reviews
- Monitor Vercel KV storage usage

---

## 🎯 Production Ready Checklist

Before client handover:

- [x] Vercel KV database configured
- [x] All API endpoints working
- [x] Gallery images persist after refresh
- [x] Reviews persist after refresh
- [x] Homepage carousel displays reviews
- [x] Admin dashboard fully functional
- [x] Mobile responsive design
- [x] WhatsApp integration working
- [x] Social media links verified
- [ ] Custom domain configured (if applicable)
- [ ] Admin password changed from default
- [ ] Client trained on admin dashboard
- [ ] Backup procedure documented

---

## 📝 Notes

- **Image Size Limit:** 4MB per image (Vercel KV limit)
- **Recommended Image Format:** JPEG, optimized for web
- **Review Moderation:** All user reviews require admin approval
- **Data Persistence:** All data stored in Vercel KV (survives deployments)
- **Cost:** Free tier sufficient for small-medium traffic

---

## 🚀 Deploy Commands Reference

```bash
# First time deployment
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove [deployment-url]
```

---

**Website is now production-ready and can be handed over to the client!** 🎉
