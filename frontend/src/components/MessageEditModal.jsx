import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const MessageEditModal = ({ message, onSave, onCancel }) => {
  const [editedText, setEditedText] = useState(message.text || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedText.trim()) {
      onSave(message._id, editedText.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Message</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-base-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-3 border border-base-300 rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Edit your message..."
              autoFocus
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-base-content/60 hover:text-base-content transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageEditModal; 