"use client"

import { Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import notyf from "@/utils/notificacion";
import ModalBorrarUsuario from "../Modal/ModalUsuario/BorrarUsuario";
import ModalEditarUsuario from "../Modal/ModalUsuario/EditarUsuario";



function Usuarios () {
  const TABLE_HEAD = ["Nombre Compl", "Correo", "Rol", "Acciones"];
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [isOpenModalBorrar, setIsOpenModalBorrar] = useState(false)
  const [isOpenModalEditar, setIsOpenModalEditar] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)



  useEffect(() => {
    const obtenerEmpleados = async () => {
        const usuar = localStorage.getItem("usuarios");
        if (usuar) {
            setUsuarios(JSON.parse(usuar)); 
        } else {
            setLoading(true);
            try {
                const response = await fetch(`/api/Usuarios`);
                if (response.ok) {
                    const data = await response.json();
                    setUsuarios(data.usuarios);
                    localStorage.setItem("usuarios", JSON.stringify(data.usuarios));
                } else {
                    console.error("Error al obtener los usuarios de la API");
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

  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedRows = usuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const abrirModalBorrar = async (usu) => {
    setUsuarioSeleccionado(usu)
    setIsOpenModalBorrar(true)
  }
  const cerrarModalBorrar = () => {
    setIsOpenModalBorrar(false)
    setUsuarioSeleccionado(null)
  }

  const notificacionEliminacion = (notif) => {
    if (notif === 200) {
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((u) => u._id !== usuarioSeleccionado._id)
      );
      localStorage.setItem(
        "usuarios",
        JSON.stringify(
          usuarios.filter((u) => u._id !== usuarioSeleccionado._id)
        )
      );
      setUsuarioSeleccionado(null);
      notyf.success("Usuario eliminado con éxito");
    } else {
      notyf.error("No se pudo eliminar el Usuario");
      setUsuarioSeleccionado(null);
    }
  };

  const abrirModalEditar=(u)=>{
    setUsuarioSeleccionado(u)
    setIsOpenModalEditar(true)
  }

  const cerrarModalEditar=()=>{
    setIsOpenModalEditar(false)
    setUsuarioSeleccionado(null)
  }

  
  const notificacionEdicion = (notif,usu) => {
    if (notif === 200) {
      setUsuarios((prev)=>{
        const nuevosUsuarios=prev.map(u=>u._id==usu._id?{...u,...usu}:u)
        localStorage.setItem("usuarios",JSON.stringify(nuevosUsuarios));
        return nuevosUsuarios;
      }
      )     
      setUsuarioSeleccionado(null);
      notyf.success("Usuario editado con éxito");
    } else {
      notyf.error("No se pudo editar el Usuario");
      setUsuarioSeleccionado(null);
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
                        {i.user}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {i.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {i.role}
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
                <p className="text-20px">Cargando Usuarios...</p>
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
            {!loading && (!(paginatedRows.length > 0) && <div className="flex justify-center items-center h-[300px]"> <h2 className="text-2xl text-gray-500">No hay Usuarios para mostrar</h2></div>)}
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
        <ModalBorrarUsuario isOpen={isOpenModalBorrar} onRequestClose={cerrarModalBorrar} usuario={usuarioSeleccionado} notificacion={notificacionEliminacion}/>
        <ModalEditarUsuario isOpen={isOpenModalEditar} onRequestClose={cerrarModalEditar} usuario={usuarioSeleccionado} notificacion={notificacionEdicion}/>
    </div>
  );
}

export default Usuarios;