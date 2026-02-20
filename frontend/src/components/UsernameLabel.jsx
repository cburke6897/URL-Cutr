export default function UsernameLabel({ username = "guest" }) {
	return (
		<div className="fixed top-4 left-4 z-20 rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-semibold text-text-light dark:text-text-dark shadow-md transition-colors">
			{username}
		</div>
	);
}
