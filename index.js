import {
    bio,
    bio2,
    skills,
    education,
    experience,
    // trekking,
    footer,
    featuredRepos
} from "./user-data/data.js";

import { URLs } from "./user-data/urls.js";

const { medium, gitConnected, gitRepo } = URLs;

async function fetchBlogsFromMedium(url) {
    try {
        const response = await fetch(url);
        const { items } = await response.json();
        populateBlogs(items, "blogs");
    } catch (error) {
        throw new Error(
            `Error in fetching the blogs from Medium profile: ${error}`
        );
    }
}

async function fetchReposFromGit(url) {
    try {
        const response = await fetch(url);
        let fetchedRepos = await response.json();

        // Ensure only the featuredRepos are displayed, but try to add additional details from fetchedRepos
        let items = featuredRepos.map(featuredRepo => {
            const fetchedRepo = fetchedRepos.find(repo => repo.name.toLowerCase() === featuredRepo.name.toLowerCase());

            return {
                ...featuredRepo, // Start with the predefined featuredRepo
                description: fetchedRepo ? fetchedRepo.description : "No description available.",
                stars: fetchedRepo ? fetchedRepo.stargazers_count : 0, // Adding stars if available
                lastUpdated: fetchedRepo ? fetchedRepo.updated_at : "N/A",
            };
        });

        populateRepo(items, "repos");
    } catch (error) {
        console.error(`Error fetching the repos: ${error}`);
    }
}

async function fetchGitConnectedData(url) {
    try {
        const response = await fetch(url);
        const { basics } = await response.json();
        // populateBlogs(items, "blogs");
        mapBasicResponse(basics);
    } catch (error) {
        throw new Error(`Error in fetching the blogs from git connected: ${error}`);
    }
}

function mapBasicResponse(basics) {
    const {
        name,
        label,
        image,
        email,
        phone,
        url,
        summary,
        profiles,
        headline,
        blog,
        yearsOfExperience,
        username,
        locationAsString,
        region,
        karma,
        id,
        followers,
        following,
        picture,
        website,
    } = basics;

    // added title of page
    window.parent.document.title = "Winston Tsui";
}

function populateBio(items, id) {
    const bioTag = document.getElementById(id);
    items.forEach((bioItem) => {
        const p = getElement("p", null);
        p.innerHTML = bioItem;
        bioTag.append(p);
    });
}

function populateSkills(items, id) {
    const skillsTag = document.getElementById(id);
    items.forEach((item) => {
        const h3 = getElement("li", null);
        h3.innerHTML = item;

        const divProgressWrap = getElement("div", "progress-wrap");
        divProgressWrap.append(h3);

        const divAnimateBox = getElement("div", "col-md-12 animate-box");
        divAnimateBox.append(divProgressWrap);

        skillsTag.append(divAnimateBox);
    });
}

// function populateTrekking(items) {
//     const skillsTag = document.getElementById('trekking');
//     items.forEach((item) => {
//         const h3 = getElement("li", null);
//         h3.innerHTML = item;

//         const divProgressWrap = getElement("div", "progress-wrap");
//         divProgressWrap.append(h3);

//         const divAnimateBox = getElement("div", "col-md-12 animate-box");
//         divAnimateBox.append(divProgressWrap);

//         skillsTag.append(divAnimateBox);
//     });
// }

function populateBlogs(items, id) {
    const projectdesign = document.getElementById(id);
    const count = 3; // Number of blogs to display

    for (let i = 0; i < count; i++) {
        // Create a wrapper for the blog card
        const blogCard = document.createElement("div");
        blogCard.className = "blog-card";
        blogCard.style = `
            display: flex;
            flex-direction: column;
            border-radius: 12px;
            padding: 16px;
            font-size: 14px;
            background: linear-gradient(135deg, rgb(255, 221, 153), rgb(249, 191, 63));
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            min-height: 150px;
            cursor: pointer;
        `;

        // Wrap the card content in an anchor tag
        const blogLink = document.createElement("a");
        blogLink.href = items[i].link;
        blogLink.target = "_blank";
        blogLink.style = "text-decoration: none; color: black; display: block;";

        blogCard.appendChild(blogLink);

        // Blog Title
        const blogTitle = document.createElement("h4");
        blogTitle.className = "blog-heading";
        blogTitle.innerHTML = items[i].title;
        blogTitle.style = "margin: 0 0 8px; font-size: 18px; font-weight: bold;";
        blogLink.appendChild(blogTitle);

        // Publish Date
        const pubDateEle = document.createElement("p");
        pubDateEle.className = "publish-date";
        pubDateEle.innerHTML = getBlogDate(items[i].pubDate);
        pubDateEle.style = "margin: 0 0 12px; font-size: 12px; color: #555;";
        blogLink.appendChild(pubDateEle);

        // Blog Description
        const blogDescription = document.createElement("p");
        blogDescription.className = "blog-description";
        const html = items[i].content;
        const [, doc] = /<p>(.*?)<\/p>/g.exec(html) || [];
        blogDescription.innerHTML = doc;
        blogDescription.style = "margin: 0 0 12px; font-size: 12px; color: #000;";
        blogLink.appendChild(blogDescription);

        // Categories (Tags)
        const categoriesDiv = document.createElement("div");
        categoriesDiv.style = "display: flex; gap: 8px; margin-top: 12px;";

        for (const category of items[i].categories) {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.innerHTML = category;
            badge.style = `
                font-size: 12px;
                padding: 4px 8px;
                background-color: #007acc;
                color: white;
                border-radius: 4px;
            `;
            categoriesDiv.appendChild(badge);
        }

        blogLink.appendChild(categoriesDiv);

        // Append the blog card to the container
        projectdesign.appendChild(blogCard);
    }
}

