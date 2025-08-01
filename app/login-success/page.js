"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginSuccess() {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    document.title = "Login Success | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "You have successfully logged in.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "You have successfully logged in.";
      document.head.appendChild(meta);
    }
    // Show success toast on mount
    toast.success("Login successful! Welcome back!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }, []);

  useEffect(() => {
    // Redirect to home if not logged in
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/")
    }
  }, [session, status, router])

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-8">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4">Login Successful!</h1>
          <p className="text-gray-300 mb-2">Welcome back,</p>
          <p className="text-xl font-semibold text-blue-400 mb-8">
            {session?.user?.name || session?.user?.email || session?.phone || "User"}
          </p>

          {/* User Info */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Login Details</h3>
            <div className="space-y-2 text-left">
              {session?.user?.name && (
                <div>
                  <span className="text-gray-400">Name: </span>
                  <span className="text-white">{session.user.name}</span>
                </div>
              )}
              {session?.user?.email && (
                <div>
                  <span className="text-gray-400">Email: </span>
                  <span className="text-white">{session.user.email}</span>
                </div>
              )}
              {session?.phone && (
                <div>
                  <span className="text-gray-400">Phone: </span>
                  <span className="text-white">{session.phone}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Provider: </span>
                <span className="text-white capitalize">{session?.provider || "Unknown"}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <button className="w-full relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 hover:opacity-100"></span>
                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="flex items-center space-x-2">
                    <span className="transition-all duration-500 hover:translate-x-1">Go to Homepage</span>
                    <svg className="w-5 h-5 transition-transform duration-500 hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}