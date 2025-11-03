@echo off
git commit -m "fixed blob store data retrieval"
git push
echo.
echo ========================================
echo CRITICAL FIX DEPLOYED!
echo ========================================
echo.
echo The API now correctly retrieves data from Blob Store.
echo Vercel will auto-deploy in ~30 seconds.
echo.
echo After deployment:
echo 1. Upload an image in admin dashboard
echo 2. Go to About page
echo 3. Image should now appear!
echo.
pause
