import Popper from "popper.js";
import moment from "moment";
import Bootstrap from "bootstrap";
window.jQuery = $;
window.$ = $;

("use strict");

class GithubApi {
  // Set up the props we need for https://developer.github.com/v3/repos/
  constructor() {
    this.apiUrl = "https://api.github.com";
    this.userReposEndpoint = "/users/{username}/repos";

    this.registerEvent();
  }

  registerEvent() {
    // Get the elements from the DOM
    const form = document.querySelector("#username-form");
    const input = form.querySelector("input");

    // Register the event
    form.addEventListener("submit", e => {
      e.preventDefault();

      // Get the username and pass it to the next function
      const userName = input.value.trim();
      console.log(userName);
      this.getRepositories(userName);
    });
  }

  getRepositories(userName) {
    // Build the API Url for the user repositories
    // Use encodeURIComponent to make sure that e.g. spaces in the name get replaced by %20
    const url = `${this.apiUrl}${this.userReposEndpoint}`.replace("{username}", encodeURIComponent(userName));
    console.log("URL", url);

    // Make the API call to get unfiltered data
    fetch(url)
      .then(data => data.json())
      .then(repoData => {
        console.log(repoData);
        this.filterRepositories(repoData);
      });
  }

  filterRepositories(repoData) {
    // Filter the huge array of objects to the necessary data
    const repositories = repoData.map(repository => {
      return {
        name: repository.name,
        description: repository.description,
        language: repository.language,
        url: repository.html_url,
        createdAt: repository.created_at
      };
    });

    console.log(repositories);

    this.parseListTemplate(repositories);
  }

  parseListTemplate(repositories) {
    // Create the list group / table element and get the child-elements by a loop of the filtered repositories
    // The array of generated item templates needs to be joined with nothing (else broken by comma)
    const markup = `
    <div class="list-group">
    ${repositories.map(repository => this.parseListItemTemplate(repository)).join("")}
    </div>
    `;

    // Manipulate the DOM with the final markup
    document.querySelector("#repositories").innerHTML = markup;
  }

  parseListItemTemplate(repository) {
    // This is just the item template for the list which we need for the looping
    return `
        <a href="${repository.url}"
           target="_blank"
           class="list-group-item list-group-item-action flex-column align-items-start ">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1 repo_header">${repository.name}</h5>
            <small>${moment(repository.createdAt).fromNow()}</small>
          </div>
          <div class="d-flex w-100 justify-content-between">
          <p class="mb-1">
            ${repository.description}
          </p>
          <span>${repository.language}</span>
          </div>
        </a>
    `;
  }
}

const github = new GithubApi();
