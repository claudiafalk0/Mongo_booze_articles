function displayResults(data) {
    // Add to the table here...
    for (var i = 0; i < data.length; i++) {
        $(".carousel-inner").append(`<div class='carousel-item'>
            <img src='${data[i].img}' class='d-block w-100' style='padding-top: 25px;' alt='cocktail image'/>
            <div class='carousel-caption d-none d-md-block'>
            <h5>${data[i].title}</h5>
            <a href='${data[i].link}'>Link to article</a>
            <a class="saveArticle" href="/save" role="button" style = 'text-align:center'>
            <span>Save Article</span>
            </a>
            </div>
            </div>`
    )};
};



$.getJSON('/', function (data) {
    displayResults(data)
});