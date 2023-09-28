const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const axios = require("axios");
const { PythonShell }=require("python-shell");
const app=express();

let storeImage=[];
let storeName=[];
let storeSummary=[];
let userFav;
var recommendationList=[];
var global1="";
var global2="";
var global3="";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get("/",function(req,res){
res.render("home");
});

app.get("/search",function(req,res){
res.render("search",{images:storeImage,titles:storeName,summaries:storeSummary});
storeImage=[];
storeName=[];
storeSummary=[];
})

app.get("/recommendation",function(req,res){
res.render("recommendationSystem.ejs");
});



app.post("/",async function(req,res){
const searchTerm=req.body.movieName;
const rez=await axios.get(`http://api.tvmaze.com/search/shows?q=${searchTerm}`);
for(let result of rez.data){
if(result.show.image){
storeImage.push(result.show.image.medium );
storeName.push(result.show.name);
storeSummary.push(result.show.summary);
}
}
console.log(storeImage);
console.log(storeName);
res.redirect("/search");
});


app.get("/movies",async function(req,res){
const axios = require('axios'); // Make sure to require axios at the beginning of your file.

// Assuming your code is inside an async function
async function fetchRecommendationImages() {
  const recommendationImage = [];

  for (const movieTitle of recommendationList) {
    const apiKey = '20254315'; // Replace with your API apiKey
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const movieData = response.data;

      if (movieData.Poster !== 'N/A') {
        const moviePosterURL = movieData.Poster;
        recommendationImage.push(moviePosterURL);
        console.log("Fine");
        console.log(moviePosterURL);
      } else {
        console.log('No poster available for this movie.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  console.log("All API requests completed");
  console.log(recommendationImage);
  res.render('result', { recommendationLists: recommendationList, recommendationImages: recommendationImage ,global1s:global1 ,global2s:global2 ,global3s:global3 });
}

// Call the function to start fetching recommendation images
fetchRecommendationImages();
});

app.post("/recommendation",async function(req,res){
  userFav1 = req.body.firstMovie;
      userFav2 = req.body.secondMovie;
      userFav3 = req.body.thirdMovie;
 global1=userFav1;
 global2=userFav2;
 global3=userFav3;
      let options = {
          mode: 'text',
          pythonOptions: ['-u'], // get print results in real-time
          scriptPath: 'C:/Users/atul2/Documents/movieRecommendation',
          args: [userFav1, userFav2, userFav3]
      };

      try {
          const messages = await PythonShell.run('movieRecommendation.py', options);
          // results is an array consisting of messages collected during execution
          let list = [];
          if (messages && messages.length > 0) {
              list = messages; // Assuming the result is in the first message
          }
          recommendationList = list;
          console.log(list);
          res.redirect("/movies");
      } catch (error) {
          console.error("Error:", error);
          res.status(500).send("An error occurred.");
      }
});

app.listen(3000,function(req,res){
console.log("running on 3000");
});
