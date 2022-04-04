const {response}= require('express');
const Usuario = require('../models/usuario');

//para generar nuestro token
const {generarJWT} = require('../helpers/jwt');

//?invocamos para encriptar contrseña
const bcrypt = require('bcryptjs');



 //nos creamos un usuarios con sus encriptacion y generando su jwt
const crearUsurio = async(req,res = response)=>{

  //vamos extraer nuestro email
  const {email,password} = req.body;
  //nos preguntamos si existe o no?
  try {
    const existeEmail = await Usuario.findOne({email});
    if (existeEmail) {
      return res.status(400).json({
        ok:false,
        msg:'El correo ya esta registrado'
      });
    }
    //obteneos el valor de nuestro body
    const usuario = new Usuario(req.body);

    //?Encriptamos la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    //con esta linea grabamos en nuestra base de dato
    await usuario.save();

    //!genero mi JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok:true,
      //recolecto los datos de mis usuario pero no envio
      usuario,
      //creo mi token
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'contactese con el administrador'
    });
  }

  }

  //ingreamos con nuestra cuenta
  const login = async( req,res= response)=>{
    //traemos nuestro valores de email y password
    const {email,password} = req.body;

    try {
      //validar email
      const usuarioDB = await Usuario.findOne({email});

      if (!usuarioDB) {
        return res.status(404).json({
          ok:false,
          msg:'email no encontrado'
        });
      }
      //validar password
      const validPassword = bcrypt.compareSync(password,usuarioDB.password);
      if (!validPassword) {
        return res.status(400).json({
          ok:false,
          msg:'la contraseña no es validad'
        });
      }

      //!al llegar aqui genero mi JWT
      const token = await generarJWT(usuarioDB.id);
        res.json({
          ok:true,
          usuario:usuarioDB,
          token
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok:false,
        msg:'contactese con el administrador'
      });
    }
  }

  //renovar el JWT 
  const renewToken = async (req, res= response)=>{

    const uid = req.uid;

    //genero un uevo JWT generar jwt uid
    const token = await generarJWT(uid);
    //obtenemos el usuoar po el uid 
    const usuario = await Usuario.findById(uid);
    res.json({
      ok:true,
      // uid:req.uid
      usuario,
      token
    });
  }
module.exports = {
  crearUsurio,
  login,
  renewToken
}