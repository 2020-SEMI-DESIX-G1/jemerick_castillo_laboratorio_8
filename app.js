require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const connectDb = require('./dbConfig');
const Estudiantes = require('./models/Estudiantes');

const PORT = 3000;


//Configuration
app.set('view engine', 'pug');
// Express location view folder
app.set('views', './views')


app.use(express.static(__dirname + '/assets'));


// Intermediarios
app.use(bodyParser.json());
//Lee parametros que vienen URL encoded
app.use(bodyParser.urlencoded());

// Controladores Views
app.get('/', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes',{ estudiantes });
});

app.get('/estudiantes_create/', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes_create',{ estudiantes });
});


// Crea un nuevo estudiante y lo agrega a la lista de estudiantes
app.post('/estudiantes_create/', async (req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes_create',{ estudiantes });
});

//Leer un solo estudiante
app.get('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.render('estudiantes_detail',{estudiante});
    } catch (error) {
        console.log(error);
        res.render({estudiante});
        throw error;
    }
});

//Load edit form -- Update
app.get('/estudiantes_update/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.render('estudiantes_update',{estudiante});
    } catch (error) {
        console.log(error);
        res.render({estudiante});
        throw error;
    }
});

//Submit Edit Form
app.post('/estudiantes_update/:id', async (req, res) => {
    
    Estudiantes.findByIdAndUpdate(req.params.id,req.body, function(err,result){
        if(err){
            console.log(err);
            return;
        }else{
            console.log(result);
            res.redirect('/');
        }
    });

});

// Elimina un estudiante de la lista de estudiantes basado en el id recibido
app.get('/estudiantes_delete/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findByIdAndRemove(req.params.id,{useFindAndModify: false})
        res.render('estudiantes_delete',{estudiante});
    } catch (error) {
        console.log(error);
        res.json({});
    }
});


connectDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Ejecutando en el puerto ${PORT}`);
    });
});