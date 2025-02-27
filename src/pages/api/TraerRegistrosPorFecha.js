import clientPromise from "@/lib/mongodb";

export default async function handler(req,res){

    const client = await clientPromise;
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("registroDiario");

    if (req.method == "GET") {
        try {
            const { fechaIni, fechaFin,empleadoId, supervisorId } = req.query;
            const query = {};

            if (fechaIni && fechaFin) {
                query.fecha = {
                    $gte: new Date(fechaIni),
                    $lte: new Date(fechaFin)
                };
            }
            if (supervisorId) {
                query['supervisor._id']=supervisorId
                query['empleado._id']=empleadoId
            }

            const ObtenerRegistrosDiarios = await collect.find(query).toArray();

        
            if (!ObtenerRegistrosDiarios.length > 0) {
                return res.status(404).json({ error: 'No se encontraron registros diarios' });
            }
          
            return res.status(200).json({registros:ObtenerRegistrosDiarios})
        } catch (error) {
            console.error('Error al traer registros diarios:', error);
            res.status(500).json({ error: 'Error al traer registros diarios' });
        }
    }
}