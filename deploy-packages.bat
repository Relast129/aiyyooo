@echo off
echo ========================================
echo   DEPLOYING PACKAGES MANAGEMENT SYSTEM
echo ========================================
echo.

git commit -m "added complete packages management system with blob store"
git push

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo What was added:
echo - Packages API endpoint (api/packages.js)
echo - Admin Packages Management tab
echo - Add, Edit, Delete, Activate/Deactivate packages
echo - Packages load from Blob Store
echo - Seasonal package management
echo - All changes persist in database
echo.
echo After Vercel deploys:
echo 1. Login to admin dashboard
echo 2. Click "Packages Management" tab
echo 3. Add/Edit/Delete packages
echo 4. Changes appear on packages page immediately
echo.
pause
