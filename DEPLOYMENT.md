# Deployment Guide - Job Aid Generator

This guide shows you how to deploy your Job Aid Generator as a live website that users can access via URL.

## Option 1: GitHub Pages (Recommended - Free)

### Step 1: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon and select "New repository"
3. Name it something like `job-aid-generator`
4. Make it public
5. Don't initialize with README (we already have one)

### Step 2: Upload Your Files
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-aid-generator.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

Your site will be available at: `https://YOUR_USERNAME.github.io/job-aid-generator`

## Option 2: Netlify (Free & Easy)

### Step 1: Create Netlify Account
1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub, GitLab, or email

### Step 2: Deploy
1. Click "New site from Git"
2. Connect your GitHub account
3. Select your repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty - it's the root)
5. Click "Deploy site"

Your site will be available at: `https://your-site-name.netlify.app`

## Option 3: Vercel (Free & Fast)

### Step 1: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub, GitLab, or email

### Step 2: Deploy
1. Click "New Project"
2. Import your GitHub repository
3. Deploy settings:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
4. Click "Deploy"

Your site will be available at: `https://your-project-name.vercel.app`

## Option 4: Local Development Server

For testing locally before deploying:

### Using Python (if installed)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: `http://localhost:8000`

### Using Node.js (if installed)
```bash
# Install a simple server
npm install -g http-server

# Run server
http-server -p 8000
```
Then visit: `http://localhost:8000`

### Using PHP (if installed)
```bash
php -S localhost:8000
```
Then visit: `http://localhost:8000`

## Option 5: Traditional Web Hosting

If you have a web hosting service (like GoDaddy, Bluehost, etc.):

1. Upload all files to your web server's public directory
2. Ensure `index.html` is in the root directory
3. Your site will be available at your domain

## Custom Domain (Optional)

After deploying, you can add a custom domain:

### GitHub Pages
1. Go to repository Settings > Pages
2. Add custom domain in "Custom domain" field
3. Update DNS records with your domain provider

### Netlify/Vercel
1. Go to site settings
2. Add custom domain
3. Update DNS records as instructed

## Testing Your Deployment

After deployment, test these features:
- ✅ Form loads correctly
- ✅ Can add/remove steps
- ✅ Preview works
- ✅ Generate job aid downloads file
- ✅ Works on mobile devices

## Troubleshooting

### Common Issues:

**Files not loading:**
- Ensure all files are in the root directory
- Check file permissions
- Verify file names match exactly

**JavaScript not working:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser

**Download not working:**
- Some browsers block automatic downloads
- Check browser security settings
- Try right-clicking download links

## Security Considerations

Since this is a client-side application:
- ✅ No server-side processing required
- ✅ No sensitive data stored
- ✅ Works offline after initial load
- ✅ No database or API calls

## Performance Tips

- ✅ Files are already optimized
- ✅ CSS and JS are minified-ready
- ✅ Images use CDN (Font Awesome)
- ✅ Responsive design for all devices

---

**Recommended: Start with GitHub Pages** - it's free, reliable, and perfect for this type of application! 