function populateRepo(items, id) {
    const projectdesign = document.getElementById(id);
    projectdesign.innerHTML = ""; // Clear previous content

    if (items.length === 0) {
        projectdesign.innerHTML = "<p>No repositories found.</p>";
        return;
    }

    const rowWrapper = document.createElement("div");
    rowWrapper.style = "display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between;";
    projectdesign.appendChild(rowWrapper);
 
    for (let i = 0; i < items.length; i++) {
        const repo = items[i];

        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.style = `
        flex: 1 0 100%;  
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 12px;
        padding: 16px;
        font-size: 14px;
        background: linear-gradient(135deg, #ffdd99, #f9bf3f);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
        cursor: pointer;
    `;

        const repoLink = document.createElement("a");
        repoLink.href = `https://github.com/${repo.author}/${repo.name}`;
        repoLink.target = "_blank";
        repoLink.style = "text-decoration: none; color: black; display: block; height: 100%;";

        repoCard.appendChild(repoLink);

        const repoName = document.createElement("h4");
        repoName.className = "repo-heading";
        repoName.innerHTML = repo.name;
        repoName.style = "margin: 0; font-size: 18px; font-weight: bold;";
        repoLink.appendChild(repoName);

        if (repo.description) {
            const repoDescription = document.createElement("p");
            repoDescription.className = "repo-description";
            repoDescription.innerHTML = repo.description;
            repoDescription.style = "margin-top: 8px; font-size: 12px; color: #555;";
            repoLink.appendChild(repoDescription);
        }

        if (repo.images && repo.images.length > 0) {
            const imageContainer = document.createElement("div");
            imageContainer.style = `
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                margin-top: 10px;
                width: 100%;
            `;
    
            repo.images.forEach(imagePath => {
                const img = document.createElement("img");
                img.src = imagePath;
                img.alt = `${repo.name} preview`;
                img.style = `
                    max-width: 100%;
                    width: 350px;
                    height: auto;
                    object-fit: cover;
                    border-radius: 8px;
                    margin: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                `;
    
                // Add media query for responsiveness
                const mediaStyle = document.createElement('style');
                mediaStyle.textContent = `
                    @media screen and (max-width: 768px) {
                        img[alt="${img.alt}"] {
                            width: 100%;
                            max-width: 200px;
                            margin: 5px;
                        }
                    }
                    @media screen and (max-width: 480px) {
                        img[alt="${img.alt}"] {
                            width: 100%;
                            max-width: 150px;
                            margin: 5px;
                        }
                    }
                `;
                document.head.appendChild(mediaStyle);
    
                imageContainer.appendChild(img);
            });
    
            repoLink.appendChild(imageContainer);
        }

        rowWrapper.appendChild(repoCard);
    }
}



