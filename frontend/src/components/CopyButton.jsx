import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'

export default function CopyButton({ text, disabled = false }) {
    const copyToClipboard = async () => {
        if (disabled) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            alert("Failed to copy: " + err);
        }
    }
    
    return (
        <button onClick={copyToClipboard}
        disabled={disabled}
        className={`h-12 ml-2 px-4 py-3 rounded-lg transition-colors flex items-center justify-center ${
          disabled
            ? "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50"
            : "bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] dark:bg-[var(--color-button-dark)] dark:hover:bg-[var(--color-button-hover-dark)] text-white"
        }`}
        title={disabled ? 'Generate a cut URL first' : 'Copy to clipboard'}>
            <ClipboardDocumentIcon className="h-5 w-5" />
        </button>
    )
}