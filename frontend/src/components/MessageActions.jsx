import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { canEditMessage, canDeleteMessage } from '../lib/utils';

const MessageActions = ({ message, onEdit, onDelete }) => {
  const [showTimeLimitMessage, setShowTimeLimitMessage] = useState(false);
  const [timeLimitText, setTimeLimitText] = useState('');
  const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") || "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const handleEdit = () => {
    if (canEditMessage(message.createdAt)) {
      onEdit(message);
    } else {
      setTimeLimitText('Messages can only be edited within 1 minute of sending');
      setShowTimeLimitMessage(true);
      setTimeout(() => setShowTimeLimitMessage(false), 3000);
    }
  };

  const handleDelete = () => {
    if (canDeleteMessage(message.createdAt)) {
      onDelete(message._id);
    } else {
      setTimeLimitText('Messages can only be deleted within 5 minutes of sending');
      setShowTimeLimitMessage(true);
      setTimeout(() => setShowTimeLimitMessage(false), 3000);
    }
  };

  // Theme-specific colors for the notification
  const getNotificationColors = () => {
    if (theme === "dark") {
      return "bg-base-200 text-base-content border border-base-300";
    } else {
      return "bg-base-300 text-base-content border border-base-300";
    }
  };

  return (
    <>
      <div className="absolute top-1 right-1 bg-base-100 rounded-lg shadow-lg border border-base-300 p-1 flex gap-1 z-10">
        <button
          onClick={handleEdit}
          className="p-1.5 hover:bg-base-200 rounded transition-colors"
          title="Edit message"
        >
          <Edit className="w-3 h-3" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-base-200 rounded transition-colors text-error"
          title="Delete message"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Time limit notification */}
      {showTimeLimitMessage && (
        <div className="fixed top-20 left-0 right-0 flex justify-center z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg animate-fade-in ${getNotificationColors()}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{timeLimitText}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageActions; 