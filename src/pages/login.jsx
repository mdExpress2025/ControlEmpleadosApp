"use client"
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { callbackUrl, error: queryError } = router.query;

  useEffect(() => {
    if (queryError) {
      setError("No tienes autorización para acceder a esta plataforma.");
    }
  }, [queryError]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("google", {
        callbackUrl: callbackUrl || "/",
        redirect: false,
      });

      if (result?.error) {
        setError("No tienes autorización para acceder a esta plataforma.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido</h1>
        <p className="text-gray-600 mb-6">
          Inicia sesión con tu cuenta de Google para acceder a la plataforma.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleLogin}
          className={`w-full py-3 px-4 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-gray-700 hover:text-white"
          } text-gray-600 font-semibold rounded-xl border border-gray-600 transition duration-300 relative`}
          disabled={isLoading}
        >
          <div className="flex justify-center items-center gap-3">
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <img src="/googleIcon.png" alt="icon google" className="h-[25px]" />
            )}
            <p className="text-center">
              Inicia sesión con Google
            </p>
          </div>
        </button>
      </motion.div>
    </div>
  );
}