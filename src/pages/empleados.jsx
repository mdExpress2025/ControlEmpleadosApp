"use client"


import { useState, useEffect } from "react";
import Empleados from "@/components/empleado/Empleados";
import NuevoEmpleado from "@/components/empleado/NuevoEmpelado";
import { RouteGuard } from "@/components/RouteGuard";

function GestionEmpleados() {
  const [activeTab, setActiveTab] = useState("Empleados");
   
  return (
    <RouteGuard permission="todas">
      <div className="bg-gray-100 flex flex-col items-center justify-center mt-20">
      <div className="container">
        <div className="mb-4">
          <ul className="flex border-b justify-center">
            <li className="">
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "Empleados"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Empleados")}
              >
                Ver Empleados
              </button>
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "Agregar Empleado"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Agregar Empleado")}
              >
                Agregar Empleado
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4 w-full max-w-3xl bg-gray-100 rounded-lg ">
        {activeTab === "Empleados" && <Empleados />}
        {activeTab === "Agregar Empleado" && <NuevoEmpleado />}
      </div>
    </div>
    </RouteGuard>
  );
}

export default GestionEmpleados;