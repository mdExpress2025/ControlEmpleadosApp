"use client"

import { useState } from "react";
import InformeGastos from "@/components/controlGastos/InformeGastos";
import NuevoGastos from "@/components/controlGastos/Nuevogastos";
import { RouteGuard } from "@/components/RouteGuard";

function GestionControlGastos() {
  const [activeTab, setActiveTab] = useState("Informe Gastos");

  return (

    <RouteGuard permission="todas">
      <div className="bg-gray-100 flex flex-col items-center justify-center mt-20">
        <div className="container">
          <div className="mb-4">
            <ul className="flex border-b justify-center">
              <li className="">
                <button
                  className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${activeTab === "Informe Gastos"
                      ? "text-white bg-slate-500"
                      : "text-gray-500 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("Informe Gastos")}
                >
                  Ver Informe Gastos
                </button>
                <button
                  className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${activeTab === "Agregar Gastos"
                      ? "text-white bg-slate-500"
                      : "text-gray-500 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("Agregar Gastos")}
                >
                  Agregar Gastos
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="p-4 w-full max-w-3xl bg-gray-100 rounded-lg ">
          {activeTab === "Informe Gastos" && <InformeGastos />}
          {activeTab === "Agregar Gastos" && <NuevoGastos />}
        </div>
      </div>
    </RouteGuard>
  );
}

export default GestionControlGastos;