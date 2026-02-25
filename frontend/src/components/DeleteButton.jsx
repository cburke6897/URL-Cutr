import { TrashIcon } from '@heroicons/react/24/outline'

export default function DeleteButton({ onClick, title }) {    
    return (
        <button 
            onClick={onClick}
            className="h-12 ml-2 px-4 py-3 rounded-lg transition-colors flex items-center justify-center bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            title={title}
        >
            <TrashIcon className="h-5 w-5" />
        </button>
    )
}