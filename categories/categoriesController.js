const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/categories", adminAuth,(req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories", {categories:categories});
    });
});

router.get("/admin/categories/new", adminAuth, (req,res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req,res) => {
    var title = req.body.title;
    if(title != undefined) {

        Category.create({
            title:title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })

    }else{
        res.redirect("/admin/categories/new");
    }
});

router.post("/categories/delete", (req,res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){ //se o id for um número

            Category.destroy({
                where: {
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }else{ //se o id não for um número
            res.redirect("/admin/categories");
        }
    }else{ // se o if for nulo
        res.render("/admin/categories");
    } 
});

router.get("/admin/categories/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit",{category:category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
});

router.post("/categories/update", adminAuth, (req,res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title:title, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() =>{
        res.redirect("/admin/categories");
    })
});

module.exports = router;