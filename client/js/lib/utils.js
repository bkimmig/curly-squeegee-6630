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

filterData = function(movieData, keys) {
    var i = 0;
    var data = [];

    for (i=0; i<movieData.length; i++){
        var movie = movieData[i];
        keys.forEach(function(key) {
            if (movie[key] === 'NaN' || movie[key] === 'N/A' ) {
                movie[key] = 0.01;
            }

            if (key === 'Year' && movie[key].length > 4) {
                // take only the starting year
                movie[key] = movie[key].slice(0,4);
            }

            if (key === 'BoxOffice' && movie[key] !== 0.01) {
                var boxoffice = movie[key]
                if (boxoffice.indexOf(';') !== -1) {
                    boxoffice = boxoffice.split(";")[1];
                    boxoffice = "$" + boxoffice;
                }
                boxoffice = boxoffice.split("$")[1];
                boxoffice = boxoffice.split("M")[0];

                if (boxoffice.indexOf('k') !== -1) {
                    boxoffice = boxoffice.split("k")[0] / 1000.
                }

                movie[key] = boxoffice;
            }

        })
        // only want data if it is a movie
        if (movie.Type === 'movie') {
            data.push(movie);
        }
    }
    return data;
}

