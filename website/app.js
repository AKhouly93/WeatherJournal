const generateButton = document.getElementById('generate');
const inputBox = document.getElementById('zip');
const feelingsBox = document.getElementById('feelings');
const errorMessage = document.getElementById('error');


//helper function that generates the url
function generateRequesrUrl(zipCode){
//
  const apiKey = ''; //add the API key you get from https://openweathermap.org/ here.
  return `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;
}
function showErrorMessage(message){
  errorMessage.innerHTML = message;
  //hide message after 2 sec.
  setTimeout(()=> errorMessage.innerHTML = '', 2000);
}

const getWeatherData = async (requestUrl)=>{
  const response = await fetch (requestUrl);
    try{
        const weatherData = await response.json();
        return weatherData;
    }catch(error){
      console.log("error");
    }
};

const postWeatherData = async ( url = '', data = {})=>{
  const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
   // Body data type must match "Content-Type" header        
    body: JSON.stringify(data), 
  });

    try {
      const newData = await response.json();
      return newData;
    }catch(error) {
      console.log("error");
    }
}

//event listeners
generateButton.addEventListener('click', ()=>{

if (inputBox.value !=''){

    const zipCode = inputBox.value.trim();  //removing any extra white spaces that user may add accidentally.
    getWeatherData(generateRequesrUrl(zipCode))
    .then(function(data){
      //from the API documentation we know that the date is stored in dt, temprature is stored in main.temp.
      //converting the Unix timestamp to a readable date string.
      let dt = new Date(data.dt * 1000);
      let newDate = dt.toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'});
      //posting the fetched data as well as user-entered feelings to the server.
      postWeatherData ('/postWeatherData', {date: newDate, temprature: data.main.temp, city: data.name, country: data.sys.country, feelings: feelingsBox.value})
      .then(updateUI())
    })
    .catch((error)=> {showErrorMessage('Oops! Something went wrong.');}); //catching any potential errors.
}
else{
//if the input box is empty or null an error message should appear to notify the user.
showErrorMessage('Please, enter a valid US zip code.');
}
});
// the updateUI async function works as a function that retrieves the app's data from server and updates the ui as well.
const updateUI = async ()=>{
    const request = await fetch('/getWeatherData');
    try{
      const fetchedData = await request.json();
      document.getElementById('city').innerHTML = fetchedData.city+", "+fetchedData.country;
      document.getElementById('temp').innerHTML = Math.round(fetchedData.temprature)+"°C";
      document.getElementById('date').innerHTML = fetchedData.date;
      document.getElementById('content').innerHTML = fetchedData.feelings;
    }catch(error){
      console.log("error");
    }
};
