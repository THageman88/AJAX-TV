const missingImg = "https://tinyurl.com/missing-tv";
const tvMazeUrl = "http://api.tvmaze.com/";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) { //get show by term
  const response = await axios({ //engage axios
    url: `${tvMazeUrl}search/shows?q=${term}`, //go to the tvMaze URL and search for the users term input
    method: "GET" //get info
  });

  return response.data.map(result => { //what do we want returned from our results?
    const show = result.show; // creating a variable for the show data to go
    return { // telling it to return:
      name: show.name, //show name
      id: show.id, // show id
      summary: show.summary, //show summary
      image: show.image ? show.image.medium : missingImg, //an image of the show, unless ones missing then use  the missing img url
    };
  });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() { //set up search 
  const term = $("#searchForm-term").val(); // gets the search title from the html side
  const shows = await getShowsByTerm(term); //waits to use the user input from the call to the getShowsByTerm makes to the API

  populateShows(shows); //add shows to list
}

$searchForm.on("submit", async function (evt) { //handles the submit from thw form
  evt.preventDefault();
  await searchForShowAndDisplay(); //wait for the sfsad info to come back
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { //get the show by id
  const response = await axios({ //wait for the results so info returns instead of a promise
    url: `${tvMazeUrl}shows/${id}/episodes`, //saws we want to go to the url that sorts by episode and ID
    method: "GET" //uses the get method to retrieve API info
  });

  return response.data.map(e => ({ //rettrieve and return a new array containing
    id: e.id, //id
    name: e.name, //name
    season: e.season, //season
    number: e.number, //episode number
  }));
}


/** Given list of episodes, create markup for each and to DOM */

function populateEpisodes(episodes) { //get episodes and add them to a list
  $episodesList.empty(); // start with an empty list

  for (let episode of episodes) { //reads api info that is retrieved
    const $item = $(`<li> ${episode.name}(season ${episode.season}, episode ${episode.number})</li>`); //says this is the info we want displayed

    $episodesList.append($item); // append the episode info to the episode list
  }

  $episodesArea.show();
}


/** Handle click on episodes button: get episodes for show and display */

async function getEpisodesAndDisplay(evt) { //create function to handle episodes click
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);