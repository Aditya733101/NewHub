const apiKey="3acabe60cbb147db98177a357d44ba4f";
const BlogContainer = document.querySelector(".blog-item");
const searchBtn = document.querySelector("#search-btn");

async function fetchRandomNews() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=${apiKey}`
    );
    if (response.status === 426) {
      throw new Error(
        "Upgrade Required. Please check if the API version has been updated."
      );
    }
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching random news: ", error);
    return [];
  }
}

const categoryDropdown = document.getElementById("category-dropdown");
categoryDropdown.addEventListener("change", async () => {
  const categoryValue = categoryDropdown.value;
  console.log(categoryValue);
  const articlesCategory = await fetchCategoryBlogs(categoryValue);
  displayBlogs(articlesCategory);
});

// catagory search :-
async function fetchCategoryBlogs(categoryValue) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${categoryValue}&pageSize=12&apiKey=${apiKey}`
    );
    const data = await response.json();
    const headline = document.querySelector(".headline");
    if (categoryValue === "Category") {
      location.reload();
    } else {
      headline.textContent = `Top Headline On - ${categoryValue}`;
    }
    return data.articles;
  } catch (error) {
    console.log("error fetching news by category ", error);
    return [];
  }
}

searchBtn.addEventListener("click", async () => {
  const searchInput = document.querySelector("#search-input").value.trim(); // Retrieve input value when button is clicked
  if (searchInput !== "") {
    const articles = await fetchRandomQuery(searchInput);
    displayBlogs(articles);
  }
});

// Add an event listener for the keydown event :-
const inputField = document.getElementById("search-input");
inputField.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const searchQuery = inputField.value.trim();
    if (searchQuery !== "") {
      const articles = await fetchRandomQuery(searchQuery);
      displayBlogs(articles);
    }
  }
});
//search  query :-
async function fetchRandomQuery(query) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&pageSize=12&apiKey=${apiKey}`
    );
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.log("error fetching news by query ", error);
    return [];
  }
}

//display blogs
function displayBlogs(articles) {
  BlogContainer.innerHTML = "";
  if (articles && articles.length > 0) {
    articles.forEach((article) => {
      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");
      const img = document.createElement("img");
      // Set the image source and alt attribute
      img.src = article.urlToImage || "./does_not_show_img.jpeg";
      img.alt = "Image not available";

      // Event listener to handle image loading failure
      img.onerror = function () {
        img.src = "./does_not_show_img.jpeg";
      };

      const div2 = document.createElement("div");
      div2.classList.add("tit-dis");

      const title = document.createElement("h2");
      const truncatedTitle =
        article.title.length > 35
          ? article.title.slice(0, 35) + "...."
          : article.title;
      title.textContent = truncatedTitle;

      const description = document.createElement("p");
      const truncatedDescription =
        article.description && article.description.length > 90
          ? article.description.slice(0, 90) + "..."
          : article.description;
      description.textContent = truncatedDescription;

      const btn = document.createElement("button");
      btn.classList.add("see-btn");
      btn.textContent = "See More..";

      blogCard.appendChild(img);
      div2.appendChild(title);
      div2.appendChild(description);
      div2.appendChild(btn);
      blogCard.appendChild(div2);

      btn.addEventListener("click", () => {
        window.open(article.url, "_blank");
      });

      BlogContainer.appendChild(blogCard);
    });
  } else {
    const error = document.createElement("p");
    error.textContent = "NO ARTICLES FOUND";
    BlogContainer.appendChild(error);
  }
}

const fetchAndDisplayNews = async () => {
  try {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
  } catch (error) {
    console.error("error fetching random news ", error);
  }
};
fetchAndDisplayNews();
