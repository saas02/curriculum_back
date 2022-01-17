const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJwt } = require('../middlewares');
const { existeEmail, existeUsuarioId } = require("../helpers/db-validators");

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete,
    usuariosDoc
} = require("../controllers/usuario");



const router = Router();

const usuariosPath = "/";

router.get(usuariosPath,  usuariosGet );

/** El segundo parametro es un middleware que va a validar lo que necesitemos */
router.post(usuariosPath, [ 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe tener más de 6 letras').isLength( { min: 6 } ),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( existeEmail ),
    //check('rol', 'No es un rol permitido').isIn( ['ADMIN_ROLE', 'USER_ROLE'] ),roles estaticos    
    validarCampos
] ,usuariosPost );

router.put(usuariosPath+":id",  [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeUsuarioId ),    
    validarCampos    
],usuariosPut );

router.delete(usuariosPath+":id",  [
    validarJwt,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeUsuarioId ),
    validarCampos
], usuariosDelete );


router.put(usuariosPath+'doc/:id', [ 
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeUsuarioId ),    
    validarCampos   
] ,usuariosDoc );


module.exports = router;