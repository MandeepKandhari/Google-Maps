const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());


const Google_Maps_Key = process.env.Google_Maps_Key


const googleMapsClient = require('@google/maps').createClient({
  key: Google_Maps_Key,
  Promise: Promise
});


app.get('/',(req,res)=>{
	res.json('This app is working!!!')
})


app.put('/search',(req,res)=>{

const {searchQuery, location} = req.body;	

const autoComplete = new googleMapsClient.placesQueryAutoComplete({
      input: searchQuery,
      language: 'en',
      location: location
    })
    .asPromise()
    .then(response=> {
      res.json(response.json.predictions)
	})
	.catch(err=>console.log('autoCompleteRequest', err))
})

app.put('/placesNearby',(req,res)=>{

const { searchType, location } = req.body;

const placesNearby = new googleMapsClient.placesNearby({
	language: 'en',
	location: location,
	radius: 2000,
  minprice: 1,
	maxprice: 4,
	opennow: true,
	type: searchType

})
    console.log(searchType)
    placesNearby.asPromise()
    .then(response=>res.json(response.json.results))	
})





app.post('/textsearch', (req, res)=>{
	const { query, location } = req.body;
	console.log(query);


const queryPlace = new googleMapsClient.findPlace({
      input: query,
      inputtype: 'textquery',
      language: 'en'
})

queryPlace.asPromise()
	.then(response=>{
		console.log('placeid', response.json.status)

		if(response.json.status === 'ZERO_RESULTS'){
			console.log('Hello place id is not defined')
		const zeroResults = new googleMapsClient.places({
	      query: query,
	      language: 'en',
	      location: location,
	      radius: 2000,
	      minprice: 1,
	      maxprice: 4,
	      opennow: true
	    })

    zeroResults.asPromise()
    .then(response=> res.json(response.json.results)) 
	} else{
		console.log('Hello place id is defined')
		placeid = response.json.candidates[0].place_id
		const detailedSearch = new googleMapsClient.place({
    	placeid: placeid,
    	language: 'en'
   	})

detailedSearch.asPromise()
    .then(response=> res.json(response.json.result))
    .catch(err=>console.log('detailedSearch', err))
   	}
	})
	.catch(err=>console.log('queryPlace',err))

})


app.post('/placesSearch', (req,res)=>{
  const { placeid } = req.body;

  const detailedSearch = new googleMapsClient.place({
      placeid: placeid,
      language: 'en'
    })

detailedSearch.asPromise()
    .then(response=> res.json(response.json.result))
    .catch(err=>console.log('detailedSearch', err))
})



app.put('/photo', (req, res)=>{
const { photoreference } = req.body;

const photo = new googleMapsClient.placesPhoto({
  photoreference:photoreference,
  maxwidth: 1000,
  maxheight: 1000
    })

photo.asPromise()
.then(response=>res.json(response.requestUrl))

})



app.listen(8080);


/*
app.put('/photo', (req, res)=>{
const { photoreference } = req.body;

const photo = new googleMapsClient.placesPhoto({
	photoreference:photoreference
  	})

photo.asPromise()
.then(response=>console.log(response))
})

*/
/*googleMaps.placesPhoto({
      photoreference: 'CnRvAAAAwMpdHeWlXl-lH0vp7lez4znKPIWSWvgvZFISdKx45AwJVP1Qp37YOrH7sqHMJ8C-vBDC546decipPHchJhHZL94RcTUfPa1jWzo-rSHaTlbNtjh-N68RkcToUCuY9v2HNpo5mziqkir37WU8FJEqVBIQ4k938TI3e7bf8xq-uwDZcxoUbO_ZJzPxremiQurAYzCTwRhE_V0',
      maxwidth: 100,
      maxheight: 100
    })
    .asPromise()
    .then(function(response) {
      expect(response.headers['content-type']).toBe('image/jpeg');
    })
    .then(done, fail);
});
googleMaps.placesPhoto({
      photoreference: 'CnRvAAAAwMpdHeWlXl-lH0vp7lez4znKPIWSWvgvZFISdKx45AwJVP1Qp37YOrH7sqHMJ8C-vBDC546decipPHchJhHZL94RcTUfPa1jWzo-rSHaTlbNtjh-N68RkcToUCuY9v2HNpo5mziqkir37WU8FJEqVBIQ4k938TI3e7bf8xq-uwDZcxoUbO_ZJzPxremiQurAYzCTwRhE_V0',
      maxwidth: 100,
      maxheight: 100
    })
    .asPromise()
    .then(function(response) {
      expect(response.headers['content-type']).toBe('image/jpeg');
    })
    .then(done, fail);
});
*/


