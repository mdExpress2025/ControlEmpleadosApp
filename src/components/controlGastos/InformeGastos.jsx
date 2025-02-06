"use client"

import { useState } from "react";
import notyf from "@/utils/notificacion";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jwtDecode } from "jwt-decode";

function InformeGastos () {
    const [loading, setLoading] = useState(false);
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [gastos, setGastos] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    const token=sessionStorage.getItem("token");    
    const decodetoken= token? jwtDecode(token):null;
    const supervisorId=decodetoken?.user;

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
            const response = await fetch(`/api/Gastos?fechaIni=${fechaIni}&fechaFin=${fechaFin}&supervisorId=${supervisorId}`);
            if (response.ok) {
                const data = await response.json();
                setGastos(data.gastos);
                notyf.success("Informe generado con exito!!");
            } else if(response.status == 404){
                notyf.error("No se encontraron Gastos");
            }
            else{
                notyf.error("Error al obtener los registros");
                console.error("Error al obtener los registros de la API");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            setLoading(false);
        }
        setTimeout(() => {
            setIsDisabled(false);
        }, 2000);
    };

    const generarPDF = () => {
        try {
            if (!gastos || gastos.length === 0) {
                notyf.error("No hay datos para generar el PDF");
                return;
            }
    
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
    
            // Título
            doc.text("Informe de Gastos", 105, 20, { align: "center" });
    
            // Información del período
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Período: ${fechaIni} al ${fechaFin}`, 20, 35);
    
            // Ordenar los gastos por fecha
            const gastosOrdenados = [...gastos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
            // Configuración de columnas para la tabla
            const tableColumns = [
                { header: 'Fecha', dataKey: 'fecha' },
                { header: 'Gastos Uber', dataKey: 'viatico' },
                { header: 'Gastos Insu', dataKey: 'insumos' },
                { header: 'Descripcion', dataKey: 'descripcion' },
                { header: 'Cant Empl', dataKey: 'cantEmpleados' },
                { header: 'Direccion', dataKey: 'direccion' },
                { header: 'Total', dataKey: 'total' },
            ];
    
            // Preparar los datos para la tabla
            const tableData = gastosOrdenados.map((gasto) => {
                const viatico = parseFloat(gasto.viatico) || 0;
                const insumos = parseFloat(gasto.insumos) || 0;
                const total = viatico + insumos;
    
                return {
                    fecha: new Date(gasto.fecha).toISOString().split('T')[0],
                    viatico: `$${viatico}`,
                    insumos: `$${insumos}`,
                    descripcion: gasto.descripcion,
                    cantEmpleados: gasto.cantEmpleados,
                    direccion: gasto.direccion,
                    total: `$${total}`
                };
            });
    
            // Generar la tabla
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
    
            // Calcular totales
            const totalViaticos = gastos.reduce((sum, gasto) => sum + (parseFloat(gasto.viatico) || 0), 0);
            const totalInsumos = gastos.reduce((sum, gasto) => sum + (parseFloat(gasto.insumos) || 0), 0);
            const montoTotal = totalViaticos + totalInsumos;
    
            // Mostrar totales en el PDF
            let finalY = doc.lastAutoTable.finalY + 10; // Coordenada Y después de la tabla
            doc.setFont("helvetica", "bold");
            doc.text(`Total de Uber: $${totalViaticos.toFixed(2)}`, 20, finalY);
            finalY += 7; 
            doc.text(`Total de Insumos: $${totalInsumos.toFixed(2)}`, 20, finalY);
            finalY += 7; 
            doc.text(`Monto Total: $${montoTotal.toFixed(2)}`, 20, finalY);
    
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
        <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono bg-gray-100">
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
                        className={`border border-white py-2 px-4 rounded-xl ${!isDisabled?'hover:bg-white duration-300 hover:scale-105':'opacity-50 cursor-not-allowed'}`}
                        onClick={GenerarInforme}
                        disabled={isDisabled}
                    >
                        {!isDisabled?"Generar Informe":"Generando..."}                       
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
                    {gastos.length > 0 && (
                        <button
                            className="bg-slate-700 text-white py-2 w-[220px] rounded-xl hover:bg-slate-900 duration-300 hover:scale-105"
                            onClick={()=>{generarPDF();
                                 setTimeout(() => {
                                setGastos([])
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
    );
};

export default InformeGastos;