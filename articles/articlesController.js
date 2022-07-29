const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/articles", adminAuth,(req,res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles:articles})
    });
});

router.get("/admin/articles/new", adminAuth, (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories})
    })
});

router.post("/articles/save", (req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete", (req,res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.render("/admin/articles");
    } 
});

router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories:categories, article:article})
            })
        }else{
            res.redirect("/index/2");
        }
    }).catch(err => {
        res.redirect("/index/2");
    });
});

router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title:title, body:body, categoryId:category, slug:slugify(title)}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/index/2")
    });
});

module.exports = router;