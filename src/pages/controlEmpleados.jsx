"use client"


import { useState, useEffect } from "react";
import AgregarControlDiario from "@/components/controlEmpleado/AgregarControl";
import EditarControlDiario from "@/components/controlEmpleado/EditarControlDiario";
import { RouteGuard } from "@/components/RouteGuard";

function GestionControlDiario() {
  const [activeTab, setActiveTab] = useState("AgregarControlDiario");
   
  return (
    <RouteGuard permission="todas">
      <div className="bg-gray-100 flex flex-col items-center justify-center mt-20">
      <div className="container">
        <div className="mb-4">
          <ul className="flex border-b justify-center">
            <li className="">
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "AgregarControlDiario"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("AgregarControlDiario")}
              >
                Agregar Control
              </button>
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "EditarControlDiario"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("EditarControlDiario")}
              >
                Editar Control
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4 w-full max-w-3xl bg-gray-100 rounded-lg ">
        {activeTab === "AgregarControlDiario" && <AgregarControlDiario />}
        {activeTab === "EditarControlDiario" && <EditarControlDiario />}
      </div>
    </div>
    </RouteGuard>
  );
}

export default GestionControlDiario;