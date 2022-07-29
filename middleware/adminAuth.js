// o middleware é uma função que está entre a requisição e a resposta.

function adminAuth(req, res, next) {
    if(req.session.user != undefined){ //se a sessão user estiver logado, pode passar a rota.
        next();
    }else{ //se a sessão user não existir 
        res.redirect("/"); // será redirecionado para a homepage 
    }
}

module.exports = adminAuth;