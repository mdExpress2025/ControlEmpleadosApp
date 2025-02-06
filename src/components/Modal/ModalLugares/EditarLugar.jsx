"use client"


import { useState } from "react";
import { Modal, Box } from "@mui/material"
import notyf from "@/utils/notificacion";

function ModalEditarLugar  ({ isOpen, onRequestClose, lugar, notificacion })  {
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [precio, setPrecio] = useState("");

    if (!lugar) return null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
    };

    const EditarLugar = async () => {
        if (isEditing) return;

        try {
            setIsEditing(true);

            const cambios = {};
            if (nombre && nombre !== lugar.nombre) cambios.nombre = nombre;
            if (direccion && direccion !== lugar.direccion) cambios.direccion = direccion;
            if (precio && precio !== lugar.precio) cambios.precio = precio;

            if (Object.keys(cambios).length === 0) {
                notyf.error("No se realizaron cambios.");
                setIsEditing(false);
                return;
            }

            const resul = await fetch("/api/Lugares", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lugarId: lugar._id, ...cambios }), 
            });

            onRequestClose();
            setTimeout(() => {
                cambios._id=lugar._id;
                if (resul.status === 200) {
                    notificacion(200,cambios);
                } else {
                    notificacion(400);
                }
                setIsEditing(false);
            }, 100);
        } catch (error) {
            console.error("Error al guardar lugar:", error);
            onRequestClose();
            notificacion(400);
            setIsEditing(false);
        } finally {
            setIsEditing(false);
            setDireccion("")
            setNombre("")
            setPrecio("")
        }
    };


    return (
        <Modal
            open={isOpen}
            onClose={()=>{ setDireccion("");setNombre("");setPrecio("");onRequestClose()}}
        >
            <Box sx={style}>
                <div className="flex flex-col items-center gap-4 bg-slate-300 h-[450px] w-[330px] rounded-xl p-4 text-[15px]">
                    <p className="font-mono text-[9px] text-center">Si desea cambiar solo un valor o dos deje los demas campos vacios, el sistema se encargara de no editar eso.</p>
                    <div className="w-[300px] flex flex-col items-center mt-5">
                        <div className="w-full text-center">
                            <p className="mb-2">Ingrese el nuevo Nombre</p>
                        </div>
                        <input
                            className="rounded-md p-2 w-[220px]"
                            type="text"
                            placeholder={lugar.nombre}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="w-[300px] flex flex-col items-center mt-3">
                        <p className="mb-2">Ingrese la nueva Direccion</p>
                        <input
                            className="rounded-md p-2 w-[220px]"
                            type="text"
                            placeholder={lugar.direccion}
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </div>

                    <div className="w-[300px] flex flex-col items-center mt-3">
                        <p className="mb-2">Ingrese el nuevo Precio por hora</p>
                        <input
                            className="rounded-md p-2 w-[220px]"
                            type="number"
                            placeholder={`$${lugar.precio}`}
                            value={precio}
                            onChange={(e) => {
                                const num = parseFloat(e.target.value);
                                setPrecio(num > 0 ? num : '');
                            }}
                            min="0"
                        />
                    </div>



                    <div className="flex justify-center mt-5">
                        <button className={`border border-white py-2 px-4 rounded-xl ${!isEditing?'hover:bg-white duration-300 hover:scale-105':'opacity-50 cursor-not-allowed'} `}
                            onClick={() => EditarLugar()}
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

export default ModalEditarLugar;