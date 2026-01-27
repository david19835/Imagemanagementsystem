import { useState } from 'react';
import { Trash2, Tag, Calendar, FileText, ExternalLink } from 'lucide-react';

interface Image {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  uploadedAt: string;
  size: number;
  type: string;
}

interface ImageCardProps {
  image: Image;
  onDelete: (id: string) => void;
}

export function ImageCard({ image, onDelete }: ImageCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) {
      return;
    }

    setDeleting(true);
    await onDelete(image.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-zinc-950 rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all group border border-zinc-800">
      {/* Image */}
      <div className="relative aspect-video bg-zinc-900 overflow-hidden">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white text-black rounded-lg transition-colors text-sm font-medium"
            >
              <ExternalLink className="size-4" />
              View Full
            </a>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium disabled:bg-zinc-700"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {image.title}
        </h3>

        {image.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {image.description}
          </p>
        )}

        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {image.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 text-purple-300 rounded text-xs font-medium"
              >
                <Tag className="size-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-500 border-t border-zinc-800 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="size-3" />
            <span>{formatDate(image.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="size-3" />
            <span>{formatFileSize(image.size)}</span>
          </div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium"
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>

        {/* Extended Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2 text-xs">
            <div>
              <span className="font-medium text-gray-400">Filename:</span>
              <span className="ml-2 text-gray-500 break-all">{image.originalName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-400">Type:</span>
              <span className="ml-2 text-gray-500">{image.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-400">ID:</span>
              <span className="ml-2 text-gray-500 font-mono text-[10px]">{image.id}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}