import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { sendDeleteAccountEmail } from "../utils/DeleteAccount";
import AlertModal from "./AlertModal";

export default function UsernameLabel({ username = "", admin = false }) {
	const [open, setOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const [alertMessage, setAlertMessage] = useState("");
	const [isAlertError, setIsAlertError] = useState(false);
	const menuRef = useRef(null);
	const focusedIndexRef = useRef(-1);
	const navigate = useNavigate();

	const handleDeleteAccount = async () => {
		const result = await sendDeleteAccountEmail();
		if (result.error) {
			setAlertMessage(result.error);
			setIsAlertError(true);
		} else if (result.message) {
			setAlertMessage(result.message);
			setIsAlertError(false);
		}
	};

	const menuOptions = {
		"Change Username": () => navigate("/change-username"),
		"Reset Password": () => navigate("/reset-password"),
		"Delete Account": handleDeleteAccount,
	};

	const handleOptionClick = (action) => {
		action();
		setOpen(false);
	};

	useEffect(() => {
		focusedIndexRef.current = focusedIndex;
	}, [focusedIndex]);

	useEffect(() => {
		if (!open) {
			return undefined;
		}

		setFocusedIndex(-1); // Reset focus to nothing when menu opens

		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpen(false);
			}
		};

		const handleKeyDown = (event) => {
			const currentMenuOptions = {
				"Change Username": () => navigate("/change-username"),
				"Reset Password": () => navigate("/reset-password"),
				"Delete Account": handleDeleteAccount,
			};

			const menuOptionsArray = Object.entries(currentMenuOptions);
			const maxIndex = menuOptionsArray.length - 1;

			if (event.key === "ArrowDown") {
				event.preventDefault();
				setFocusedIndex((prev) => {
					if (prev === -1) return 0;
					return prev < maxIndex ? prev + 1 : 0;
				});
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setFocusedIndex((prev) => {
					if (prev === -1) return maxIndex;
					return prev > 0 ? prev - 1 : maxIndex;
				});
			} else if (event.key === "Enter") {
				event.preventDefault();
				if (focusedIndexRef.current >= 0) {
					const [, action] = menuOptionsArray[focusedIndexRef.current];
					handleOptionClick(action);
				}
			} else if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	return (
		<>
			<AlertModal 
				message={alertMessage} 
				isError={isAlertError} 
				onClose={() => setAlertMessage("")} 
			/>
			<div ref={menuRef} className="fixed top-4 left-4 z-20 flex items-center gap-2">
			<div className="rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm font-semibold text-text-light dark:text-text-dark shadow-md transition-colors flex items-center gap-2">
				<button 
					onClick={() => setOpen((prev) => !prev)}
					className="hover:opacity-70 transition-opacity"
					aria-label="Open settings"
					aria-expanded={open}
				>
					<Cog6ToothIcon className="w-5 h-5" />
				</button>
				{username}{admin && <span className="ml-2 text-xs bg-admin-badge text-white px-1 rounded">Admin</span>}
			</div>

			{open && (
				<div className="absolute top-full left-0 mt-2 w-44 rounded-lg bg-surface-light dark:bg-surface-dark shadow-lg border border-border-subtle dark:border-border-subtle-dark overflow-hidden">
					{Object.entries(menuOptions).map(([label, action], index) => (
						<button
							key={label}
							onClick={() => handleOptionClick(action)}
							onMouseEnter={() => setFocusedIndex(index)}
							className={`w-full px-4 py-2 text-left text-sm text-text-light dark:text-text-dark transition-colors ${
								index === focusedIndex
									? "bg-hover-overlay dark:bg-hover-overlay-dark"
									: "hover:bg-hover-overlay dark:hover:bg-hover-overlay-dark"
							}`}
						>
							{label}
						</button>
					))}
				</div>
			)}
			</div>
		</>
	);
}