# Curly Squeegee
Search for your favorite actors visualize their careers.

https://curly-squeegee.herokuapp.com/

Project page: https://curly-squeegee.herokuapp.com/

Screencast: https://youtu.be/9tPZ1Q9LibQ




## Data
All of our data is stored in mongolab. 

- https://www.mongolab.com/databases/heroku_261rf623#collections

## Code

All directories except .meteor contain code written by us. 

### Visualization Code
All visualization code lives in 
    
    $ client/js/lib/. 

In the directory above that we specify all of our views.

### Data Collection Code
This code lives in 
    
    $ server/

We have two files for collecting data from the APIs myapifilms_api.js and omdb_api.js. These are then instantiated in the startup file (startup.js).