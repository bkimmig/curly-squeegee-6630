#Curly-Squeegee Process Book #

Here, you can read about the design choices and  development process which shaped the final version of Curly-Squeegee.  Consider this more of an 'In the Actors Studio' view of an (a)typical project.

## Overview##

Curly-Squeegee (CS) is a tool for exploring and visualizing Actor filmographies in an interactive way.  By enabling users to search for their favorite actors and see their entire body of work displayed a variety of ways, we hope it invites them to explore the different views, select and filter different sub-sets of actor filmography data, and find intersting or surprising hidden trends.

## Motivation ##

The idea for this project came from the fact that both developers watch a good amount of movies and enjoyed sites like IMDB and RottenTomatoes, but wanted something that focused on specific actors rather than being movie-centric.  CS  is their solution to needing to sift through lists and text to appreciate a given actors filmography.  In three views, one can see their entire body of work as a timeline, with length and color encodings for film-output and film-quality, respectively, as well as career visualizations showing the breakdown of movie genre over the course of their career and a multi-axis interactive plot to explore an actors output as a function of date ranges, ratings, box office earnings, and directors.  

CS is meant to provide a new way of viewing actor data, and seeks to facilitiate a fun and interactive web-based solution to questions like:
* How many movies has an actor acted in?
* Has an actor been type-cast to a specific genre?
* What is the best movie they have made?  The worst?
* Do they consistently star in well-reviews films?
* Has their career had a ``golden period`` where they enjoyed particularly regular work or well-reviewed films?


## Data  ##

This application readily takes advantage of several pre-packaged movie APIs, specifically My API Films and OMdb.  We have set up a web framework using node.hs and Meteor which uses a RESTful architecture to gather API calls via GET requests.  We store all data in a MongoDB database.  This dataset is fairly dynamic, so we rely on user queries to pull the necessary information from the APIs.

### Data Processing ###

API requests are returned in JSON format, so there is little clean-up beyond. Returned data is fairly detailed, so we selectively cull certain uncessary fields and aggregate filmography data based on what we want to visualize.  We have two data structures in our databases:

* Actor Table: THis stores all the actor information of a selected actor, including the movies they've acted in.
* Movie Table: This contains all of the information for each movie we wish to plot or visualize.

The data collection and filtering is probably the most sophisticated portion of this project.  With everything stored and readily accessible, we use built-in javascript math functions and agregate parameter counts of our actor data to illustrate actor filmographies.

*To add?*
* Talk about local vs. server processing?
* Go into depth on MongoDB / Meteor?
* Discuss more on pre-processing which occurs ahead of time? 




## Project Evolution ##

A few Early drawings and design goals did not pan out as we had expected.  for example, the Genre View of an actors career was more underwhelming and unclear than we expected

*include hand-drawing and screenshot side by side*

Here, we see a visualization of XXXXXXX filmography.   We did not expect the larger number of one-off genre classifications (Family, documentary, Crime) nor did we account for the somewhat subjective genre labling of a given film.  We paused development on this feature shortly after it was operational and decided we would explore an alternative method of genre-classification of the actors filmography.

##Implementation ##

>Add something here about the functionality of our visualizations.  Lots of pictures of hover, scrubbing, linked highlighting (?), and bars.

# Team Evaluation#
*Brian Kimmig*:  Brian was responsible for the API calls, data collection, and database wrangling.  His experience as a web developer was very helpful for  making this portion of the project go very smoothly.  Brian also created the project framework, and parallel coordinate view.

*Jimmy Moore*  Jimmy was the lead scribe for the group and was responsible for project documentation including the proposal and process book. He also coded the Actor photo and display box features and filmography timeline visualization.


## TO-DO List##
Things we need to address:
* Write up our project book, wiki pages on github
* Add datavisTA user to our project (share our repo)
* Include *trending actors*  on landing page
* Record student critiques in our process book?
* Make timeline view
* Record screencast with audio.

