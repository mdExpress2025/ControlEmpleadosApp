"use client"

import { useState } from "react";
import { Modal, Box } from "@mui/material"
import notyf from "@/utils/notificacion";

function ModalEditarEmpleados  ({ isOpen, onRequestClose,empleado, notificacion })  {
    const [isEditing, setIsEditing] = useState(false);
    const [alias, setAlias] = useState("");

    if (!empleado) return null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
    };

    const EditarEmpleado = async () => {
        if (isEditing) return;

        try {
            setIsEditing(true);
           
            const cambios = {};
            if (alias && alias !== empleado.alias) cambios.alias = alias;

            if (Object.keys(cambios).length === 0) {
                notyf.error("No se realizaron cambios.");
                setIsEditing(false);
                return;
            }

            const resul = await fetch("/api/Empleados", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { empleadoId: empleado._id,
                      alias: alias                      
                    }), 
            });
            onRequestClose();
            setTimeout(() => {
                cambios._id=empleado._id;
                if (resul.status === 200) {
                    notificacion(200,cambios);
                } else {
                    notificacion(400);
                }
                setIsEditing(false);
            }, 100);
        } catch (error) {
            console.error("Error al Editar empleado:", error);
            onRequestClose();
            notificacion(400);
            setIsEditing(false);
        } finally {
            setIsEditing(false);
            setAlias("")         
        }
    };


    return (
        <Modal
            open={isOpen}
            onClose={()=>{setAlias(""); onRequestClose()}}
        >
            <Box sx={style}>
                <div className="flex flex-col items-center gap-4 bg-slate-300 h-[220px] w-[260px] rounded-xl p-4 text-[15px]">

                    <div className="w-[280px] flex flex-col items-center mt-3">
                        <p className="mt-1">Ingrese el nuevo Alias</p>
                        <input
                            className="rounded-md mt-5 p-2 w-[220px]"
                            type="text"
                            placeholder={empleado.alias}
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center mt-5">
                        <button className={`border border-white py-2 px-4 rounded-xl ${!isEditing?'hover:bg-white duration-300 hover:scale-105':'opacity-50 cursor-not-allowed'} `}
                            onClick={() => EditarEmpleado()}
                            disabled={isEditing}
                        >
                            {isEditing?"Editando...": "Editar"}
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalEditarEmpleados;