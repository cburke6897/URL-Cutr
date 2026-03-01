import { useState } from "react";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-start bg-bg-light dark:bg-bg-dark transition-colors p-4 pt-[7.5%]">
      <div className="w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg text-center transition-colors">
        <label className="block text-text-light dark:text-text-dark text-3xl font-bold mb-6 transition-colors">
          Password Reset
        </label>

        <div className="flex flex-col gap-3 items-center">
          <TextInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            additionalClasses="w-full"
            title="Enter your email"
          />
        </div>

        <div className="mt-5">
          <EnterButton onClick={() => {}} title="Send Reset Link" text="Send Reset Link" />
        </div>
      </div>
    </div>
  );
}
