import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const BUCKET_NAME = 'make-8777b681-images';

// Create storage bucket on startup
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      if (error) {
        console.log(`Error creating bucket: ${error.message}`);
      } else {
        console.log(`Created bucket: ${BUCKET_NAME}`);
      }
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error) {
    console.log(`Error initializing storage: ${error}`);
  }
}

initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8777b681/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload image with metadata
app.post("/make-server-8777b681/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagsString = formData.get('tags') as string;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Parse tags
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filename = `${timestamp}_${crypto.randomUUID()}.${fileExt}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.log(`Error uploading file to storage: ${uploadError.message}`);
      return c.json({ error: `Failed to upload file: ${uploadError.message}` }, 500);
    }

    // Create signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filename, 31536000); // 1 year

    // Save metadata to KV store
    const imageId = crypto.randomUUID();
    const metadata = {
      id: imageId,
      filename,
      originalName: file.name,
      url: urlData?.signedUrl || '',
      title: title || file.name,
      description: description || '',
      tags,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
    };

    await kv.set(`image:${imageId}`, metadata);

    return c.json({ success: true, image: metadata });
  } catch (error) {
    console.log(`Error in upload endpoint: ${error}`);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

// Get all images or search by tags
app.get("/make-server-8777b681/images", async (c) => {
  try {
    const searchQuery = c.req.query('search') || '';
    
    // Get all image metadata
    const allImages = await kv.getByPrefix('image:');
    
    if (!allImages || allImages.length === 0) {
      return c.json({ images: [] });
    }

    let images = allImages;

    // Filter by search query (search in title, description, and tags)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      images = images.filter(img => {
        const matchesTitle = img.title?.toLowerCase().includes(lowerQuery);
        const matchesDescription = img.description?.toLowerCase().includes(lowerQuery);
        const matchesTags = img.tags?.some((tag: string) => 
          tag.toLowerCase().includes(lowerQuery)
        );
        return matchesTitle || matchesDescription || matchesTags;
      });
    }

    // Sort by upload date (newest first)
    images.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    // Refresh signed URLs if needed
    const imagesWithFreshUrls = await Promise.all(
      images.map(async (img) => {
        const { data: urlData } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(img.filename, 31536000); // 1 year
        
        return {
          ...img,
          url: urlData?.signedUrl || img.url,
        };
      })
    );

    return c.json({ images: imagesWithFreshUrls });
  } catch (error) {
    console.log(`Error fetching images: ${error}`);
    return c.json({ error: `Failed to fetch images: ${error.message}` }, 500);
  }
});

// Delete image
app.delete("/make-server-8777b681/images/:id", async (c) => {
  try {
    const imageId = c.req.param('id');
    
    // Get image metadata
    const metadata = await kv.get(`image:${imageId}`);
    
    if (!metadata) {
      return c.json({ error: 'Image not found' }, 404);
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([metadata.filename]);

    if (storageError) {
      console.log(`Error deleting file from storage: ${storageError.message}`);
    }

    // Delete metadata from KV store
    await kv.del(`image:${imageId}`);

    return c.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.log(`Error deleting image: ${error}`);
    return c.json({ error: `Failed to delete image: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
