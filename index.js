const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require ("./database/database");

const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");
const forumController = require("./forum/forum.controller");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

//views engine
app.set('view engine','ejs');

//session
app.use(session({ //"qualquercoisa é para aumentar a segurança da sessão"
    secret: "qualquercoisa", cookie: {maxAge: 3600000} //milisegundos de duração da sessão.
}))

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database
connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com sucesso!")
    }).catch((error) => {
        console.log(error);
    })

app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", usersController);
app.use("/", forumController);

//app.get("/session", (req, res) => {
    //req.session.treinamento = "formação node.js"
    //req.session.ano = 2020
    //req.session.email = "zama@udemy.com"
    //req.session.user = {
        //username: "victorlima",
       //email:"email@hotmail.com",
        //id: 10
    //}
    //res.send("sessão gerada.");
//});

//app.get("/leitura", (req, res) => {
     //res.json({
        //treinamento: req.session.treinamento,
        //ano: req.session.ano,
       // email: req.session.email,
       // user: req.session.user,
   // })
//});

app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles:articles, categories:categories});
        })
    })    
});

app.get("/index/2/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article2", {article: article, categories: categories});
            });
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
});

app.get("/category/:slug",(req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        },
        include:[{model: Article}] //join (nessa categoria, inclua todos os artigos q pertecem a ela.)

    }).then(category => {
        if(category != undefined) {

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles,categories: categories})
            });

        }else{
        res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})

app.listen(3000, () => {
    console.log("app rodando na porta 3000")
});