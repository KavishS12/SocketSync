import React, { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { canEditMessage, canDeleteMessage } from '../lib/utils';

const MessageActions = ({ message, onEdit, onDelete, onClose }) => {
  const [showTimeLimitMessage, setShowTimeLimitMessage] = useState(false);
  const [timeLimitText, setTimeLimitText] = useState('');

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
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-base-200 rounded transition-colors"
          title="Close"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Time limit notification */}
      {showTimeLimitMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-error text-error-content px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{timeLimitText}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageActions; 