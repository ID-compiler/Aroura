"use client";
import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Login failed: " + error, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [error]);

  const getErrorMessage = (errorType) => {
    switch (errorType) {
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          message: "The verification code you entered is incorrect. Please try again.",
        };
      case "OAuthSignin":
        return {
          title: "OAuth Error",
          message: "There was an error signing in with your OAuth provider. Please try again.",
        };
      case "OAuthCallback":
        return {
          title: "OAuth Callback Error",
          message: "There was an error processing your OAuth login. Please try again.",
        };
      case "OAuthCreateAccount":
        return {
          title: "Account Creation Error",
          message: "Unable to create your account. Please try again.",
        };
      case "EmailCreateAccount":
        return {
          title: "Email Account Error",
          message: "Unable to create account with this email. Please try again.",
        };
      case "Callback":
        return {
          title: "Callback Error",
          message: "There was an error during the authentication process.",
        };
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          message: "This account is already associated with another login method.",
        };
      case "EmailSignin":
        return {
          title: "Email Error",
          message: "Unable to send verification email. Please try again.",
        };
      case "CredentialsSignup":
        return {
          title: "Signup Error",
          message: "Unable to create your account. Please check your details.",
        };
      case "SessionRequired":
        return {
          title: "Session Required",
          message: "You need to be signed in to access this page.",
        };
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during login. Please try again.",
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="text-center text-white max-w-md mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4 text-red-400">{errorInfo.title}</h1>
        <p className="text-gray-300 mb-8">{errorInfo.message}</p>

        {error && (
          <div className="bg-gray-900 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-400">Error Code:</p>
            <p className="text-red-400 font-mono">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/">
            <button className="w-full relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 via-orange-500 to-red-600 p-[2px] opacity-0 transition-opacity duration-500 hover:opacity-100"></span>
              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="transition-all duration-500 hover:translate-x-1">Try Again</span>
                  <svg className="w-5 h-5 transition-transform duration-500 hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
              </span>
            </button>
          </Link>

          <Link href="/">
            <button className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 rounded-xl">
              Go to Homepage
            </button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you continue to experience issues, please contact support.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <LoginErrorContent />
    </Suspense>
  );
}
