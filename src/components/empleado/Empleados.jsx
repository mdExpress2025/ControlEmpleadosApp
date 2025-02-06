"use client"

import { Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ModalBorrarEmpleado from "../Modal/ModalEmpleado/BorrarEmpleado";
import notyf from "@/utils/notificacion";
import ModalEditarEmpleados from "../Modal/ModalEmpleado/EditarEmpleado";


function Empleados ()  {
  const TABLE_HEAD = ["Nombre", "Documento", "Alias", "Acciones"];
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const [empleados, setEmpleados] = useState([])
  const [isOpenModalBorrar, setIsOpenModalBorrar] = useState(false)
  const [isOpenModalEditar, setIsOpenModalEditar] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)


  const token = sessionStorage.getItem("token");
  const decodetoken = token ? jwtDecode(token) : null;
  const supervisor = decodetoken?decodetoken:null;

  useEffect(() => {
    const obtenerEmpleados = async () => {
        const traerEmpleados = localStorage.getItem("empleados");
        if (traerEmpleados) {
            const empleadosOrdenados = JSON.parse(traerEmpleados).sort((a, b) => {
                return a.nombre.localeCompare(b.nombre);
            });
            setEmpleados(empleadosOrdenados);
        } else {
            setLoading(true);
            try {
                const response = await fetch(`/api/Empleados?supervisorId=${supervisor.user}`);
                if (response.ok) {
                    const data = await response.json();
                    // Ordenar los empleados antes de guardarlos
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
            } finally {
                setLoading(false);
            }
        }
    };
    obtenerEmpleados();
}, []);


  const itemsPerPage = 5;

  const totalPages = Math.ceil(empleados.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedRows = empleados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const abrirModalBorrar = async (empl) => {
    setEmpleadoSeleccionado(empl)
    setIsOpenModalBorrar(true)
  }
  const cerrarModalBorrar = () => {
    setIsOpenModalBorrar(false)
    setEmpleadoSeleccionado(null)
  }

  const notificacionEliminacion = (notif) => {
    if (notif === 200) {
      setEmpleados((prevEmpleados) =>
        prevEmpleados.filter((empleado) => empleado._id !== empleadoSeleccionado._id)
      );
      localStorage.setItem(
        "empleados",
        JSON.stringify(
          empleados.filter((empleado) => empleado._id !== empleadoSeleccionado._id)
        )
      );
      setEmpleadoSeleccionado(null);
      notyf.success("Empleado eliminado con éxito");
    } else {
      notyf.error("No se pudo eliminar el empleado");
      setEmpleadoSeleccionado(null);
    }
  };

  const abrirModalEditar=(e)=>{
    setEmpleadoSeleccionado(e)
    setIsOpenModalEditar(true)
  }

  const cerrarModalEditar=()=>{
    setIsOpenModalEditar(false)
    setEmpleadoSeleccionado(null)
  }

  
  const notificacionEdicion = (notif,empl) => {
    if (notif === 200) {
      setEmpleados((prev)=>{
        const nuevosEmpleados=prev.map(e=>e._id==empl._id?{...e,...empl}:e)
        localStorage.setItem("empleados",JSON.stringify(nuevosEmpleados));
        return nuevosEmpleados;
      }
      )     
      setEmpleadoSeleccionado(null);
      notyf.success("Empleado editado con éxito");
    } else {
      notyf.error("No se pudo editar el empleado");
      setEmpleadoSeleccionado(null);
    }
  };


  return (
    <div className="h-[900px] bg-gray-100 ">
      <div className="flex justify-center items-center h-[400px] ">
        <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            {(paginatedRows.length > 0) &&
              <table className="min-w-full table-auto border-collapse text-left">
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
                  {paginatedRows.length > 0 && paginatedRows.map((i) => (
                    <tr
                      key={i._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {i.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {i.documento}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {i.alias}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap space-x-2 flex">
                        <button
                          className="flex items-center text-red-600 hover:text-red-900"
                          aria-label="Delete"
                          onClick={() => abrirModalBorrar(i)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Borrar
                        </button>
                        <button
                          className="flex items-center text-orange-400 hover:text-orange-600"
                          aria-label="Editar"
                          onClick={()=>abrirModalEditar(i)}
                        >
                          <Edit className="w-4 h-4 mr-1"/>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>}
            {loading && (
              <div className="flex h-[100px] flex-col items-center justify-center">
                <p className="text-20px">Cargando Empleados...</p>
                <img
                  src="/loanding.svg"
                  alt="Cargando"
                  className="animate-spin"
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                />
              </div>
            )}
            {!loading && (!(paginatedRows.length > 0) && <div className="flex justify-center items-center h-[300px]"> <h2 className="text-2xl text-gray-500">No hay empleados para mostrar</h2></div>)}
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
          </div>
        </div>
      </div>
      <ModalBorrarEmpleado isOpen={isOpenModalBorrar} onRequestClose={cerrarModalBorrar} empleado={empleadoSeleccionado} notificacion={notificacionEliminacion} />
      <ModalEditarEmpleados isOpen={isOpenModalEditar} onRequestClose={cerrarModalEditar} empleado={empleadoSeleccionado} notificacion={notificacionEdicion}/>
    </div>
  );
}

export default Empleados;