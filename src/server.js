const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

// configurar past public
server.use(express.static("public"))

server.use(express.urlencoded({ extended: true}))

// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// Configurar caminhos da aplicação
// página inicial
//req: requisição
//res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um título"});
})

server.get("/create-point", (req, res) => {

    // console.log(req.query)

    return res.render("create-point.html", {saved: true});
})

server.post("/savepoint", (req, res) => {

    // req.body: Query strings da nossa url
    // console.log(req.body)

    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {

    const search = req.query.search
    
        if(search == "") {
            return res.render("search-results.html", {places: rows, total: 0});
        }
    
    db.all(`SELECT * FROM places city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        //mostrar a página html com os dados do banco de de dados
        
        return res.render("search-results.html", { total: 0});
    })
    
})

// ligar o servidor
server.listen(3000)