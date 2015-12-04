Template.results.helpers({
    actor: function () {
        return Session.get('actor');
    },
    actorSearched: function () {
        return Session.get('actorSearched');
    },
    actorData: function () {
        return Session.get('actorData');
    },
    nMovies: function () {
        return Session.get('actorMovies').length;
    },
    actorPhoto: function(){
        return Session.get('actorData').urlPhoto;
    }

});


Template.results.rendered = function () {
    $('#fullpage').fullpage({
        anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
        menu: '#menu',

        css3: true,
        scrollingSpeed: 700,
        autoScrolling: false,
        fitToSection: true,
        fitToSectionDelay: 0, //200,
        scrollBar: true,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        continuousVertical: false,
        // normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        touchSensitivity: 15,
        // normalScrollElementTouchThreshold: 5,

        // design
        controlArrows: true,
        verticalCentered: true,
        // resize : false,
        paddingTop: '3em',
        paddingBottom: '10px',
        fixedElements: '#header, .footer',
        // responsiveWidth: 0,
        // responsiveHeight: 0,

        //Custom selectors
        sectionSelector: '.section',
        slideSelector: '.slide',

        //events
        onLeave: function(index, nextIndex, direction){},
        afterLoad: function(anchorLink, index){},
        afterRender: function(){},
        afterResize: function(){},
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
    });

    $('.navbar').show();
    
    gv = new GenreVis(d3.selectAll('#genreVis'), Session);
    pcv = new ParallelCoordVis(d3.selectAll('#parallelCoordVis'), Session);
    tlv = new TimeLineVis(d3.selectAll('#timelineVis'), Session);
    tmv = new TreeMapVis(d3.selectAll('#treemapVis'), Session);
    // tmv = new TreeMapVis_(d3.selectAll('#treemapVis'), Session);    
    //tlv = new  TimelineVis(d3.selectAll('#timelineVis'), Session);

}
