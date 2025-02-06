import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';

export default async function Usuarios(req, res) {
    try {

        const client=await clientPromise;
        const db=client.db("AplicacionInformeEmpleados")
        const collect=db.collection("usuarios")
        
        if (req.method === "GET") {
            try {
                const usuarios = await collect
                .find({}, { projection: { password: 0 } }) 
                .toArray();
                 res.status(200).json({usuarios})
            } catch (error) {
                console.log(error)
                res.status(500).json({error})
            }
        }
    
        else if(req.method==="POST"){
            try {
                const {user,email,role}=req.body;
                
                if(!user||!role||!email)return res.status(400).json({error:"Faltan datos"})

                const usuarioExiste=await collect.findOne({ email});
                if(usuarioExiste)
                    {
                        return res.status(401).json({ error: 'El lugar ya existe' });
                    } 

                const usuario={user, email,role}
                await collect.insertOne(usuario)
    
                res.status(201).json({message:"empleado guardado"})
            } catch (error) {
               res.status(500).json({error})
            }
        }
    
        else if(req.method==="PUT"){
            try {          
                const {usuarioId,role}=req.body;
                if(!usuarioId)return res.status(400).json({error:"Faltan datos"})
        
                const id=ObjectId.createFromHexString(usuarioId)
        
                const editar=await collect.updateOne(
                  {_id:id},
                  {$set:{role:role}}
                )
                if(editar.matchedCount===0)return res.status(400).json({error:"usuario no encontrado"});
        
                res.status(200).json({message:"usuario actualizado con exito!"})
            } catch (error) {
                res.status(500).json({error})
            }
        }
    
        else if(req.method==="DELETE"){
    
            try {
                const {usuarioId}=req.query;
                if(!usuarioId)return res.status(400).json({error:"Faltan datos"})
                const id=ObjectId.createFromHexString(usuarioId)
        
                const borrar=await collect.deleteOne({_id:id})
    
                if(borrar.deletedCount){
                    return res.status(200).json({message:"empleado borrado"})
                }
                else{
                    res.status(400).json({error:"no se encontro al empleado"})
                }
            } catch (error) {
                res.status(500).json({error})
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
   
}
