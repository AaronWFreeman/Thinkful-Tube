const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const pageTokens =[];
var currentPage = 0;

function getDataFromApi(searchTerm, pageToken, callback) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part:'snippet',
      key:'AIzaSyAfCq_BD7Wo4tUtEedDc1WpVu4DKCk00iE',
      q: searchTerm,
      maxResults: '20',
      type: 'video'
    },
    dataType: 'JSON',
    type: 'get',
    success: callback
  }
  if (pageToken) {
    settings.data.pageToken = pageToken;
  }
  $.ajax(settings);
}

function renderResult(result) {
  const youTubeUrl = "http://www.youtube.com/watch?v="+result.id.videoId;
  // console.log(result.snippet);
  // renderResultNumber();
  return  `
  <div class="result">
    <div class="resultVid">
      <a target="_blank" href="${youTubeUrl}"><img src="${result.snippet.thumbnails.medium.url}"></a></div>
    <div class="titleDescription">
      <div class="returnTitle"><h2>${result.snippet.title}</h2></div>
      <div class="returnDescription">${result.snippet.description}</div>
    </div>
  </div>`;
}

function setPageTokens(nextPageToken, previousPageToken) {
  // if (nextPageToken) {
  //   $('.next').attr('nextToken', nextPageToken);
  // }
  // else {
  //   $('next').attr('nextToken', "");
  // }
  // if (previousPageToken) {
  //   $('.previous').attr('previousToken', previousPageToken);
  // }
  // else {
  //   $('previous').attr('previousToken', "");
  // }
  if (currentPage > 0) {
    $('.previous').prop("disabled", false);
  }
  if (nextPageToken && !pageTokens.find(x => x === nextPageToken)){
    pageTokens.push(nextPageToken);
  }
  if (currentPage < pageTokens.length - 1) {
    $('.next').prop("disabled", false);
  }
}

function displayYouTubeSearchData (data) {
  let nextPageToken = data.nextPageToken;
  let previousPageToken = data.previousPageToken;
  setPageTokens(nextPageToken, previousPageToken);
  const results = data.items.map (renderResult);
  $('.js-search-results').html(results);
  console.log(data);
}

function watchSubmit() {
  $('.js-search-form').on('submit', event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const searchTerm = queryTarget.val();
    queryTarget.val("");
    $('.js-search-results').attr('data-query', searchTerm );
    pageTokens.length = 0;
    pageTokens.push("");
    currentPage = 0;
    getDataFromApi(searchTerm, null, displayYouTubeSearchData);
  });
  // videoClick();
}

function watchPrevious() {
  $('.previous').on('click', function (event) {
      const pageIndex = currentPage-1;
      if (pageIndex < 0) return;
      const previousPageToken = pageTokens[pageIndex];
      if (pageIndex > 0 && !previousPageToken) return;
      event.preventDefault();
      currentPage--;
      $(this).prop('disabled', true);
      getDataFromApi($('.js-search-results').attr('data-query'), previousPageToken, displayYouTubeSearchData);
     });
}
function watchNext() {
  $('.next').on('click', function (event) {
      const pageIndex = currentPage+1;
      if (pageIndex >= pageTokens.length) return;
      const nextPageToken = pageTokens[pageIndex];
      if (!nextPageToken) return;
      event.preventDefault();
      currentPage++;
      $(this).prop('disabled', true);
      getDataFromApi($('.js-search-results').attr('data-query'), nextPageToken, displayYouTubeSearchData);
    });
}
function startUp() {
  watchSubmit();
  watchNext();
  watchPrevious();
}
$(startUp);
