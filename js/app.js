(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 93806bdf37539fb1263302c4cc0b5ec6b078ca957d3ad7c6fa3154710091a522'
            }
        })
        .then(response => response.json())
        .then(addImage)
        .catch(e => requestError(e, 'image'));

        function addImage(data) {
            let htmlContent = '';
            if (data && data.results && data.results.length > 1) {
                const firstImage = data.results[0];

                htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
            } else {
                htmlContent = `<div class="error-no-image">No images available</div>`;
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        };

        fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e24a6247b4404073bd02d373b48c674b`)
        .then(response => response.json())
        .then(addArticles)
        .catch (e => requestError(e, 'articles'));

        function addArticles(data) {
            let htmlContent = '';
            // if there is an article display this
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                const articles = data.response.docs
                htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`
                ).join('') + '</ul>';
            } else {
                // else display this
                htmlContent = '<div class="error-no-articles">No articles available</div>';
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        };

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
    });
})();
