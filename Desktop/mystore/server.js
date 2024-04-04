const express = require('express')
const mongoose = require('mongoose')
const bodyParser= require('body-parser')
const app = express();

const mobile= require('./src/model')
const port =3030;





app.use(bodyParser.json())
app.listen(port,()=>{
console.log(`server is listning at port ${port}`);
connectToDb()
})

const connectionString =('mongodb+srv://gsaurav760:Saurav123@cluster0.npzjhzn.mongodb.net/myystores?retryWrites=true&w=majority&appName=Cluster0'
    )


const connectToDb= async()=>{
try {
    await mongoose.connect(connectionString)
    console.log('db is connected');
} catch (error) {
    console.log('error',error);
}
}

app.post('/add',async(req,res)=>{
    const {brand,color,price}= req.body
    
    const mobileMode = new mobile({
        brand,
        color,
        price
        
    })

    // let document= [];
    // for (let i =0; i<=10; i++){
    //     document.push({brand:"Iphone",color:"Red",price:600000})
    // }
   const mobileModel= await mobileMode.save()
    res.json({'mobileModel':mobileModel});
    console.log('mobileModel',mobileModel);
    
})

app.get('/fetch/:_id',async(req,res)=>{
    try {
        
    
    const param = req.params._id;
    const data= await mobile.findById(param)

    // const {brand}= req.query;
    // const data = await mobile.findOne({brand})
    if (!data){
        res.send('error 404')
    }
    res.send(data)
  
 } catch (error) {
        console.log('erooooor',error);
    }
    
})

app.get('/getAll',async(req,res)=>{
    try {
        
    const data= await mobile.find()

    // const {brand}= req.query;
    // const data = await mobile.findOne({brand})
    if (!data){
        res.send('error 404')
    }
    res.send(data)
  
 } catch (error) {
        console.log('erooooor',error);
    }
    
})


