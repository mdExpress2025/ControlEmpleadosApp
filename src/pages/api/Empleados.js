import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
export default async function Empleados(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("empleados")


    if (req.method == "GET") {
      try {
        const {supervisorId}=req.query;
        const Empleados = await collect.find({"supervisor._id":supervisorId}).toArray();
        res.status(200).json({ Empleados });
      } catch (error) {
        console.error('Error al traer empleados:', error);
        res.status(500).json({ error: 'Error al traer empleados' });
      }

    }

    else if (req.method == "POST") {
      try {
        const { documento, nombre, alias, supervisor } = req.body;
        
        if (!nombre || !documento || !supervisor || !alias) {
          return res.status(400).json({ error: "Faltan llenar campos" });
        }
      
        const empleadoExiste = await collect.findOne({ documento,"supervisor.supervisorId":supervisor._id });
        if (empleadoExiste) {
          return res.status(400).json({ error: 'Empleado con este documento ya existe' });
        }


      
        const nuevoEmpleado = { documento, nombre,alias,supervisor:supervisor };
        const resul = await collect.insertOne(nuevoEmpleado);
      
        return res.status(201).json({
          message: 'Empleado agregado exitosamente',
          empleadoId: resul.insertedId,
        });
      } catch (error) {
        console.error('Error al agregar empleado:', error);
        res.status(500).json({ error: 'Error al agregar empleado' });
      }      
    }

    else if(req.method=="PUT"){
      try {
        const {empleadoId, alias}=req.body;
        if(!empleadoId || !alias)return res.status(400).json({error:"Faltam datos"})

        const id=ObjectId.createFromHexString(empleadoId)

        const editar=await collect.updateOne(
          {_id:id},
          {$set:{alias:alias}}
        )
        if(editar.matchedCount===0)return res.status(400).json({error:"empleado no encontrado"});

        res.status(200).json({message:"Empleado actualizado con exito!"})

      } catch (error) {
        console.error('Error al editar lugar:', error);
        res.status(500).json({ error: 'Error al editar Empleado' });
      }
     
    }

    else if (req.method == "DELETE") {
      try {
        const { empleadoId } = req.query; // Asegúrate de obtener correctamente el ID del query
        if (!empleadoId) {
          return res.status(400).json({ error: "No hay id de empleado" });
        }
        const id=ObjectId.createFromHexString(empleadoId)
   
        const BorrarEmpleado = await collect.deleteOne({ _id: id });
    
        if (BorrarEmpleado.deletedCount) {
          return res.status(200).json({ message: "Empleado eliminado" });
        } else {
          return res.status(400).json({ message: "No se pudo eliminar al empleado" });
        }
      } catch (error) {
        console.error("Error al borrar empleado:", error);
        res.status(500).json({ error: "Error al borrar empleado" });
      }
    }


  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
  
}
