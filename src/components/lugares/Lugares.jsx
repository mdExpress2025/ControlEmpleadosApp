"use client"

import { Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ModalBorrarLugar from "../Modal/ModalLugares/BorrarLugar";
import ModalEditarLugar from "../Modal/ModalLugares/EditarLugar";
import notyf from "@/utils/notificacion";


function Lugares (){
  const TABLE_HEAD = ["Nombre", "Direccion","Tipo de Lugar", "Precio", "Acciones"];
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const [lugares, setLugares] = useState([])
  const [isOpenModalBorrar, setIsOpenModalBorrar] = useState(false)
  const [isOpenModalEditar, setIsOpenModalEditar] = useState(false)
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null)

  const token = sessionStorage.getItem("token");
  const decodetoken = token ? jwtDecode(token) : null;
  const supervisorId = decodetoken?.user;

  useEffect(() => {
    const obtenerLugares = async () => {
      const traerLugares = localStorage.getItem("lugares");
      if (traerLugares) {
        const lugaresOrdenados=JSON.parse(traerLugares).sort((a,b)=>{
          return a.nombre.localeCompare(b.nombre)
        })
        setLugares(lugaresOrdenados);
      } else {
        setLoading(true)
        try {
          const response = await fetch(`/api/Lugares?supervisorId=${supervisorId}`);
          if (response.ok) {
            const data = await response.json();
            const empleadosOrdenados=data.Lugares.sort((a,b)=>{return a.nombre.localeCompare(b.nombre)})
            setLugares(empleadosOrdenados);
            localStorage.setItem("lugares", JSON.stringify(empleadosOrdenados));
          } else {
            console.error("Error al obtener los empleados de la API");
          }
        } catch (error) {
          console.error("Error al conectar con la API:", error);
        }
        finally {
          setLoading(false)
        }
      }
    }
    obtenerLugares();
  }, []);


  const itemsPerPage = 5;

  // Manejo de totalPages asegurando que lugares sea un arreglo
  const totalPages = Math.ceil((lugares?.length || 0) / itemsPerPage);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedRows = lugares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const abrirModalBorrar = (lugar) => {
    setLugarSeleccionado(lugar);
    setIsOpenModalBorrar(true)
  }

  const cerrarModalBorrar = () => {
    setLugarSeleccionado(null);
    setIsOpenModalBorrar(false)
  }
  const abrirModalEditar = (lugar) => {
    setLugarSeleccionado(lugar);
    setIsOpenModalEditar(true)
  }

  const cerrarModalEditar = () => {
    setLugarSeleccionado(null);
    setIsOpenModalEditar(false)
  }


  const notificacionBorrar = (notif) => {
    if (notif == 200) {
      setLugares(prev => prev.filter(l => l._id != lugarSeleccionado._id))
      localStorage.setItem(
        "lugares",
        JSON.stringify(
          lugares.filter((l) => l._id !== lugarSeleccionado._id)
        )
      );
      setLugarSeleccionado(null)
      notyf.success("Lugar borrado con exito!")
    } else {
      notyf.error("No se pudo eliminar el lugar")
      setLugarSeleccionado(null)
    }
  }

  const notificacionEditar = (notif, lugarEditado) => {
    if (notif == 200) {
      setLugares((prev) => {
        const nuevosLugares = prev.map((l) =>
            l._id === lugarEditado._id
                ? { ...l, ...lugarEditado }
                : l
        );
        localStorage.setItem("lugares", JSON.stringify(nuevosLugares));
        return nuevosLugares; 
    });
      setLugarSeleccionado(null)
      notyf.success("Lugar editado con exito!")
    } else {
      notyf.error("No se pudo editar el lugar")
      setLugarSeleccionado(null)
    }
  }



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
                        {i.direccion}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {i.tipoLugar}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${i.precio}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap space-x-2 flex">
                        <button
                          className="flex items-center text-red-600 hover:text-red-900"
                          aria-label="Borrar"
                          onClick={() => abrirModalBorrar(i)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Borrar
                        </button>

                        <button
                          className="flex items-center text-orange-400 hover:text-orange-600"
                          aria-label="Editar"
                          onClick={() => abrirModalEditar(i)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>}
            {loading && (
              <div className="flex h-[100px] flex-col items-center justify-center">
                <p className="text-20px">Cargando Lugares...</p>
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
            {!loading && (!(paginatedRows.length > 0) && <div className="flex justify-center items-center h-[300px]"> <h2 className="text-2xl text-gray-500">No hay lugares para mostrar</h2></div>)}
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
      <ModalBorrarLugar onRequestClose={cerrarModalBorrar} isOpen={isOpenModalBorrar} lugar={lugarSeleccionado} notificacion={notificacionBorrar} />
      <ModalEditarLugar onRequestClose={cerrarModalEditar} isOpen={isOpenModalEditar} lugar={lugarSeleccionado} notificacion={notificacionEditar} />
    </div>
  );
}
export default Lugares;