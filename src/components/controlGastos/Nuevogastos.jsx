"use client"

import { useState } from "react";
import notyf from "@/utils/notificacion";
import { jwtDecode } from "jwt-decode";
function NuevoGastos () {
  const [viatico, setViatico] = useState("");
  const [insumos, setInsumos] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantEmpleados, setCantEmpledos] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fecha, setfecha] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }));
  const [isDisabled, setIsDisabled] = useState(false); 

  const token=sessionStorage.getItem("token");
  const decodetoken= token? jwtDecode(token):null;
  const supervisor=decodetoken? decodetoken:null;
  const GuardarDatos = async () => {
    if (!viatico || !insumos || !descripcion||!cantEmpleados||!direccion||!fecha) return notyf.error("Complete todos los campos!!");

    if(cantEmpleados.includes("."))return notyf.error('"cantidad empleados" No puede contener puntos ni coma')

    try {
      setIsDisabled(true);
      const Guardar = await fetch("/api/Gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          viatico,
          insumos,
          descripcion,
          cantEmpleados,
          direccion,
          fecha,
          supervisor:{nombre:supervisor.nombre,_id:supervisor.user}
        }),
      });

      if (Guardar.ok) {
        notyf.success("Guardado con éxito!!");
        setInsumos("")
        setViatico("")
        setDescripcion("")
        setCantEmpledos("")
        setDireccion("")
      }
    } catch (error) {
        notyf.error("Error al guardar gastos")
      console.log("Error al guardar gastos:", error);
    }
     setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
      <div className="flex flex-col items-center gap-4 bg-slate-300 h-[760px] w-[330px] rounded-xl p-4 text-[15px]">

      <div className="w-[300px] flex flex-col items-center mt-5">
          <div className="w-full text-center">
            <p className="mb-2 text-sm">Direccion del lugar</p>
          </div>
          <input
            className="rounded-md p-2 w-[220px]"
            type="text"
            placeholder="ingrese la direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-2">
          <div className="w-full text-center">
            <p className="mb-2 text-sm">Gastos uber</p>
          </div>
          <input
            className="rounded-md p-2 w-[220px]"
            type="number"
            placeholder="Ingrese el monto"
            value={viatico}
            onChange={(e) => setViatico(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-2">
          <p className="mb-2">Gastos insumos</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="number"
            placeholder="Ingrese el monto"
            value={insumos}
            onChange={(e) => setInsumos(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-2">
          <p className="mb-2">Descripcion de gastos</p>
          <textarea
            className="rounded-md p-2 w-[220px]"
            type="text"
            rows="4"
            placeholder="Ingrese una descripcion de de los gastos en insumos"
            value={descripcion}
            onChange={(e)=>setDescripcion(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-2">
          <p className="mb-2">Cantidad empleados</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="number"
            placeholder="Ingrese la cantidad"
            value={cantEmpleados}
            onChange={(e) => setCantEmpledos(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-2">
          <p className="mb-2">Fecha</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="date"
            value={fecha}
            onChange={(e) => setfecha(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-4 ">
          <button
            className={`border border-white py-2 px-4 rounded-xl ${!isDisabled?'hover:bg-white duration-300 hover:scale-105':'opacity-50 cursor-not-allowed'}`}
            onClick={() => GuardarDatos()}
            disabled={isDisabled} 
          >
            {!isDisabled?"Guardar":"Guardando..."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoGastos;
