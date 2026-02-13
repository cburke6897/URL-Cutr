import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'

export default function CopyButton({ text }) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            alert("Failed to copy: " + err);
        }
    }
    
    return (
        <button onClick={copyToClipboard}
        className="ml-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded"
        title='Copy to clipboard'>
            <ClipboardDocumentIcon className="h-5 w-5" />
        </button>
    )
}