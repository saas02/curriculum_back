const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { existeEmail, existeUsuarioId } = require("../helpers/db-validators");

const { 
    login,
    clientesPost
} = require("../controllers/auth");



const router = Router();

const authPath = "/login";

router.post(authPath, [
    check('email', 'El email es obligaorio').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    validarCampos
], login );


module.exports = router;