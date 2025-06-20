import { useState, useEffect } from "react";

export default function PortfolioItem({ item, index, allItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index || 0);

  const currentItem = allItems?.[currentIndex];

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
      else if (e.key === "ArrowLeft" && currentIndex > 0)
        setCurrentIndex((prev) => prev - 1);
      else if (e.key === "ArrowRight" && currentIndex < allItems.length - 1)
        setCurrentIndex((prev) => prev + 1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, currentIndex, allItems]);

  if (!item || !item.url) return null;

  return (
    <>
        <div
        className="group rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsOpen(true)}
        >
        {item.media_type === "image" && (
            <img
            src={item.url}
            alt={item.description || "Portfolio Image"}
            className="w-full h-auto rounded-lg object-cover transition-transform duration-300 group-hover:scale-102"
            />
        )}
        {item.media_type === "video" && (
            <video
            src={item.url}
            controls
            className="w-full h-auto rounded-lg object-cover"
            />
        )}

        {(item.title || item.description) && (
            <div className="mt-3 space-y-1">
            {item.title && (
                <h2 className="text-lg font-bold text-teal-700 leading-tight truncate">
                {item.title}
                </h2>
            )}
            {item.description && (
                <p className="text-sm text-teal-600 line-clamp-3">
                {item.description}
                </p>
            )}
            </div>
        )}
        </div>

      {/* {isOpen && currentItem && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-full max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2"
              >
                ‹
              </button>
            )}

            {currentIndex < allItems.length - 1 && (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2"
              >
                ›
              </button>
            )}

            {currentItem.media_type === "image" ? (
              <img
                src={currentItem.url}
                alt={currentItem.description || "Portfolio"}
                className="max-w-screen max-h-screen rounded"
              />
            ) : (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-w-screen max-h-screen rounded"
              />
            )}
            {currentItem.description && (
              <p className="text-white mt-2 text-center">
                {currentItem.description}
              </p>
            )}
          </div>
        </div>
      )} */}
    </>
  );
}
