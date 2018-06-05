(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');    
    const responseContainer = document.querySelector('#response-container');
    let searchedForText;
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // Images
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
            requestError(err, 'img');
        };
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 93806bdf37539fb1263302c4cc0b5ec6b078ca957d3ad7c6fa3154710091a522');
        unsplashRequest.send();

        // Articles
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        }
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e24a6247b4404073bd02d373b48c674b`);
        articleRequest.send();
    });
    
    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        // if there is an img display this
        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure> 
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaptions>${searchedForText} by ${firstImage.user.name}</figcaptions>
            </figure>`;
        } else {
            // else display this
            htmlContent = '<div class="error-no-image">No images available</div>';
        }
        
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() { 
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        // if there is an article display this
        if (data.response && data.response.docs && data.response.docs.length > 1) {            
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
    }
})();
