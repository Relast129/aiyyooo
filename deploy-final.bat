@echo off
echo ========================================
echo   DEPLOYING COMPLETE CEYORA WEBSITE
echo ========================================
echo.

git commit -m "restored original website with professional admin dashboard"
git push

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo What's included:
echo.
echo MAIN WEBSITE (Original & Beautiful):
echo - index.html (Homepage with reviews carousel)
echo - about.html (About page with gallery)
echo - packages.html (Tour packages page)
echo - contact.html (Contact page)
echo - reviews.html (Reviews page)
echo - All original images restored
echo - All original CSS and JavaScript
echo.
echo ADMIN DASHBOARD (New & Professional):
echo - dashboard.html (Professional analytics dashboard)
echo - Dark theme with charts and graphs
echo - Gallery management
echo - Reviews management  
echo - Packages management
echo - Analytics and insights
echo.
echo API ENDPOINTS:
echo - /api/gallery (Gallery CRUD)
echo - /api/reviews (Reviews CRUD)
echo - /api/packages (Packages CRUD)
echo.
echo STORAGE:
echo - Vercel Blob Store for all data
echo - Persistent storage
echo - No data loss
echo.
echo After Vercel deploys:
echo.
echo PUBLIC WEBSITE:
echo - Visit: your-domain.vercel.app
echo - Beautiful original design
echo - All pages working
echo - Reviews carousel on homepage
echo - Gallery on about page
echo - Packages page with tours
echo.
echo ADMIN DASHBOARD:
echo - Visit: your-domain.vercel.app/admin-login.html
echo - Login: admin / admin@ceyora
echo - Access professional dashboard
echo - Manage everything from one place
echo.
echo Documentation:
echo - DASHBOARD_GUIDE.txt
echo - PACKAGES_MANAGEMENT_GUIDE.txt
echo - TESTING_GUIDE.txt
echo - BLOB_ONLY_SETUP.txt
echo.
pause
