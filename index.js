const restify = require('restify');

const errs = require('restify-errors');

const server = restify.createServer({
  name: 'apiario-api',
  version: '1.0.0'
});

var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'apiario_database'
    }
  });

function getDateFromJSON(dateValue) {
    let day = dateValue.getDate();
    let month = dateValue.getMonth();
    let year = dateValue.getFullYear();
    day = (day>9 ? '' : '0') + day;
    month = (month>9 ? '' : '0') + month;
    return `${day}/${month}/${year}`;
}

function getMysqlDate(dateValue) {
    return `${dateValue.substring(6,10)}-${dateValue.substring(3,5)}-${dateValue.substring(0,2)}`;
}

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
      }
);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/medicoes', function (req, res, next) {

    let { initial_date, final_date } = req.query;

    initial_date = getMysqlDate(initial_date);
    final_date = getMysqlDate(final_date);

    console.log("req.query.initial_date:" + initial_date);
    console.log("req.query.final_date:" + final_date);

    knex('medicao').whereBetween('data', [initial_date, final_date]).then((dados) => {
    //knex('medicao').then((dados) => {
        for (var key in dados) {
            dados[key].data = getDateFromJSON(dados[key].data);
        }
        res.send(dados);
    }, next);
});

server.get('/medias/', function (req, res, next) {
    knex('medicao').then((dados) => {
        res.send(dados);
    }, next);
});

/*
server.get('/create', function (req, res, next) {
    knex('medicao').then((dados) => {
        res.send(dados);
    }, next);
});
*/