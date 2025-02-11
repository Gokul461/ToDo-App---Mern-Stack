const express = require('express');
const  mongoose = require('mongoose');
const cors = require('cors');
const app = express()
app.use(express.json());
app.use(cors());
const todoschema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String
}) 
const todomodel = mongoose.model('Todo',todoschema);
// let todos = [];
//connecting mongoDb

mongoose.connect('mongodb://localhost:27017/mera-app')
.then(() => {
    console.log("Db connected");
})
.catch((err)=>{
    console.log(err);
})
app.post('/todos',async(req,res) => {
    const {title,description}=req.body;
    // const newtodo  ={
    //     id: todos.length +1,
    //     title,
    //     description
    // } ;
    try{
        const newtodo = new todomodel({title,description});
        await newtodo.save();
res.status(201).json(newtodo);

    }catch(error){
console.log(error);
res.status(500).json({message: error.message});
    }
// todos.push(newtodo);
// console.log(todos);
})
app.get('/todos',async(req,res)=>{
    try {
        const todos = await todomodel.find(); // Fetch todos from MongoDB
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})
//update todo
app.put('/todos/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const {title,description}=req.body;
        const updatedtodo = await todomodel.findByIdAndUpdate(id,{title,description},{new:true});
        if(!updatedtodo){
            return res.status(404).json({message: 'Todo not found'});
        }
        else{
            res.json(updatedtodo);
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }


})


//delete todo


app.delete('/todos/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }

})



const port = 8000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})