export default function UsernameLabel({ username = "guest" }) {
	return (
		<div className="fixed top-4 left-4 z-20 rounded-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] px-3 py-2 text-sm font-semibold text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] shadow-md transition-colors">
			{username}
		</div>
	);
}