/*
const places = new googleMapsClient.places({
      query: query,
      language: 'en',
      location: location,
      radius: 5000,
      minprice: 1,
      maxprice: 4,
      opennow: true
    })

    places.asPromise()
    .then(response=>console.log(response.json.results))
*/


/*gets photo of the places
const photos = googleMapsClient.placesPhoto({
      photoreference: 'CnRvAAAAwMpdHeWlXl-lH0vp7lez4znKPIWSWvgvZFISdKx45AwJVP1Qp37YOrH7sqHMJ8C-vBDC546decipPHchJhHZL94RcTUfPa1jWzo-rSHaTlbNtjh-N68RkcToUCuY9v2HNpo5mziqkir37WU8FJEqVBIQ4k938TI3e7bf8xq-uwDZcxoUbO_ZJzPxremiQurAYzCTwRhE_V0',
      maxwidth: 100,
      maxheight: 100
    })
    photos.asPromise()
    .then(response=> (response.headers['content-type']).toBe('image/jpeg'));



*/



/*code for returning places based on the text search queries

const places = new googleMapsClient.places({
  query: query,
  language: 'en',
  radius: 500,
  minprice: 1,
  maxprice: 4,
  opennow: true,
  type: 'restaurant'
})
	places.asPromise()
	.then(response=>console.log(response.json.results))

*/

/*Code for giving the directions from the origin to the destination

const directions = new googleMapsClient.directions({
      origin: 'Town Hall, Sydney, NSW',
      destination: 'Parramatta, NSW',
    })



 	directions.asPromise()
	.then(response=>console.log(response.json.routes))

*/

/*
const detailedSearch = new googleMapsClient.place({
    	placeid: placeid,
    	language: 'en',
    /*	fields: v.optional(utils.arrayOf(v.oneOf([
      	'address_component', 'adr_address', 'alt_id', 'formatted_address',
      	'geometry', 'icon', 'id', 'name', 'permanently_closed', 'photo',
      	'place_id', 'scope', 'type', 'url', 'utc_offset', 'vicinity',
      	'formatted_phone_number', 'international_phone_number', 'opening_hours',
      'website', 'price_level', 'rating', 'review',
    ]), ',')), 
})

detailedSearch.asPromise()
    .then(response=>console.log(response.json.result.geometry.location))
    .catch(err=>console.log('detailedSearch', err))

*/

/*returns the place_id of the searched place
const queryPlace = new googleMapsClient.findPlace({
      input: query,
      inputtype: 'textquery',
      language: 'en'
})

queryPlace.asPromise()
	.then(response=>console.log(response.json.candidates[0]))

*/

/* placeRadar has been deprecated

const placesRadar = new googleMapsClient.placesRadar({
    location: [-33.865, 151.038],
    radius: 500,
    language: 'en',
    minprice: 1,
    maxprice: 4,
    opennow: true,
    type: 'restaurant',
})

placesRadar.asPromise()
.then(response=>console.log(response))
    
*/


/*Returns search results for NearBYPlaces
const placesNearby = new googleMapsClient.placesNearby({
	language: 'en',
	location: [43.625, -79.765],
	rankby: 'distance',
	minprice: 1,
	maxprice: 4,
	opennow: true,
	type: 'restaurant'
})
    placesNearby.asPromise()
    .then(response=>console.log(response.json.results))
*/


/*returns the latitude and longitude of a location
const geoCode = new googleMapsClient.geocode({
    address: query,
    language: 'en'
})
 	geoCode.asPromise()
	.then(response=>console.log(response.json.results[0].geometry.location))  
*/
