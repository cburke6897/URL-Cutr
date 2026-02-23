export default function UsernameLabel({ username = "", admin = false }) {
	return (
		<div className="fixed top-4 left-4 z-20 rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-semibold text-text-light dark:text-text-dark shadow-md transition-colors">
			{username}{admin && <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded">Admin</span>}
		</div>
	);
}
