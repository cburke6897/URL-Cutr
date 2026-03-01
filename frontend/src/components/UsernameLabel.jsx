import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { sendDeleteAccountEmail } from "../utils/DeleteAccount";
import AlertModal from "./AlertModal";

export default function UsernameLabel({ username = "", admin = false }) {
	const [open, setOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [isAlertError, setIsAlertError] = useState(false);
	const menuRef = useRef(null);
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
		"Change Username": () => console.log("Change Username clicked"),
		"Reset Password": () => navigate("/reset-password"),
		"Delete Account": handleDeleteAccount,
	};

	const handleOptionClick = (action) => {
		action();
		setOpen(false);
	};

	useEffect(() => {
		if (!open) {
			return undefined;
		}

		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
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
				{username}{admin && <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded">Admin</span>}
			</div>

			{open && (
				<div className="absolute top-full left-0 mt-2 w-44 rounded-lg bg-surface-light dark:bg-surface-dark shadow-lg border border-black/10 dark:border-white/10 overflow-hidden">
					{Object.entries(menuOptions).map(([label, action]) => (
						<button
							key={label}
							onClick={() => handleOptionClick(action)}
							className="w-full px-4 py-2 text-left text-sm text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"
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