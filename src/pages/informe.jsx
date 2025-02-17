"use client"

import { useState } from "react";
import notyf from "@/utils/notificacion";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jwtDecode } from "jwt-decode";
import { RouteGuard } from "@/components/RouteGuard";

function Informe() {
    const [loading, setLoading] = useState(false);
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [registroDiario, setRegistroDiario] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    const token = sessionStorage.getItem("token");
    const decodetoken = token ? jwtDecode(token) : null;
    const supervisorId = decodetoken?.user;

    const isValidDate = (date) => {
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate);
    };

    const GenerarInforme = async () => {


        const fechahoy = new Date().toISOString().split('T')[0];
        if (!fechaFin || !fechaIni || fechaIni > fechaFin || fechaFin > fechahoy || !isValidDate(fechaIni) || !isValidDate(fechaFin)) return notyf.error("Ingrese fechas válidas");

        setIsDisabled(true);
        setLoading(true);
        try {
            const response = await fetch(`/api/RegistrosDiarios?fechaIni=${fechaIni}&fechaFin=${fechaFin}&supervisorId=${supervisorId}`);
            if (response.ok) {
                const data = await response.json();
                setRegistroDiario(data.RegistrosDiarios);
                notyf.success("Informe generado con exito!!");
                localStorage.removeItem("informes");
            } else if (response.status == 404) {
                notyf.error("No se encontraron registros diarios");
            }
            else {
                notyf.error("Error al obtener los registros");
                console.error("Error al obtener los registros de la API");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al conectar con la API:", error);
        }
        setTimeout(() => {
            setIsDisabled(false);
        }, 2000);
    };

    const generarPDF = () => {
        try {
            if (!registroDiario || registroDiario.length === 0) {
                notyf.error("No hay datos para generar el PDF");
                return;
            }

            const doc = new jsPDF();

            // Configuración de estilos
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");

            // Título
            doc.text("Informe de Registros Diarios", 105, 20, { align: "center" });

            // Información del período
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Período: ${fechaIni} al ${fechaFin}`, 20, 35);

            // Calcular totales
            const totalHoras = registroDiario.reduce((sum, reg) => sum + reg.horas, 0);
            const totalMonto = registroDiario.reduce((sum, reg) => sum + reg.total, 0);

            // Ordenar registros por fecha, empleado y lugar
            const registrosOrdenados = [...registroDiario].sort((a, b) => {
                const fechaComparacion = a.fecha.localeCompare(b.fecha);
                if (fechaComparacion !== 0) return fechaComparacion;

                const empleadoComparacion = a.empleado.nombre.localeCompare(b.empleado.nombre);
                if (empleadoComparacion !== 0) return empleadoComparacion;

                return a.lugar.nombre.localeCompare(b.lugar.nombre);
            });

            // Crear tabla de registros
            const tableColumns = [
                { header: 'Fecha', dataKey: 'fecha' },
                { header: 'Empleado', dataKey: 'empleado' },
                { header: 'Lugar', dataKey: 'lugar' },
                { header: 'Precio/Hora', dataKey: 'precioHora' },
                { header: 'Horas', dataKey: 'horas' },
                { header: 'Adelanto', dataKey: 'adelanto' },
                { header: 'Total', dataKey: 'total' },
            ];

            const tableData = registrosOrdenados.map(registro => ({
                fecha: new Date(registro.fecha).toISOString().split('T')[0],
                empleado: registro.empleado.nombre,
                lugar: registro.lugar.nombre,
                precioHora: `$${registro.lugar.precio.toLocaleString()}`,
                horas: registro.horas,
                total: `$${(registro.total - registro.adelanto).toLocaleString()}`,
                adelanto: `$${registro.adelanto.toLocaleString()}`
            }));

            // Generar tabla
            doc.autoTable({
                columns: tableColumns,
                body: tableData,
                startY: 45,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });

            // Agregar resumen al final
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setFont("helvetica", "bold");
            doc.text(`Total de Horas: ${totalHoras}`, 20, finalY);
            doc.text(`Monto Total: $${totalMonto.toLocaleString()}`, 20, finalY + 7);

            // Generar resumen por empleado
            const resumenPorEmpleado = registrosOrdenados.reduce((acc, reg) => {
                const key = reg.empleado.documento;
                if (!acc[key]) {
                    acc[key] = {
                        horas: 0,
                        total: 0,
                        adelanto: 0,
                        horaPromedio: 0,
                        precioLugar: 0,
                        presentismo: "",
                        boleto: "",

                    };
                }
                acc[key].horaPromedio += 1;
                acc[key].precioLugar += parseFloat(reg.lugar.precio);
                acc[key].horas += reg.horas;
                acc[key].total += parseFloat(reg.total) || 0;
                acc[key].adelanto += parseFloat(reg.adelanto) || 0;
                acc[key].nombre = reg.empleado.nombre;
                acc[key].alias = reg.empleado.alias;
                acc[key].presentismo = reg.presentismo == " " ? "" : reg.presentismo;
                acc[key].boleto = reg.boleto == " " ? "" : reg.boleto;
                return acc;
            }, {});

            // Configurar título centrado para "Resumen por Empleado"
            doc.setFontSize(20);
            doc.text("Resumen por Empleado", 105, finalY + 20, { align: "center" });

            // Crear tabla de resumen
            const resumenColumns = [
                { header: 'Emp.', dataKey: 'nombre' },
                { header: 'Alias', dataKey: 'alias' },
                { header: 'Hs', dataKey: 'horas' },
                { header: '$/Hs Prom.', dataKey: 'horasPromedio' },
                { header: 'Subt.', dataKey: 'subtotal' },
                { header: 'Adel.', dataKey: 'adelanto' },
                { header: 'Total', dataKey: 'total' },
                { header: 'Pres.', dataKey: 'presentismo' },
                { header: 'Boleto I.U.', dataKey: 'boleto' }
            ];

            const resumenData = Object.values(resumenPorEmpleado).map(datos => {
                const subtotal = parseFloat(datos.total || 0);
                const total = subtotal - parseFloat(datos.adelanto || 0);
                const horaPromedio = parseFloat(datos.precioLugar || 0) / parseFloat(datos.horaPromedio);

                return {
                    nombre: datos.nombre,
                    alias: datos.alias,
                    horas: datos.horas,
                    horasPromedio: `$${(horaPromedio || 0).toLocaleString()}`,
                    adelanto: `$${(datos.adelanto || 0).toLocaleString()}`,
                    subtotal: `$${subtotal.toLocaleString()}`,
                    total: `$${total.toLocaleString()}`,
                    presentismo: datos.presentismo || "Sin datos",
                    boleto: datos.boleto || "Sin datos"
                };
            });

            doc.autoTable({
                columns: resumenColumns,
                body: resumenData,
                startY: finalY + 25,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });

            // Configurar título centrado para "Resumen por Empleado y Lugar"
            const detalleY = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(20);
            doc.text("Resumen por Empleado y Lugar", 105, detalleY, { align: "center" });

            // Generar tabla de resumen detallado
            const resumenDetallado = registrosOrdenados.reduce((acc, reg) => {
                const empleado = reg.empleado.nombre;
                const lugar = reg.lugar.nombre;
                const horas = reg.horas;

                const key = `${empleado}-${lugar}-${horas}`;

                if (!acc[key]) {
                    acc[key] = {
                        empleado,
                        lugar,
                        horasPorDia: horas,
                        dias: 1,
                        totalHoras: horas
                    };
                } else {
                    acc[key].dias += 1;
                    acc[key].totalHoras += horas;
                }

                return acc;
            }, {});

            const detalleColumns = [
                { header: 'Empleado', dataKey: 'empleado' },
                { header: 'Lugar', dataKey: 'lugar' },
                { header: 'Días', dataKey: 'dias' },
                { header: 'Horas por día', dataKey: 'horasPorDia' },
                { header: 'Total Horas', dataKey: 'totalHoras' }
            ];

            const detalleData = Object.values(resumenDetallado).sort((a, b) => {
                const empleadoComp = a.empleado.localeCompare(b.empleado);
                if (empleadoComp !== 0) return empleadoComp;
                return a.lugar.localeCompare(b.lugar);
            });

            doc.autoTable({
                columns: detalleColumns,
                body: detalleData,
                startY: detalleY + 5,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });

            // Agregar pie de página
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
            }

            // Guardar PDF
            doc.save(`Informe_${fechaIni}_${fechaFin}.pdf`);
            notyf.success("PDF generado exitosamente!");
        } catch (error) {
            console.error("Error al generar PDF:", error);
            notyf.error("Error al generar el PDF");
        }
    };


    return (

        <RouteGuard permission="todas">
            <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono bg-gray-100">
                <div className="m-4 mt-[50px]">
                    <h2 className="text-[30px] text-center">INFORME</h2>
                </div>
                <div className="flex flex-col items-center gap-4 bg-slate-300 h-[500px] w-[330px] rounded-xl p-4 text-[15px]">
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
                            onClick={GenerarInforme}
                            disabled={isDisabled}
                        >
                            {!isDisabled ? "Generar Informe" : "Generando..."}
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center mt-10">
                        {loading && (
                            <img
                                src="/loanding.svg"
                                alt="Cargando"
                                className="animate-spin"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                }}
                            />
                        )}
                        {registroDiario.length > 0 && (
                            <button
                                className="bg-slate-700 text-white py-2 w-[220px] rounded-xl hover:bg-slate-900 duration-300 hover:scale-105"
                                onClick={() => {
                                    generarPDF();
                                    setTimeout(() => {
                                        setRegistroDiario([])
                                    }, 6000);
                                }}
                                disabled={loading}
                            >
                                Descargar PDF
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </RouteGuard>
    );
};

export default Informe;