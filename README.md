# Three Day-Trip Itineraries AI Website


### Overview
This project aims to build a website that provides users with three different day-trip itineraries in various countries around the world. The website features a homepage with a menu linking to three pages, each representing a different itinerary with maps and detailed routes. The maps and routes are created using Leaflet.js, and the design is enhanced with CSS for an aesthetically pleasing layout.

### Features
**Homepage:**

The homepage is index.html.<br>
Contains a menu linking to three different itinerary pages.<br>
#### Itinerary Pages:

Each itinerary page includes a map with routes created using Leaflet.js.<br>
Users can select the country and type of trip (walking, driving, cycling).<br>
Each page features an AI-generated image related to the itinerary using the Stable Horde API.<br>
User choices and generated images are stored in a database.<br>
Technologies Used<br>
Frontend: HTML, CSS, JavaScript (React)<br>
Backend: Python, JavaScript<br>
Mapping: Leaflet.js<br>
AI Image Generation: Stable Horde API<br>
Database: To store user choices and generated images<br>


### Getting Started
#### Prerequisites <br>
Node.js and npm<br>
Python<br>
A modern web browser


##### Setting up dbClient.js:
In dbClient.js, you can manage your MongoDB database connections and image storage. Here's a sample structure for dbClient.js: <br>

// Function to connect to MongoDB<br>
module.exports.connectToDb = () =><br>
  &nbsp;mongoose<br>
   &nbsp; .connect(<br>
     &nbsp;&nbsp;       "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority", // ADD HERE YOUR mongodb details<br>
   &nbsp; )
<br>

#### Make sure to replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual MongoDB connection details.
