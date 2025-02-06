"use client";

import React, { useState } from "react";
import { Menu, X, MapPin, ScrollText, Joystick, Users,Receipt,User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { useSession } from "next-auth/react";

const SideBar = ({ disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { icon: <Users className="w-6 h-6" />, label: 'Empleados', link: '/empleados', permission: 'todas' },
    { icon: <MapPin className="w-6 h-6" />, label: 'Lugares', link: '/lugares', permission: 'todas' },
    { icon: <Joystick className="w-6 h-6" />, label: 'Control Empleados', link: '/controlEmpleados', permission: 'todas' },
    { icon: <ScrollText className="w-6 h-6" />, label: 'Informe', link: '/informe', permission: 'todas' },
    { icon: <ScrollText className="w-6 h-6" />, label: 'Informes Pasados', link: '/informesPasados', permission: 'todas' },  
    { icon: <Receipt className="w-6 h-6" />, label: 'Control Gastos', link:'/controlGastos', permission: 'todas' },
    { icon: <User className="w-6 h-6" />, label: 'Usuarios', link: '/usuarios', permission:'usuarios' },
    { icon: <Joystick className="w-6 h-6" />, label: 'Panel de Control', link: '/panelControl', permission: 'usuarios' },
  ];

  const hasPermission = (permission) => {
    if (!permission) return true;
    return PERMISSIONS[permission]?.includes(session?.user?.role);
  };

  const filteredMenuItems = menuItems.filter(item =>
    hasPermission(item.permission)
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out font-mono ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:block`}
      >
        <div className="flex flex-col p-4 space-y-4 mt-[50px]">

          {filteredMenuItems.map((item, index) => (
            <Link
              href={disabled ? "#" : item.link}
              key={index}
              className={`flex items-center font-mono space-x-2 p-2 rounded-md ${disabled ? "cursor-not-allowed text-gray-400" : "hover:bg-gray-200"
                } ${pathname === item.link && !disabled ? "bg-gray-200" : ""}`}
              onClick={(e) => {
                if (disabled) e.preventDefault();
                else setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </ Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
