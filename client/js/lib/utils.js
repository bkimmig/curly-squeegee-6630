removeUnreleasedMovies = function(movieData) {
    var i = 0;
    var data = [];

    for (i=0; i<movieData.length; i++){
        var movie = movieData[i];
        // var releaseDate = new Date(movie.Released);
        if (movie.Released !== "N/A") {
            var releaseDate = moment(movie.Released, "DD-MMM-YYYY");
            var now = moment();
            if (!releaseDate.isAfter(now)) {
                data.push(movie);
            }
        }
    }
    return data;
}

nanToZero = function(movieData, keys) {
    var i = 0;
    var data = [];

    for (i=0; i<movieData.length; i++){
        var movie = movieData[i];
        keys.forEach(function(key) {
            if (movie[key] === 'NaN' || movie[key] === 'N/A' ) {
                movie[key] = 0;
            }

            if (key === 'Year' && movie[key].length > 4) {
                // take only the starting year
                movie[key] = movie[key].slice(0,4);
            }

        })
        data.push(movie);
    }
    return data;
}

