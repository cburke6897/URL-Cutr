import { useEffect, useRef } from "react";

export default function AlertModal({ message, isError = false, onClose }) {
	const modalRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	if (!message) return null;

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
			<div
				ref={modalRef}
				className={`rounded-lg shadow-lg px-6 py-4 text-center transition-colors ${
					isError
						? "bg-red-100 dark:bg-red-900/30 border border-red-500"
						: "bg-green-100 dark:bg-green-900/30 border border-green-500"
				}`}
			>
				<p
					className={`font-semibold transition-colors ${
						isError
							? "text-red-800 dark:text-red-200"
							: "text-green-800 dark:text-green-200"
					}`}
				>
					{message}
				</p>
			</div>
		</div>
	);
}
