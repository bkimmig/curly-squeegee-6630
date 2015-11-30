#Curly-Squeegee Process Book #

Here, you can read about the design choices and  development process which shaped the final version of Curly-Squeegee.  Consider this more of an 'In the Actors Studio' view of an (a)typical project.

## Overview##

Curly-Squeegee (CS) is a tool for exploring and visualizing Actor filmographies in an interactive way.  By enabling users to search for their favorite actors and see their entire body of work displayed a variety of ways, we hope it invites them to explore the different views, select and filter different sub-sets of actor filmography data, and find intersting or surprising trends hidden within.

## Motivation ##

The idea for this project came from the fact that both developers watch a good amount of movies and enjoyed sites like IMDB and RottenTomatoes, but wanted something that focused on specific actors rather than being movie-centric.  CS  is their solution to needing to sift through lists and text to appreciate a given actors filmography.  In three views, one can see their entire body of work as a timeline, with length and color encodings for film-output and film-quality, respectively, as well as career visualizations showing the breakdown of movie genre over the course of their career and a multi-axis interactive plot to explore an actors output as a function of date ranges, ratings, box office earnings, and directors.  

CS is meant to provide a new way of viewing actor data, and seeks to facilitiate a fun and interactive web-based solution to questions like:
* How many movies has an actor acted in?
* Has an actor been type-cast to a specific genre?
* What is the best movie they have made?  The worst?
* Do they consistently star in well-reviews films?
* Has their career had a ``golden period`` where they enjoyed particularly regular work or well-reviewed films?


## Data  ##

This product utilizes the XXX API.  Information is queried for an actor, and their entire filmography is returned in JSON format.  We store this information in  a local MongoDB table

* Talk about local vs. server processing?
* Go into depth on MongoDB / Meteor?
* Discuss the any pre-processing which occurs ahead of time?  

## TO-DO List##
Things we need to address:
* Write up our project book, wiki pages on github
* Add datavisTA user to our project (share our repo)
* Include *trending actors*  on landing page
* Record student critiques in our process book?
* Make timeline view
* Record screencast with audio.

