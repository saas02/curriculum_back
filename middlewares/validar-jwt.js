const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');

const validarJwt = async ( request, response, next ) => {
    
    const token = request.header('x-token');    

    if( !token ){
        return response.status(401).json({
            msg: 'No hay token'
        });
    }

    try {
        
        const { uid, ...data } = jwt.verify(token, process.env.SECRETKEY)
        
        usuario = await Usuario.findById( uid );        

        if( !usuario ){
            return response.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }

        if( !usuario.status ){
            return response.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }

        request.usuario = usuario;

        next();

    } catch (error) {
        
        response.status(500).json(
            {
                msg : error
            }
        )
    }

    
}



module.exports = {
    validarJwt
}