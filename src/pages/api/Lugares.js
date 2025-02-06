import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
export default async function Luagres(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("lugares")


    if(req.method=="GET"){
      try {
        const { supervisorId}=req.query;
        const Lugares=await collect.find({"supervisor._id":supervisorId}).toArray();

        res.status(200).json({Lugares});
      } catch (error) {
        console.error('Error al traer lugares:', error);
        res.status(500).json({ error: 'Error al traer lugares' });
      }
     
    }

    else if(req.method=="POST"){
      try {
        const { nombre, direccion,precio,tipoLugar,supervisor } = req.body;
        if (!nombre || !direccion || !precio|| !supervisor||!tipoLugar) res.status(400).json({ error: "faltan llenar campos" })

        const lugarExiste=await collect.findOne({nombre,"supervisor._id":supervisor._id})

        if(lugarExiste){
            return res.status(400).json({ error: 'El lugar ya existe' });
        }

        const NuevoLugar = {nombre, direccion,tipoLugar,precio,supervisor:supervisor }
            const resul =await collect.insertOne(NuevoLugar);
    
        return res.status(201).json({
              message: 'Lugar agregado exitosamente',
              empleadoId: resul.insertedId,
            });

    
      } catch (error) {
        console.error('Error al traer lugar:', error);
        res.status(500).json({ error: 'Error al traer lugar' });
      }
     
    }

    else if(req.method=="PUT"){
      try {
        const {lugarId, ...cambios}=req.body;
        if(!lugarId)return res.status(400).json({error:"Falta el id del lugar"})

        const id=ObjectId.createFromHexString(lugarId)

        const editar=await collect.updateOne(
          {_id:id},
          {$set:cambios}
        )
        if(editar.matchedCount===0)return res.status(400).json({error:"lugar no encontrado"});

        res.status(200).json({message:"lugar actualizado con exito!"})

      } catch (error) {
        console.error('Error al editar lugar:', error);
        res.status(500).json({ error: 'Error al editar lugar' });
      }
     
    }

    else if(req.method=="DELETE"){
      try {
        const {lugarId}=req.query;
        if(!lugarId)return res.status(400).json({message:"faltan datos"});

        const id=ObjectId.createFromHexString(lugarId);
        const borrar=await collect.deleteOne({_id:id})

        if(borrar.deletedCount){
          return res.status(200).json({message:"lugar borrado"})
        }
        else{ 
          return res.status(400).json({message:"No se encontro el lugar a borrar"})
        }

      } catch (error) {
        console.error('Error al traer lugar:', error);
        res.status(500).json({ error: 'Error al traer lugar' });
      }
     
    }

    
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
 
}
