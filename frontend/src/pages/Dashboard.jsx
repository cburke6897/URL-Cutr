import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        async function init() {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/auth");
            }
        }

        init()
    }, []);


  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the dashboard page. You can add your dashboard content here.</p>
    </div>
  );
}