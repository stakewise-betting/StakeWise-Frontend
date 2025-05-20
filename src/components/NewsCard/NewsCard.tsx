// src/components/NewsCard/NewsCard.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns'; // Using date-fns for relative time

// Define the structure of a news article object
export interface NewsArticle {
  id: string | number; // Unique identifier
  title: string;
  source?: string; // Name of the news source (e.g., Reuters, AP) - Polymarket often shows this
  author?: string; // Optional author - Your image has this
  description?: string; // Snippet/summary
  url: string; // Link to the full article
  urlToImage?: string; // Image URL
  publishedAt: string | Date; // Publication date (ISO string or Date object)
  category?: string; // Category like 'GENERAL', 'POLITICS', 'CRYPTO' - Your image has this
  // Add potentially relevant market link if needed later
  // marketUrl?: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const placeholderImage = "https://via.placeholder.com/400x200?text=News"; // Fallback image

  // Format the date - You can adjust formatting as needed
  let displayDate: string;
  try {
    // Example: show relative time like "2 days ago" or full date if older
    const date = new Date(article.publishedAt);
    const now = new Date();
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) { // Less than 7 days old
      displayDate = `${formatDistanceToNow(date)} ago`;
    } else {
      displayDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  } catch (error) {
    displayDate = 'Invalid Date'; // Fallback for invalid date strings
  }


  return (
    <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-lg">
      {/* Image Section */}
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={article.urlToImage || placeholderImage}
          alt={article.title}
          className="w-full h-40 object-cover" // Fixed height, object-cover maintains aspect ratio
          onError={(e) => (e.currentTarget.src = placeholderImage)} // Handle broken image links
        />
      </a>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category and Date */}
        <div className="flex justify-between items-center text-xs text-sub dark:text-dark-secondary mb-2">
          <span className="font-medium uppercase tracking-wider">{article.category || 'General'}</span>
          <span title={new Date(article.publishedAt).toLocaleString()}>{displayDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-2 line-clamp-2">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-secondary dark:hover:text-secondary transition-colors">
            {article.title}
          </a>
        </h3>

        {/* Author (Optional) */}
        {article.author && (
           <p className="text-sm text-sub dark:text-dark-secondary mb-3 italic">By {article.author}</p>
        )}

        {/* Description/Snippet */}
        {article.description && (
          <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4 line-clamp-3 flex-grow">
            {article.description}
          </p>
        )}

         {/* Source and Abstract Link */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
           {article.source && (
                <span className="text-xs text-sub dark:text-dark-secondary font-medium">
                    Source: {article.source}
                </span>
            )}
           <a
             href={article.url}
             target="_blank"
             rel="noopener noreferrer"
             className="text-sm font-medium text-orange-500 hover:text-orange-600 dark:text-secondary dark:hover:text-orange-500 transition-colors"
           >
            Read More {/* Changed from 'Abstract' to be more conventional */}
           </a>
        </div>

        {/* Optional: Link to Polymarket market if applicable */}
        {/* {article.marketUrl && (
          <a href={article.marketUrl} className="...">View Market</a>
        )} */}
      </div>
    </div>
  );
};

export default NewsCard;