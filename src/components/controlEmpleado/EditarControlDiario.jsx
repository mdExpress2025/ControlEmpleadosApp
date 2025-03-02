"use client"

import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import notyf from "@/utils/notificacion";
import {  Edit } from "lucide-react"
import ModalEditarRegistro from "../Modal/ModalRegistrosDiarios/ModalEditarRegistro";

export default function EditarControlDiario() {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isOpenModalEditar, setIsOpenModalEditar] = useState(false);
    const [isOpenModalBorrar, setIsOpenModalBorrar] = useState(false);
    const [SelectEmpl, setSelectEmple] = useState("");
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [empleados, setEmpleados] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [registroSelec, setRegistroSelec] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const token = sessionStorage.getItem("token");
    const decodetoken = token ? jwtDecode(token) : null;
    const supervisor = decodetoken ? decodetoken : null;
    const TABLE_HEAD = ["Empleado", "Lugar", "Fecha", "Prec/hr", "Horas", "Adelanto", "Total","Presentismo","Boleto I.U", "Editar"];


    useEffect(() => {
        const obtenerEmpleados = async () => {
            const traerEmpleados = localStorage.getItem("empleados");
            if (traerEmpleados) {
                const empleadosOrdenados = JSON.parse(traerEmpleados).sort((a, b) => {
                    return a.nombre.localeCompare(b.nombre);
                });
                setEmpleados(empleadosOrdenados);
            } else {

                try {
                    const response = await fetch(`/api/Empleados?supervisorId=${supervisor.user}`);
                    if (response.ok) {
                        const data = await response.json();
                        const empleadosOrdenados = data.Empleados.sort((a, b) => {
                            return a.nombre.localeCompare(b.nombre);
                        });
                        setEmpleados(empleadosOrdenados);
                        localStorage.setItem("empleados", JSON.stringify(empleadosOrdenados));
                    } else {
                        console.error("Error al obtener los empleados de la API");
                    }
                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                }
            }
        };
        obtenerEmpleados();
    }, []);

    const notificacionEdicion = (notif,regis) => {
        if (notif === 200) {
          setRegistros((prev)=>{
            const nuevoRegistro=prev.map(e=>e._id==regis._id?{...e,...regis}:e)
            return nuevoRegistro;
          }
          )     
          setRegistroSelec(null);
          notyf.success("Registro editado con éxito");
        } else {
          notyf.error("No se pudo editar el registro");
          setRegistroSelec(null);
        }
      };

    const itemsPerPage = 5;

    const totalPages = Math.ceil(registros.length || 0 / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedRows = registros.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const isValidDate = (date) => {
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate);
    };

    const handleSubmit = async () => {
        const fechahoy = new Date().toISOString().split('T')[0];
        if (!fechaFin || !fechaIni || fechaIni > fechaFin || fechaFin > fechahoy || !isValidDate(fechaIni) || !isValidDate(fechaFin)) return notyf.error("Ingrese fechas válidas");

        if (!SelectEmpl) return notyf.error("Seleccione un empleado");

        setIsDisabled(true);

        try {
            const res = await fetch(`/api/TraerRegistrosPorFecha?fechaIni=${fechaIni}&fechaFin=${fechaFin}&empleadoId=${SelectEmpl._id}&supervisorId=${supervisor.user}`, {
                method: "GET",
            })

            if (res.ok) {
                const data = await res.json();
                setRegistros(data.registros);
                notyf.success("Registros encontrados")
            } else if (res.status === 404) {
                notyf.error("No se encontraron datos para esa fecha")
            }
        } catch (error) {
            console.log(error);
        }
        setIsDisabled(false)

    }

    const AbrilModal=(r)=>{
        setRegistroSelec(r);
        setIsOpenModalEditar(true);
    }
    const cerrarModal=(r)=>{
        setRegistroSelec(null);
        setIsOpenModalEditar(false);
    }

    return (

        <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono bg-gray-100">
            <div className="flex flex-col items-center gap-4 bg-slate-300 h-[440px] w-[330px] rounded-xl p-4 text-[15px]">

                <div className="flex justify-center w-full mt-5">
                    <select
                        defaultValue=""
                        className="border rounded-md p-2 w-[300px]"
                        onChange={(e) => {
                            const empleadoSeleccionado = JSON.parse(e.target.value);
                            setSelectEmple(empleadoSeleccionado);
                        }}
                    >
                        <option value="" disabled>
                            Seleccione un empleado
                        </option>
                        {empleados.length > 0 &&
                            empleados.map((e) => (
                                <option key={e.documento} value={JSON.stringify(e)}>
                                    {e.nombre.toUpperCase()}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="w-[300px] flex flex-col items-center mt-5">
                    <div className="w-full text-center">
                        <p className="mb-2">Ingrese fecha de inicio</p>
                    </div>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="date"
                        onChange={(e) => setFechaIni(e.target.value)}
                    />
                </div>

                <div className="w-[300px] flex flex-col items-center mt-3">
                    <p className="mb-2">Ingrese fecha de fin</p>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="date"
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>



                <div className="flex justify-center mt-5">
                    <button
                        className={`border border-white py-2 px-4 rounded-xl ${!isDisabled ? 'hover:bg-white duration-300 hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={isDisabled}
                        onClick={handleSubmit}
                    >
                        {!isDisabled ? "Buscar datos" : "Buscando..."}
                    </button>
                </div>

            </div>
            {(paginatedRows.length > 0) &&
                <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg mt-[40px]">
                    <div className="overflow-x-auto">

                        <table className="min-w-full table-auto border-collapse ">
                            <thead className="bg-gray-100">
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedRows.length > 0 && paginatedRows.map((r) => {
                                    const fechaForm = new Date(r.fecha).toISOString().split("T")[0];
                                    return(
                                        <tr
                                            key={r._id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                {r.empleado.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {r.lugar.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {fechaForm}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                ${r.lugar.precio}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {r.horas}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                ${r.adelanto}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                ${r.total}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {r.presentismo}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {r.boleto}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap space-x-2 flex">
                                                <button
                                                    className="flex items-center text-orange-400 hover:text-orange-600"
                                                    aria-label="Editar"
                                                    onClick={()=>AbrilModal(r)}
                                                >
                                                    <Edit className="w-4 h-4 mr-1" 
                                                    />
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>

                    </div>
                </div>
            }
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`mx-1 px-3 py-1 text-sm ${currentPage === index + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                                } rounded`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
            <ModalEditarRegistro isOpen={isOpenModalEditar} onRequestClose={cerrarModal} registro={registroSelec} notificacion={notificacionEdicion}/>

        </div>
    )
}