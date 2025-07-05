import { Send, Sun, Moon } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = ({ theme, setTheme }) => {
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose between light and dark mode</p>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <span className="font-medium flex items-center gap-1"><Sun className="w-5 h-5" /> Light</span>
          <button
            className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 focus:outline-none ${theme === "dark" ? "bg-neutral" : "bg-primary/40"}`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-base-100 shadow-md transform transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`}
            />
            <span className="absolute left-2 top-1.5 text-yellow-500">
              <Sun className="w-4 h-4" />
            </span>
            <span className="absolute right-2 top-1.5 text-blue-900 dark:text-yellow-300">
              <Moon className="w-4 h-4" />
            </span>
          </button>
          <span className="font-medium flex items-center gap-1"><Moon className="w-5 h-5" /> Dark</span>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div
            className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg max-w-lg mx-auto"
            data-theme={theme}
          >
            <div className="px-4 py-3 border-b border-base-300 bg-base-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                  J
                </div>
                <div>
                  <h3 className="font-medium text-sm">John Doe</h3>
                  <p className="text-xs text-base-content/70">Online</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 min-h-[120px] max-h-[160px] overflow-y-auto bg-base-100">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-xl p-3 shadow-sm
                      ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                    `}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`
                        text-[10px] mt-1.5
                        ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                      `}
                    >
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-base-300 bg-base-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 text-sm h-10"
                  placeholder="Type a message..."
                  value="This is a preview"
                  readOnly
                />
                <button className="btn btn-primary h-10 min-h-0">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
