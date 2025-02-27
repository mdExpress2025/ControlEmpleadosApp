import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export default async function RegistroDiarios(req, res) {

    const client = await clientPromise;
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("registroDiario");
    const collectInformes = db.collection("informes");

    if (req.method == "GET") {
        try {
            const { fechaIni, fechaFin, supervisorId } = req.query;
            const query = {};

            if (fechaIni && fechaFin) {
                query.fecha = {
                    $gte: new Date(fechaIni),
                    $lte: new Date(fechaFin)
                };
            }
            if (supervisorId) {
                query['supervisor._id'] = supervisorId
            }

            const ObtenerRegistrosDiarios = await collect.find(query).toArray();


            if (!ObtenerRegistrosDiarios.length > 0) {
                return res.status(404).json({ error: 'No se encontraron registros diarios' });
            }
            let fechaHoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" })
            const informe = {
                fechaInforme: fechaHoy,
                fechaIni: fechaIni,
                fechaFin: fechaFin,
                registros: ObtenerRegistrosDiarios,
            }
            const resul = await collectInformes.insertOne(informe)
            if (resul.insertedId) {
                return res.status(200).json({ RegistrosDiarios: ObtenerRegistrosDiarios });
            }
        } catch (error) {
            console.error('Error al traer registros diarios:', error);
            res.status(500).json({ error: 'Error al traer registros diarios' });
        }
    }
    else if (req.method == "POST") {
        try {
            const { fecha, empleado, horas, lugar, presentismo, boleto, supervisor, adelanto } = req.body;

            if (!fecha || !empleado || !horas || !lugar || !supervisor || !(adelanto >= 0)) {
                return res.status(400).json({ error: 'Faltan datos' });
            }

            const convertirFecha = new Date(fecha);
            let total = parseFloat(horas) * parseFloat(lugar.precio)
            const registroDiario = { fecha: convertirFecha, empleado,horas: parseFloat(horas), lugar, total, presentismo, boleto, supervisor: supervisor,adelanto: parseFloat(adelanto) };
            const result = await collect.insertOne(registroDiario);

            res.status(201).json({ message: 'Registro diario guardado', id: result.insertedId });

        } catch (error) {
            console.error('Error al guardar registros diarios:', error);
            res.status(500).json({ error: 'Error al guardar registros diarios' });
        }

    }
    else if (req.method === "PUT") {
        try {
            const { id,horas, adelanto, fecha ,precio} = req.body;
            console.log(id,horas, adelanto, fecha ,precio)
            if (!horas ||!fecha||!id||!precio) return res.status(400).json({ error: "Faltan datos" })

            const idObject = ObjectId.createFromHexString(id)
            const total=parseFloat(horas) * parseFloat(precio)
            const fechaFomr=new Date(fecha)
            const editar = await collect.updateOne(
                { _id: idObject },
                { $set: { horas: parseFloat(horas),adelanto:parseFloat(adelanto),fecha:fechaFomr,total:total } }
            )
            if (editar.matchedCount === 0) return res.status(400).json({ error: "registro no encontrado" });

            res.status(200).json({ message: "registro actualizado con exito!" })
        } catch (error) {

        }
    }

}

