import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { isValidPassword } from '../utils.js';
import { generateJWToken } from '../utils.js';
import config from '../config/config.js';

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        const email = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
 


        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }

/**************************************************************************************************************************************************/
        const ADMIN_EMAIL = config.adminEmail;
        const ADMIN_PASSWORD = config.adminPassword;

        if (email === ADMIN_EMAIL) {
            console.log('Email de usuario Admin en BD Mongo coincide con la de archivo .env')            
            return res.status(200).send({ status: "success", message: "Email de usuario Admin en BD Mongo coincide con la de archivo .env" });
        }
        if (isValidPassword(user, ADMIN_PASSWORD)) {
            console.log('Contraseña de usuario Admin en BD Mongo coincide con la de archivo .env')            
            return res.status(200).send({ status: "success", message: "Contraseña de usuario Admin en BD Mongo coincide con la de archivo .env" });
        }
/**************************************************************************************************************************************************/        

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);
        //1ro con LocalStorage
        //res.send({ message: "Login successful!", jwt: access_token });

        //2do con Cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000,
            // httpOnly: true // No expone la cookie
            httpOnly: false // expone la cookie
        });
        res.send({ message: "Login successful!" });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

export default router;