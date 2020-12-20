const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const studentArray = require('./InitialData');

const localStudentArray = [...studentArray];
let maxId = localStudentArray.length;

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get("/api/student", (req,res) => {
    res.send(localStudentArray);
})

app.get("/api/student/:id", (req,res) => {
    const idToSearch = req.params.id;
    const matched = localStudentArray.filter(
    (student) => student.id === Number(idToSearch)
    );
    if(matched.length == 0){
        res.sendStatus(404);
    }else{
     res.send(matched[0]);
    }
});

const isNulllOrUndefined = (vol) => vol === null || vol === undefined;

app.post("/api/student", (req,res) => {
    const newStudent = req.body;
    const {name, currentClass, division } = newStudent;
    if(isNulllOrUndefined(name) || isNulllOrUndefined(currentClass) || isNulllOrUndefined(division)){
        res.sendStatus(400);
    }else {
     const newId = maxId + 1;
     maxId = newId;
     newStudent.id = newId;
     newStudent.currentClass = Number(currentClass);
     localStudentArray.push(newStudent);
     res.send({ id: newId});
    }
});

app.put("/api/student/:id", (req,res) => {
    const idToSearch = req.params.id;
    const update = req.body;
    const {name, currentClass, division } = update;
    const matchedIdx = localStudentArray.findIndex(
    (student) => student.id === Number(idToSearch)
    );
    if(matchedIdx === -1){
        res.sendStatus(400);
    } else{
     if(!isNulllOrUndefined(name)) {
         localStudentArray[matchedIdx].name = name;
         res.sendStatus(200);
     }
     else if(!isNulllOrUndefined(currentClass)) {
        localStudentArray[matchedIdx].currentClass = Number(currentClass);
        res.sendStatus(200);
    }
    else if(!isNulllOrUndefined(division)) {
        localStudentArray[matchedIdx].division = division;
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
    }
});

app.delete("/api/student/:id", (req,res) => {
    const idToSearch = req.params.id;
    const matchedIdx = localStudentArray.findIndex(
    (student) => student.id === Number(idToSearch)
    );
    if(matchedIdx === -1){
        res.sendStatus(404);
    } else{
    localStudentArray.splice(matchedIdx , 1);
    res.sendStatus(200);
    }
});


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   