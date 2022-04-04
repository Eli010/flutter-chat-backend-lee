/*
  path:/api/login
*/

const {Router}= require('express');
const { check } = require('express-validator');
const { crearUsurio, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-compos');
const { validarJWT } = require('../middlewares/validar-jwt');

//ruta para regsitro
const router = Router();
router.post('/new',[
  check('nombre','El nombre es obligatorio').not().isEmpty(),
  check('password','El password es obligatorio').not().isEmpty(),
  check('email','El email es obligatorio').isEmail(),
  validarCampos
],crearUsurio);


//ruta para ingreso del usuario
router.post('/',[
  check('password','El password es obligatorio').not().isEmpty(),
  check('email','El email es obligatorio').isEmail(),
  validarCampos
],login)


//ruta para renovar el JWT
router.get('/renew',validarJWT,renewToken);

module.exports = router;