'use client';

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";

const ChevronDown = dynamic(() => 
  import('lucide-react').then((mod) => mod.ChevronDown), 
  { ssr: false }
);
const LogOut = dynamic(() => 
  import('lucide-react').then((mod) => mod.LogOut), 
  { ssr: false }
);
const Mail = dynamic(() => 
  import('lucide-react').then((mod) => mod.Mail), 
  { ssr: false }
);

export default function Header() {
  const { data, status } = useSession({ required: true });
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="fixed top-0 right-0 p-4">
        <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  if (!data?.user) return null;

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-0 right-0 p-4 z-50 bg-gray-100">
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
              {data.user.name}
            </span>
            {ChevronDown && (
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
          {data.user.image && (
            <Image
            src={data.user.image || "/avatarDef.png"}
            alt={data.user.name || "Profile"}
            width={32}  
            height={32}
            className="rounded-full ring-2 ring-white object-cover"
          />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">

                <div>
                  <p className="font-medium text-gray-800">{data.user.name}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    {Mail && <Mail size={14} />}
                    <p className="truncate">{data.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {signOut();sessionStorage.removeItem("token")}}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              {LogOut && <LogOut size={16} />}
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}