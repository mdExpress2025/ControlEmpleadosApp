import clientPromise from "@/lib/mongodb";

export default async function (req, res) {

    try {
        const client = await clientPromise;
        const db = client.db("AplicacionInformeEmpleados");
        const collect = db.collection("gastos");

        if (req.method === "POST") {
            try {
                const { viatico, insumos, descripcion, cantEmpleados, direccion, fecha, supervisor } = req.body;

                if (!viatico || !insumos || !descripcion || !cantEmpleados || !direccion || !fecha || !supervisor) return res.status(400).json({ error: "Faltan datos" })

                const fechaCorrecta = new Date(`${fecha}T12:00:00`);

                if (isNaN(fechaCorrecta.getTime())) {
                    return res.status(400).json({ error: "La fecha no es válida" });
                }
                const gastos = {
                    viatico,
                    insumos,
                    descripcion,
                    cantEmpleados,
                    direccion,
                    fecha: fechaCorrecta,
                    supervisor
                };
                await collect.insertOne(gastos)
                return res.status(200).json({ message: "datos cargados" })
            }
            catch (error) {
                console.log(error)
                return res.status(500).json({ error: "Error al guardar empleado" })
            }
        }

        else if (req.method === "GET") {
            try {
                const { fechaIni, fechaFin, supervisorId } = req.query;

                if (!fechaFin || !fechaIni || !supervisorId) return res.status(400).json({ error: "Faltan datos" })

                const query = {}
                query.fecha = {
                    $gte: new Date(`${fechaIni}T12:00:00`),
                    $lte: new Date(`${fechaFin}T12:00:00`)
                };
                query['supervisor._id'] = supervisorId

                const gastos = await collect.find(query).toArray();

                console.log(gastos)
                if (gastos.length > 0) {
                    return res.status(200).json({ gastos })
                }
                return res.status(404).json({ error: "hubo un error!!" })

            } catch (error) {
                return res.status(500).json({ error: "Error al traer gastos" })
            }
        }

    }
    catch (error) {
        res.status(500).json({ error: "No se pudo conectar a la base de datos" })
    }
}