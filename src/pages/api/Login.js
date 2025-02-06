import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export default async function Login(req, res) {
   const SECRET = "192is9mun2s982h18j1"
    try {
        const client = await clientPromise;
        const db = client.db('AplicacionInformeEmpleados');
        const collect = db.collection('usuarios');
    
        const { user, password } = req.body;
        if (!user || !password) {
            return res.status(400).json({ message: 'Completa todos los campos' });
        }

        // Buscar usuario por nombre de usuario
        const userExists = await collect.findOne({ user });
        if (userExists && await bcrypt.compare(password, userExists.password)) {

            const token= jwt.sign({ user: userExists._id,role:userExists.role,nombre:userExists.user }, SECRET , {
                expiresIn: '24h'
            });

            return res.status(200).json({token });
        }

        res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
}
