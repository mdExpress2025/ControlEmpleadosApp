"use client"


import { useState, useEffect } from "react";
import Usuarios from "@/components/usuarios/Usuarios";
import AgregarUsuario from "@/components/usuarios/NuevoUsuario";
import { RouteGuard } from "@/components/RouteGuard";


function GestionUsuarios() {
  const [activeTab, setActiveTab] = useState("Usuarios");

  return (
    <RouteGuard permission="usuarios">
       <div className="bg-gray-100 flex flex-col items-center justify-center mt-20">
      <div className="container">
        <div className="mb-4">
          <ul className="flex border-b justify-center">
            <li className="">
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "Usuarios"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Usuarios")}
              >
                Ver Usuarios
              </button>
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "Agregar usuarios"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Agregar usuarios")}
              >
                Agregar usuarios
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-4 w-full max-w-3xl bg-gray-100 rounded-lg ">
        {activeTab === "Usuarios" && <Usuarios />}
        {activeTab === "Agregar usuarios" && <AgregarUsuario />}
      </div>
    </div>
    </RouteGuard>
  );
}

export default GestionUsuarios;