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
						? "bg-error-bg dark:bg-error-bg-dark border border-error-border"
						: "bg-success-bg dark:bg-success-bg-dark border border-success-border"
				}`}
			>
				<p
					className={`font-semibold transition-colors ${
						isError
							? "text-error-strong dark:text-error-strong-dark"
							: "text-success-strong dark:text-success-strong-dark"
					}`}
				>
					{message}
				</p>
			</div>
		</div>
	);
}
