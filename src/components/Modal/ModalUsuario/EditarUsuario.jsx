"use client"

import { useState,useEffect } from "react";
import { Modal, Box } from "@mui/material"
import { ROLES } from "@/config/permissions";
import { X } from "lucide-react";

function ModalEditarUsuario({ isOpen, onRequestClose, usuario, notificacion }) {
    if (!usuario) return null;

    const [editing, setEditing] = useState(false);
    const [rolesDis, setRolesDis] = useState([])
    const [role, setRole] = useState(null)
    useEffect(() => {
        if (usuario?.role) {
            setRolesDis(Object.values(ROLES).filter(role => role !== usuario.role));
        } else {
            setRolesDis([]);
        }
    }, [usuario]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
    };

    const EditarLugar = async () => {
        if (editing) return;

        try {
            setEditing(true);

            const resul = await fetch("/api/Usuarios", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId: usuario._id,role:role}),
            });

            onRequestClose();
            setTimeout(() => {
                if (resul.status === 200) {
                    notificacion(200);
                } else {
                    notificacion(400);
                }
                setIsEditing(false);
            }, 100);
        } catch (error) {
            console.error("Error al editar usuario:", error);
            onRequestClose();
            notificacion(400);
        } finally {
            setEditing(false);
            setRole("")
        }
    };


    return (
        <Modal
            open={isOpen}
            onClose={() => { ; setRole(""); onRequestClose() }}
        >
            <Box sx={style}>

                <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex justify-end items-center mb-4">
                        <button
                            disabled={editing}
                            onClick={onRequestClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className='flex justify-center items-center'>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Editar usuario
                        </h3>
                    </div>
                    <div className='flex justify-center flex-col gap-2 mt-4'>
                        <input
                            id="text"
                            required
                            value={usuario.email}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors opacity-50 cursor-not-allowed"
                            disabled
                        />
                        <select name="" id=""
                            onChange={(e) => setRole(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors cursor-pointer' defaultValue="">
                            <option value="" disabled>Seleccione un rol</option>
                            {rolesDis.map((r, index) =>
                                <option key={index} value={r}>{r}</option>
                            )}
                        </select>
                        <button
                            onClick={() => EditarLugar()}
                            type="submit"
                            disabled={editing}
                            className={`w-full py-3 mt-5 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                                ${editing ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} 
                                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                        >
                            {editing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalEditarUsuario;