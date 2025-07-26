import React, { useEffect } from "react";
import { Newspaper, Calendar, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

// Normalized news interface for all sources
interface NormalizedNewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  source: "admin" | "twitter" | "crypto" | "external";
  sourceUrl?: string;
  newsId?: number; // Only for admin news
}

// Article Detail Component
export const ArticleDetail: React.FC<{
  article: NormalizedNewsItem;
  onBack: () => void;
  backendBaseUrl: string;
}> = ({ article, onBack, backendBaseUrl }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  return (
    <div className="bg-primary min-h-screen py-10 lg:mx-24 md:mx-16 mx-8 text-dark-primary">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800/40 text-dark-secondary hover:bg-gray-700/60 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Article header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-secondary/90 text-white text-sm font-medium rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-dark-secondary">
                {article.source === "admin" && article.newsId
                  ? `News ID: ${article.newsId}`
                  : `Source: ${article.source}`}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-dark-primary mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-dark-secondary">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishDate)}</span>
              </div>
            </div>
          </div>

          {/* Article content in two-column layout - Desktop */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Article image */}
                <div>
                  {article.imageUrl ||
                  (article.source === "admin" && article.newsId) ? (
                    <img
                      src={
                        article.imageUrl ||
                        `${backendBaseUrl}/api/news/${article.newsId}/image`
                      }
                      alt={article.title}
                      className="w-full max-h-80 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("placeholder")) {
                          target.src = "/api/placeholder/800/400";
                          target.alt = "Article image";
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-800/40 rounded-xl flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-dark-secondary" />
                    </div>
                  )}
                </div>

                {/* First part of content (left column) */}
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-dark-secondary text-lg leading-relaxed"
                    style={{ textAlign: "justify" }}
                  >
                    {(() => {
                      const paragraphs = article.content
                        .split("\n")
                        .filter((p) => p.trim());
                      const midPoint = Math.ceil(paragraphs.length / 2);
                      const leftColumnParagraphs = paragraphs.slice(
                        0,
                        midPoint
                      );

                      return leftColumnParagraphs.map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Second part of content (right column) */}
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-dark-secondary text-lg leading-relaxed"
                    style={{ textAlign: "justify" }}
                  >
                    {(() => {
                      const paragraphs = article.content
                        .split("\n")
                        .filter((p) => p.trim());
                      const midPoint = Math.ceil(paragraphs.length / 2);
                      const rightColumnParagraphs = paragraphs.slice(midPoint);

                      return rightColumnParagraphs.map((paragraph, index) => (
                        <p key={index + midPoint} className="mb-4">
                          {paragraph}
                        </p>
                      ));
                    })()}
                  </div>
                </div>

                {/* Featured quote from the article */}
                <div className="bg-gray-800/30 border-l-4 border-secondary p-4 rounded-lg">
                  <div className="text-dark-secondary italic">
                    <p className="text-sm">"{article.title}"</p>
                    <p className="text-xs text-dark-secondary/70 mt-2">
                      - {article.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile layout - Single column */}
          <div className="block lg:hidden">
            {/* Article image */}
            <div className="mb-8">
              {article.imageUrl ||
              (article.source === "admin" && article.newsId) ? (
                <img
                  src={
                    article.imageUrl ||
                    `${backendBaseUrl}/api/news/${article.newsId}/image`
                  }
                  alt={article.title}
                  className="w-full max-h-96 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("placeholder")) {
                      target.src = "/api/placeholder/800/400";
                      target.alt = "Article image";
                    }
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-800/40 rounded-xl flex items-center justify-center">
                  <Newspaper className="w-16 h-16 text-dark-secondary" />
                </div>
              )}
            </div>

            {/* Article content */}
            <div className="prose prose-invert max-w-none">
              <div
                className="text-dark-secondary text-lg leading-relaxed"
                style={{ textAlign: "justify" }}
              >
                {article.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Article footer */}
          <div className="mt-12 pt-8 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-dark-secondary">
                Published on {formatDate(article.publishDate)}
              </div>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  View Original Source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
