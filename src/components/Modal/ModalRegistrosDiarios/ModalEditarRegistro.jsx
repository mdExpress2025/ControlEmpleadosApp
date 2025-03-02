"use client"

import { useState } from "react";
import { Modal, Box } from "@mui/material"
import notyf from "@/utils/notificacion";
import { X } from "lucide-react";
function ModalEditarRegistro({ isOpen, onRequestClose, registro, notificacion }) {


    if (!registro) return null;

    const [horas, setHoras] = useState("")
    const [adelanto, setAdelanto] = useState("")
    const [presentismo, setPresentismo] = useState("")
    const [boleto, setBoleto] = useState("")
    const [fecha, setFecha] = useState("");
    const [id, setid] = useState(registro._id);
    const [isDisabled, setIsDisabled] = useState(false)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
    };

    const editarRegistro = async () => {
        if (isDisabled) return;
        if (!horas && !adelanto && !fecha && !presentismo) return notyf.error("No se realizaron cambios")
        try {
            setIsDisabled(true);
            const resul = await fetch("/api/RegistrosDiarios", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        id: registro._id,
                        horas: horas ? horas : registro.horas,
                        adelanto: adelanto ? adelanto : registro.adelanto,
                        fecha: fecha ? fecha : registro.fecha,
                        precio: registro.lugar.precio,
                        presentismo: presentismo ? presentismo : registro.presentismo,
                        boleto:boleto?boleto:registro.boleto
                    }),
            });
            onRequestClose();
            setTimeout(() => {
                if (resul.ok) {
                    const horasFloat = horas ? parseFloat(horas) : parseFloat(registro.horas)
                    const total = parseFloat(registro.lugar.precio) * horasFloat;
                    const fechaForm = new Date(fecha ? fecha : registro.fecha)
                    notificacion(200, { _id: id, horas: horas ? horas : registro.horas, adelanto: adelanto ? adelanto : registro.adelanto, fecha: fechaForm, total: total })
                } else {
                    notificacion(400)
                }
            }, 100);
        } catch (error) {
            console.error("Error al Editar empleado:", error);
            onRequestClose();

            setIsEditing(false);
        } finally {
            setIsDisabled(false)
        }
    };

    const ultimoDiaDelMesActualFun = () => {
        if (!registro?.fecha) return false;

        const fechainforme = new Date(registro.fecha);

        const fechaUTC = new Date(fechainforme.getUTCFullYear(), fechainforme.getUTCMonth(), fechainforme.getUTCDate());


        const ultimoDiaDelMesActual = new Date(
            fechaUTC.getFullYear(),
            fechaUTC.getMonth() + 1,
            0
        );

        return (
            fechaUTC.getFullYear() === ultimoDiaDelMesActual.getFullYear() &&
            fechaUTC.getMonth() === ultimoDiaDelMesActual.getMonth() &&
            fechaUTC.getDate() === ultimoDiaDelMesActual.getDate()
        );
    };



    return (
        <Modal
            open={isOpen}
            onClose={() => { setFecha(""); setHoras(""); setAdelanto(""); setid(""); onRequestClose() }}
        >
            <Box sx={style}>
                <div className="App flex  items-center  overflow-hidden font-mono">

                    <div className="flex flex-col items-center gap-4 bg-slate-300 h-[660px] w-[330px] rounded-xl p-4 text-[15px]">
                        <div className="flex justify-end">
                            <button
                                disabled={isDisabled}
                                onClick={onRequestClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="w-[300px] flex flex-col items-center">
                            <p className="text-center text-[10px]">Rellene los campos que desea editar, en caso de no querer cambiar todos deje vacio esos campos</p>
                            <div className="w-full text-center m-5">
                                <p className="mb-2 text-sm">
                                    Ingrese las horas trabajadas de <b>{registro.empleado.nombre}</b>
                                </p>
                            </div>
                            <input
                                className="rounded-md p-2 w-[220px]"
                                type="number"
                                min={1}
                                placeholder={registro.horas}
                                onChange={(e) => { let hora = e.target.value; if (Number(hora) >= 0) { setHoras(e.target.value) } else setHoras("") }}
                                value={horas}
                            />
                        </div>

                        <div className="w-[300px] flex flex-col items-center mt-3">
                            <p className="mb-2">Ingrese la fecha</p>
                            <input
                                className="rounded-md p-2 w-[220px]"
                                type="date"
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>

                        <div className="w-[300px] flex flex-col items-center">
                            <div className="w-full text-center">
                                <p className="mb-2 text-sm">
                                    Ingrese adelanto de sueldo</p>
                            </div>
                            <input
                                className="rounded-md p-2 w-[220px]"
                                type="number"
                                placeholder={registro.adelanto}
                                onChange={(e) => { let a = e.target.value; if (Number(a) >= 0) { setAdelanto(e.target.value) } else setAdelanto("") }}
                                min={1}
                                value={adelanto}
                            />
                        </div>

                        {ultimoDiaDelMesActualFun() && <div>



                            <div className="flex flex-col items-center w-full mt-3">
                                <p className="mb-2">Presentimo</p>
                                <select className="border rounded-md p-2 w-[220px] "
                                    defaultValue=""
                                    onChange={(e) => setPresentismo(e.target.value)} >
                                    <option value="" disabled>
                                        Seleccione una opción
                                    </option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="w-[300px] flex flex-col items-center mt-4">
                                <div className="w-full text-center">
                                    <p className="mb-2 text-sm">
                                        Ingrese boleto InterUrb</p>
                                </div>
                                <input
                                    className="rounded-md p-2 w-[220px]"
                                    type="number"
                                    placeholder={registro.boleto}
                                    onChange={(e) => { let a = e.target.value; if (Number(a) >= 0) { setBoleto(e.target.value) } else setBoleto("") }}
                                    min={0}
                                    value={boleto}
                                />
                            </div>
                        </div>

                        }




                        <div className="flex justify-center mt-5">
                            <button className={`border border-white py-2 px-4 rounded-xl ${!isDisabled ? 'hover:bg-white duration-300 hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                                onClick={() => editarRegistro()}
                                disabled={isDisabled}>
                                {!isDisabled ? "Guardar" : "Guardando..."}
                            </button>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalEditarRegistro;