"use client"

import { useState } from "react";
import notyf from "@/utils/notificacion";
import { jwtDecode } from "jwt-decode";

function NuevoEmpleado  (){
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [alias, setAlias] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); 

  const token=sessionStorage.getItem("token");
  const decodetoken= token? jwtDecode(token):null;
  const supervisor=decodetoken? decodetoken:null;
  const GuardarDatos = async () => {
    if (!nombre || !documento || !alias) return notyf.error("Complete todos los campos!!");

    if(!(documento.length==8))return notyf.error("El documento debe tener 8 digitos")

    if (isNaN(Number(documento)) || documento.trim() === "") {
        return notyf.error("El documento debe ser un número y no puede contener letras, símbolos o estar vacío");
      }

    if(documento.includes("."))return notyf.error("El documento no puede contener puntos")
    
    try {
      setIsDisabled(true);
      const Guardar = await fetch("/api/Empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          documento: documento,
          nombre: nombre,
          alias:alias,
          supervisor:{nombre:supervisor.nombre,_id:supervisor.user}
        }),
      });

      if (Guardar.status == 201) {
        notyf.success("Guardado con éxito!!");
        setDocumento("")
        setNombre("")
        setAlias("")
        localStorage.removeItem("empleados");
      } else if (Guardar.status == 400) {
        notyf.error("El empleado ya existe!!");
      }

    } catch (error) {
      console.log("Error al guardar empleado:", error);
    }
     setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
      <div className="flex flex-col items-center gap-4 bg-slate-300 h-[420px] w-[330px] rounded-xl p-4 text-[15px]">
        <div className="w-[300px] flex flex-col items-center mt-5">
          <div className="w-full text-center">
            <p className="mb-2 text-sm">Ingrese el Nombre completo</p>
          </div>
          <input
            className="rounded-md p-2 w-[220px]"
            type="text"
            placeholder="nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-3">
          <p className="mb-2">Ingrese el documento</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="number"
            placeholder="documento..."
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-3">
          <p className="mb-2">Ingrese el alias</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="text"
            placeholder="bancario o billetera virt"
            value={alias}
            onChange={(e)=>setAlias(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-5">
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

export default NuevoEmpleado;
