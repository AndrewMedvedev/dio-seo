import { Send } from "lucide-react";

const ChatInputBox = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder,
  disabled,
  inputDisabled = false,
}) => {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={inputDisabled}
        className="flex-1 bg-dark-800 border border-neutral-700 focus:border-red-500 rounded-2xl px-5 py-3 text-white placeholder:text-neutral-500 focus:outline-none disabled:opacity-70"
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInputBox;