function populateExp_Edu(items, id) {
    let mainContainer = document.getElementById(id);

    for (let i = 0; i < items.length; i++) {
        let spanTimelineSublabel = document.createElement("span");
        spanTimelineSublabel.className = "timeline-sublabel";
        spanTimelineSublabel.innerHTML = items[i].subtitle;

        let spanh2 = document.createElement("span");
        spanh2.innerHTML = items[i].duration;

        let h2TimelineLabel = document.createElement("h2");
        h2TimelineLabel.innerHTML = items[i].title;
        h2TimelineLabel.append(spanh2);

        let divTimelineLabel = document.createElement("div");
        divTimelineLabel.className = "timeline-label";
        divTimelineLabel.append(h2TimelineLabel);
        divTimelineLabel.append(spanTimelineSublabel);

        for (let j = 0; j < items[i].details.length; j++) {
            let pTimelineText = document.createElement("p");
            pTimelineText.className = "timeline-text";
            pTimelineText.innerHTML = "&blacksquare; " + items[i].details[j];
            divTimelineLabel.append(pTimelineText);
        }

        let divTags = document.createElement("div");
        for (let j = 0; j < items[i].tags.length; j++) {
            let spanTags = document.createElement("span");
            spanTags.className = "badge";
            spanTags.innerHTML = items[i].tags[j];
            divTags.append(spanTags);
        }
        divTimelineLabel.append(divTags);

        let iFa = document.createElement("i");
        iFa.className = "fa fa-" + items[i].icon;

        let divTimelineIcon = document.createElement("div");
        divTimelineIcon.className = "timeline-icon color-2";
        divTimelineIcon.append(iFa);

        let divTimelineEntryInner = document.createElement("div");
        divTimelineEntryInner.className = "timeline-entry-inner";
        divTimelineEntryInner.append(divTimelineIcon);
        divTimelineEntryInner.append(divTimelineLabel);

        let article = document.createElement("article");
        article.className = "timeline-entry animate-box";
        article.append(divTimelineEntryInner);

        mainContainer.append(article);
    }

    let divTimelineIcon = document.createElement("div");
    divTimelineIcon.className = "timeline-icon color-2";

    let divTimelineEntryInner = document.createElement("div");
    divTimelineEntryInner.className = "timeline-entry-inner";
    divTimelineEntryInner.append(divTimelineIcon);

    let article = document.createElement("article");
    article.className = "timeline-entry begin animate-box";
    article.append(divTimelineEntryInner);

    mainContainer.append(article);
}

function populateLinks(items, id) {
    let footer = document.getElementById(id);

    items.forEach(function(item) {
        if (item.label !== "copyright-text") {
            let span = document.createElement("span");
            span.className = "col";

            let p = document.createElement("p");
            p.className = "col-title";
            p.innerHTML = item.label;
            span.append(p);

            let nav = document.createElement("nav");
            nav.className = "col-list";

            let ul = document.createElement("ul");
            item.data.forEach(function(data) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                if (data.link) {
                    a.href = data.link;
                    a.target = "_blank";
                }
                if (data.func) {
                    a.setAttribute("onclick", data.func);
                }
                a.innerHTML = data.text;

                li.append(a);
                ul.append(li);
            });
            nav.append(ul);
            span.append(nav);
            footer.append(span);
        }

        if (item.label === "copyright-text") {
            let div = document.createElement("div");
            div.className = "copyright-text no-print";
            item.data.forEach(function(copyright) {
                let p = document.createElement("p");
                p.innerHTML = copyright;
                div.append(p);
            });
            footer.append(div);
        }
    });
}

function getElement(tagName, className) {
    let item = document.createElement(tagName);
    item.className = className;
    return item;
}

function getBlogDate(publishDate) {
    const elapsed = Date.now() - Date.parse(publishDate);

    // Time conversions in milliseconds
    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    if (elapsed < msPerMinute) {
        const seconds = Math.floor(elapsed / msPerSecond);
        return `${seconds} seconds ago`;
    } else if (elapsed < msPerHour) {
        const minutes = Math.floor(elapsed / msPerMinute);
        return `${minutes} minutes ago`;
    } else if (elapsed < msPerDay) {
        const hours = Math.floor(elapsed / msPerHour);
        return `${hours} hours ago`;
    } else if (elapsed < msPerMonth) {
        const days = Math.floor(elapsed / msPerDay);
        return days == 1 ? `${days} day ago` : `${days} days ago`;
    } else if (elapsed < msPerYear) {
        const months = Math.floor(elapsed / msPerMonth);
        return months == 1 ? `${months} month ago` : `${months} months ago`;
    } else {
        const years = Math.floor(elapsed / msPerYear);
        return years == 1 ? `${years} year ago` : `${years} years ago`;
    }
}

populateBio(bio, "bio");
populateBio(bio2, "bio2");

populateSkills(skills, "skills");

fetchBlogsFromMedium(medium);
fetchReposFromGit(gitRepo);
fetchGitConnectedData(gitConnected);

populateExp_Edu(experience, "experience");
// populateTrekking(trekking);
populateExp_Edu(education, "education");

populateLinks(footer, "footer");
