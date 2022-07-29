const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const Article = require("../articles/Article");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        //listagem de usuários
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    //criar usuários
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then( user => {

        if(user == undefined){ //não foi encontrado um email no banco de dados, então pode cadastrar.

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/");
            });
        }else{
            res.redirect("/admin/users/create"); // se o email já estiver cadastrado, é redirecionado.
        }
    })
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.get("/index/2", (req,res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
    }).then(articles => {
        res.render("index2", {articles:articles});
    });
});

router.post("/authenticate", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){     //Se existe um usuário com esse e-mail
            //validar senha
            var correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                //console.log(req.session.user)
                res.redirect("/index/2");
            }
        }else{
            res.redirect("/login");
        }
    })
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});
module.exports = router;