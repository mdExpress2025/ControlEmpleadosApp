"use client"

import { useState } from "react";
import { Modal, Box } from "@mui/material"

function ModalBorrarInformePasados ({ isOpen,onRequestClose,informe, notificacion }) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!informe) return null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius:'20px',
        boxShadow: 24,
        p: 4,
    };

    const eliminarInforme = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/Informe?informeId=${informe._id}`, {
                method: "DELETE"
            });

            onRequestClose();
            setTimeout(() => {
                if (response.status === 200) {
                    notificacion(200);
                } else {
                    notificacion(400);
                }
                setIsDeleting(false);
            }, 100);

        } catch (error) {
            console.error("Error al eliminar informe:", error);
            onRequestClose();
            notificacion(400);
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
        >
            <Box sx={style}>
                <div className="h-[190px] w-[160px] rounded-[10px] font-mono">
                    <div className="flex justify-end">
                        <button
                            className="border border-black px-[8px] rounded-[10px] hover:scale-105 transition-transform duration-300"
                            onClick={onRequestClose}
                            disabled={isDeleting}
                        >
                            X
                        </button>
                    </div>
                    <h3 className="mt-2 mb-4">
                        ¿Estás seguro de eliminar el informe con la fecha <b>{informe.fechaInforme}</b>?
                    </h3>
                    <div className="flex justify-center">
                        <button
                            onClick={eliminarInforme}
                            disabled={isDeleting}
                            className={`
                            bg-green-600 py-1 px-[20px] mr-4 rounded-[10px] 
                            ${!isDeleting ? 'hover:scale-105 hover:bg-green-800' : 'opacity-50 cursor-not-allowed'} 
                            transition-transform duration-300
                        `}
                        >
                            {isDeleting ? 'Eliminando...' : 'SÍ'}
                        </button>
                        {
                            !isDeleting ? (<button
                                disabled={isDeleting}
                                onClick={onRequestClose}
                                className={`
                                bg-red-600 py-1 px-4 rounded-[10px]
                                ${!isDeleting ? 'hover:scale-105 hover:bg-red-800' : 'opacity-50 cursor-not-allowed'}
                                transition-transform duration-300
                            `}
                            >
                                NO
                            </button>) : ""
                        }

                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalBorrarInformePasados;





