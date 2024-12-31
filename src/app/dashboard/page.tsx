'use client';
import { useAuthStore } from "../auth";
import { useRouter } from 'next/navigation'; 
import { useEffect } from "react";
import '../style.css'
export default function Dashboard() {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="h-screen dashboard text-white">
      {user && (
        <div className="flex flex-col justify-center  items-center">
          <h1>Welcome, {user.name}</h1>
          <p>Your ID: {user.id}</p>
        </div>
      )}
      <button 
      className="bg-purple-700 text-white rounded"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
