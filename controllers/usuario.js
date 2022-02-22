const { response, request } = require('express');
const brcyptjs = require('bcryptjs');
const Handlebars = require("handlebars");
const pdf = require("pdf-creator-node");
const fs = require("fs");

const Usuario = require("./../models/usuario");
const { _isValid, _differenceYears } = require('./../helpers/handlebars-functions');

Handlebars.registerHelper('isValid', function (value, value2) {    
    return _isValid(value, value2);
});

Handlebars.registerHelper('differenceYears', function (data) {    
    return _differenceYears(data);
});    

// Read HTML Template
const html = fs.readFileSync("public/template.handlebars", "utf8");

const options = {
    format: "Letter",
    orientation: "portrait",
    border: "10mm"
};

const usuariosGet = async (req = request, res = response)  => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };
    
    const [ total, usuarios ] = await Promise.all([
        /** Se coloca el await para esperar la salida de las dos query */
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);    

    res.json({
        msg:" get API Controller",
        total,
        usuarios        
    })
}

const usuariosPost = async (req, res = response)  => {
    
    const { password, ...data } = req.body;
    const usuario = new Usuario( data );    
    
    /** Encriptar Contraseña */
    const salt = brcyptjs.genSaltSync(10);
    usuario.password = brcyptjs.hashSync( password, salt );

    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req, res = response)  => {
    
    const { id } = req.params;
    const { _id, ...data } = req.body;

    if(data.password){
        
        let usuario = await Usuario.findById( id );
        const validatePassword = brcyptjs.compareSync( data.password,  usuario.password );
        
        if( !validatePassword ){
            const salt = brcyptjs.genSaltSync(10);
            data.password = brcyptjs.hashSync( data.password, salt );
        }
        
    }

    const usuario = await Usuario.findByIdAndUpdate( id, data )

    res.json({
        msg: " put API Controller....",
        data
    })
}

const usuariosDelete = async (req, res = response)  => {

    const { id } = req.params;    

    /** para eliminar */
    //const usuario = await Usuario.findByIdAndDelete( id );

    /** para actualizar el estado */
    const usuario = await Usuario.findByIdAndUpdate( id, { status: false } );

    const usuarioAutenticado = req.usuario;


    res.json({
        msg:" delete API Controller",
        usuario,
        usuarioAutenticado
    })
}

const usuariosDoc = async (req, res = response)  => {

    let { id } = req.params;
    let fileLanguage = ( req.body.fileLanguage ) ? req.body.fileLanguage : 'es';
    let usuario = await Usuario.findById( id ).lean() 
    usuario.fileLanguage = fileLanguage
    let folder = 'public/cv/';

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }        
    let fileName = `/${id}-${fileLanguage}.pdf`;
    var resultFile   = {};

    try {
         
        let document = {
            html: html,
            data: {
                usuarios: usuario
            },
            path: folder+fileName,
            type: "",
        };    

    
        let result = await pdf.create(document, options)
            .then((res) => {
                console.log(res);               
                return res;
            })
            .catch((error) => {  
                console.log(error);        
                resultFile = {
                    error: error
                };          
                return error;
            });        
    } catch (error) {
        resultFile = {
            error: error
        };  
    }
    

    res.json({
        msg: " put API Controller****",
        url: '/cv'+fileName,
        result: resultFile
    })


}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosDoc
}