const { response, request } = require('express');
const brcyptjs = require('bcryptjs');
const Usuario = require("./../models/usuario");
const { generarJWT } = require('../helpers/generar-jwt');


const login = async (req = request, res = response)  => {

    const { email, password } = req.body;
    
    try {

        const usuario = await Usuario.findOne( { email } )

        if( !usuario ){
            /** VAlidar si existe el email */
            return res.status(400).json({
                msg: "(Usuario) / Password no con correctos -- email"
            })
        }

        if( !usuario.state ){
            /** Validar estado del usuario */
            return res.status(400).json({
                msg: "(Usuario) / Password no con correctos -- estado"
            })
        }

        const validatePassword = brcyptjs.compareSync( password,  usuario.password );

        if( !validatePassword ){
            /** Validar Contraseña */
            return res.status(400).json({
                msg: "(Usuario) / Password no con correctos -- password"
            })
        }

        /** Generar JWT */
        const token = await generarJWT( usuario.id )

        res.json({
            msg:" login API Controller",
            token,
            usuario
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:" Ocurrió un error"
        })
    }

}


module.exports = {
    login
}