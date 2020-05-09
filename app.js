const express=require('express');
const bodyParser=require('body-parser');
const https=require('https');


const port=3000;
const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));//Defining a folder for our static assets i.e images and css

app.get('/',(req,res)=>{
   res.sendFile(`${__dirname}/signup.html`);
});
app.post('/',(req,res)=>{
   const firstName=req.body.first_name;
   const lastName=req.body.last_name;
   const emailAddress=req.body.email;

   const data={
      members:[
         {
            email_address:emailAddress,
            status: 'subscribed',
            merge_fields:{
               FNAME:firstName,
               LNAME:lastName
            }

         }
      ]

   }
   const jsonData=JSON.stringify(data);

   const url=`https://us8.api.mailchimp.com/3.0/lists/90c4ab1281`;
   const options={
      method:'POST',
      auth:'john:9a378d479fddf9afa31374dd0141de38-us8'
   }
   const request=https.request(url,options,response=>{
      if(response.statusCode==200){
         // res.send('Successfully subscribed!');
            res.sendFile(`${__dirname}/success.html`);
      }else{
            res.sendFile(`${__dirname}/failure.html`);
         // res.send('Error!!!!!!!!!!!');
      }
      response.on('data',data=>{
         console.log(JSON.parse(data));
      })
   })
   request.write(jsonData);
   request.end();
});

app.post('/failure',(req,res)=>{
   res.redirect('/');
})

app.listen(process.env.PORT||port,()=>{  //For the app to work both on heroku and locally
   console.log(`Server is running on port ${port}`) ;
});



// API Key
// 9a378d479fddf9afa31374dd0141de38-us8

// List id
// 90c4ab1281