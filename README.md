
  # Image Management System

  This is a code bundle for Image Management System. The original project is available at https://imagecms.figma.site

  # Image CMS

A modern, aesthetic image content management system built with React, TypeScript, and Supabase. Upload, organize, search, and manage your images with a beautiful dark-themed interface.

![Image CMS Preview](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue.svg)

## 🌐 Live Demo

Visit the live site: **[https://Harshg1506.github.io/image-cms](https://Harshg1506.github.io/image-cms)**


## ✨ Features

- 📤 **Image Upload** - Drag-and-drop or browse to upload images (up to 10MB)
- 🏷️ **Metadata Management** - Add titles, descriptions, and tags to your images
- 🔍 **Smart Search** - Search images by title, description, or tags
- 🗑️ **Easy Deletion** - Delete images with a single click
- 💾 **Persistent Storage** - All data persists using Supabase Storage and KV
- 🎨 **Beautiful UI** - Modern dark theme with purple/pink gradient accents
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Hono)
- **Storage**: Supabase Storage + KV Store
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Git installed

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/image-cms.git
   cd image-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Get your project credentials:
      - Project ID
      - Anon/Public Key
      - Service Role Key (for backend)
   
   c. Update the Supabase configuration in `/utils/supabase/info.ts`:
      ```typescript
      export const projectId = 'YOUR_PROJECT_ID';
      export const publicAnonKey = 'YOUR_ANON_KEY';
      ```
   
   d. Deploy the Edge Function:
      ```bash
      # Install Supabase CLI if you haven't
      npm install -g supabase
      
      # Login to Supabase
      supabase login
      
      # Link your project
      supabase link --project-ref YOUR_PROJECT_ID
      
      # Deploy the function
      supabase functions deploy make-server-8777b681
      ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🚀 Deploy to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when you push to the main branch.

### Steps:

1. **Push your code to GitHub** (see instructions above)

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - Click **Save**

3. **Push to trigger deployment**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Wait for deployment**:
   - Go to the **Actions** tab in your repository
   - Watch the deployment process (takes 1-2 minutes)
   - Once complete, your site will be live at:
     `https://YOUR_USERNAME.github.io/image-cms`

### Manual Build (Optional)

To build locally:
```bash
npm run build
```

The built files will be in the `dist/` folder.

## 🎯 Usage

### Uploading Images

1. Click the "Upload Image" button in the header
2. Drag and drop an image or click "Browse Files"
3. Add a title (required), description, and tags
4. Click "Upload"

### Searching Images

1. Use the search bar in the header
2. Enter keywords from titles, descriptions, or tags
3. Click "Search" or press Enter
4. Click "Clear" to reset the search

### Deleting Images

1. Hover over an image card
2. Click the "Delete" button
3. Confirm the deletion

## 📁 Project Structure

```
image-cms/
├── components/
│   ├── ImageCard.tsx         # Individual image display card
│   └── UploadModal.tsx       # Image upload modal
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx      # Edge function routes
│           └── kv_store.tsx   # KV store utilities
├── utils/
│   └── supabase/
│       └── info.ts            # Supabase configuration
├── App.tsx                    # Main application component
└── README.md
```

## 🔒 Security Notes

- **Never commit your Supabase keys** to version control
- The `.gitignore` file is configured to exclude sensitive files
- Use environment variables for production deployments
- This CMS is not designed for storing PII or highly sensitive data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Figma Make](https://www.figma.com)
- Powered by [Supabase](https://supabase.com)
- Icons by [Lucide](https://lucide.dev)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---


  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
