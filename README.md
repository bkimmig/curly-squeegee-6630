# curly-squeegee-6630
final project for CS 6630 visualization


## Final Project Ideas

Nicholas Cage Movies!

Data Sources
- OMDB api
- Rotten Tomatoes API
- Box Office Mojo ($$)

Things to track with visualization
- Genre
- Earnings
- Rating (critic, rotten totmatoes, users)
- Timeline
- Expense/Earning ratio


## Methods to get OMDB data

We can use the requests and json module in python (pip install requests, sudo apt-get requests).

### Example to get data

	import requests

	# get the data
	req = requests.get('http://www.omdbapi.com/?t=raising+arizona&y=&plot=short&r=json')

	# view the content of the request
	req.content()
	b'{"Title":"Raising Arizona","Year":"1987","Rated":"PG-13","Released":"17 Apr 1987","Runtime":"94 min","Genre":"Comedy, Crime, Drama","Director":"Joel Coen, Ethan Coen","Writer":"Ethan Coen, Joel Coen","Actors":"Nicolas Cage, Holly Hunter, Trey Wilson, John Goodman","Plot":"When a childless couple of an ex-con and an ex-cop decide to help themselves to one of another family\'s quintupelets, their lives get more complicated than they anticipated.","Language":"English","Country":"USA","Awards":"2 wins & 2 nominations.","Poster":"http://ia.media-imdb.com/images/M/MV5BMTg0NjYzOTUzNF5BMl5BanBnXkFtZTcwODkyMDMyMQ@@._V1_SX300.jpg","Metascore":"55","imdbRating":"7.4","imdbVotes":"92,811","imdbID":"tt0093822","Type":"movie","Response":"True"}'

	# then we need to use json library and save the data to files



