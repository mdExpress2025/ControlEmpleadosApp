
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function Informe(req, res) {
    const client = await clientPromise;
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("informes");

    if (req.method === "GET") {
        try {
            const { supervisorId } = req.query;

            if (!supervisorId) {
                return res.status(400).json({ error: 'El campo supervisorId es obligatorio' });
            }
            const informes = await collect.find({ "registros.supervisor._id": supervisorId }).toArray();

            res.status(200).json({ informes });
        } catch (error) {
            console.error('Error al traer informes:', error);
            res.status(500).json({ error: 'Error al traer informes' });
        }
    }
    else if(req.method==="DELETE"){
        try {
            const {informeId}=req.query;

            if(!informeId)return res.status(400).json({error:"faltan datos"})

            const id= ObjectId.createFromHexString(informeId);
            const buscarInforme= await collect.deleteOne({_id:id})

            if(buscarInforme.deletedCount){
                return res.status(200).json({message:"Informe borrado con exito"})
            }
            else{
                return res.status(400).json({message:"no se pudo borrar el informe"})
            }                  
        } catch (error) {
            console.error('Error al traer informes:', error);
            res.status(500).json({ error: 'Error al borrar informes' });
        }
    }
    
    else {
        res.status(405).json({ error: "Método no permitido" });
    }
}
