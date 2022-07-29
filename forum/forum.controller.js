const express = require("express");
const router = express.Router();
const Forum = require("./Forum");
const adminAuth = require("../middleware/adminAuth");
const Resposta = require("./Resposta");

router.get("/forum", adminAuth, (req,res) => {
        res.render("forum");
});

router.post("/salvarpergunta", adminAuth, (req,res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Forum.create({
        titulo:titulo,
        descricao:descricao
    }).then(() => {
        res.redirect("forum");
    })  
});

router.get("/forum/perguntas", adminAuth, (req,res) => {
    Forum.findAll().then(perguntas => {
        res.render("perguntas", {perguntas:perguntas});
    });
});

router.get("/pergunta/:id", (req, res) =>{
    var id = req.params.id;

    Forum.findOne({
        where:{
            id:id,
        }
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order:[
                    ['id', 'DESC']],
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta:pergunta,
                    respostas: respostas
                });
            }); 
        }else{
            res.redirect("/perguntas")
        }
    })
});

router.post("/responder", (req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo:corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+ perguntaId)
    })
});

module.exports = router;