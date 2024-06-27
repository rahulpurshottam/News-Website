document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bc2f5a0862f0cc784307f7a1f4266622';

    const categoryTabs = document.querySelectorAll('.nav-link');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            categoryTabs.forEach(tab => tab.classList.remove('active'));
            event.currentTarget.classList.add('active');
            fetchAndDisplayNews(event.currentTarget.id);
        });
    });
    fetchAndDisplayNews('general');

    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('newsQuery').value.trim().toLowerCase();
        if (query) {
            searchNews(query);
        }
    });

    function fetchAndDisplayNews(category) {
        let url = '';

        switch (category) {
            case 'general':
                url = `https://gnews.io/api/v4/top-headlines?country=in&category=world&token=${API_KEY}`;
                break;
            case 'business':
                url = `https://gnews.io/api/v4/top-headlines?country=in&category=business&token=${API_KEY}`;
                break;
            case 'sports':
                url = `https://gnews.io/api/v4/top-headlines?country=in&category=sports&token=${API_KEY}`;
                break;
            case 'entertainment':
                url = `https://gnews.io/api/v4/top-headlines?country=in&category=entertainment&token=${API_KEY}`;
                break;
            case 'technology':
                url = `https://gnews.io/api/v4/top-headlines?country=in&category=technology&token=${API_KEY}`;
                break;
            default:
                url = `https://gnews.io/api/v4/top-headlines?country=in&token=${API_KEY}`;
                break;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.articles) {
                    displayNews(data.articles);
                } else {
                    console.error(`Error fetching ${category} news:`, data);
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            });
    }

    function displayNews(articles) {
        const newsContainer = document.getElementById('news-content');
        newsContainer.innerHTML = ''; 

        articles.forEach(article => {
            const newsArticle = document.createElement('div');
            newsArticle.className = 'news-article col';
            newsArticle.innerHTML = `
                <div class="card">
                    <img src="${article.image || 'default-news.jpg'}" class="card-img-top" alt="News headline image">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description || ''}</p>
                        <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
                    </div>
                </div>
            `;
            newsContainer.appendChild(newsArticle);
        });
    }

    function searchNews(query) {
        const url = `https://gnews.io/api/v4/search?q=${query}&token=${API_KEY}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.articles) {
                    displayNews(data.articles);
                } else {
                    const newsContainer = document.getElementById('news-content');
                    newsContainer.innerHTML = `<div class="col-12 text-center"><p>No articles found for "${query}"</p></div>`;
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            });
    }
});
