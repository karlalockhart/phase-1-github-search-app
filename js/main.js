/*
const body = document.body;
const ThemeSwitchTxt = document.getElementById('theme-switch-text');
const SearchError = document.getElementById('search-error');
const EmptyField = document.getElementById('empty-field')
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');

// Submit form
function submitForm(e) {
  e.preventDefault();

  SearchError.classList.add('hidden');
  EmptyField.classList.add('hidden');

  const githubUsernameEl = document.getElementById('github-username');
  githubUsernameEl.value = githubUsernameEl.value?.trim();
  const githubUsername = githubUsernameEl.value ?? '';

  if (!githubUsername.length) {
    EmptyField.classList.remove('hidden');
  } else {
    const githubUsernameJoined = githubUsername.split(' ').join('')
    fetchUser(githubUsernameJoined);
  }

}

// Fetch user by username with github API
async function fetchUser(username) {
  SearchError.classList.add('hidden');

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const parsedResponse = await response.json();

    if (!response.ok) {
      return SearchError.classList.remove('hidden');
    }

    return updateDOM(parsedResponse);
  } catch (err) {
    return console.log(err);
  }
}

// Updates DOM with new user data
function updateDOM(user) {
  const joinedAt = user.created_at.split('T')[0];
  const parsedJoinedAt = joinedAt.split('-');

  const year = parsedJoinedAt[0];
  const month = parsedJoinedAt[1];
  const day = parsedJoinedAt[2];

  // Converts month to shortened text version
  const date = new Date(year, month, day);
  date.setMonth(month - 1);

  const monthTxt = date.toLocaleString('en', { month: 'short' });

  const userImg = document.getElementById('user-img');
  const userImgMobile = document.getElementById('user-img-mobile');

  const userName = document.getElementById('user-name');
  const userTimeJoined = document.getElementById('user-joined-time');
  const userUsername = document.getElementById('user-username');

  const userBio = document.getElementById('user-bio');

  const userRepos = document.getElementById('user-repos');
  const userFollowers = document.getElementById('user-followers');
  const userFollowing = document.getElementById('user-following');

  const userLocation = document.getElementById('user-location');
  const userTwitter = document.getElementById('user-twitter');
  const userWebsite = document.getElementById('user-website');
  const userOrganization = document.getElementById('user-organization');

  userImg.src = user.avatar_url;
  userImgMobile.src = user.avatar_url;

  userTimeJoined.dateTime = joinedAt;
  userTimeJoined.innerText = `Joined ${day} ${monthTxt} ${year}`;

  // If user has not set name use username
  if (!user.name || user.name.length < 1) {
    userName.innerText = user.login;
  } else {
    userName.innerText = user.name;
  }
  userUsername.innerText = `@${user.login}`;

  // If user has not set bio display no bio text and lower opacity
  if (!user.bio || user.bio.length < 1) {
    userBio.classList.add('opacity-75');
    userBio.innerText = 'This profile has no bio';
  } else {
    userBio.classList.remove('opacity-75');
    userBio.innerText = user.bio;
  }

  userRepos.innerText = user.public_repos;
  userFollowers.innerText = user.followers;
  userFollowing.innerText = user.following;

  if (!user.location || user.location.length < 1) {
    userLocation.classList.add('opacity-50');
    userLocation.querySelector('.user-link').innerText = 'Not Available';
  } else {
    userLocation.classList.remove('opacity-50');
    userLocation.querySelector('.user-link').innerText = user.location;
  }

  if (!user.twitter_username || user.twitter_username.length < 1) {
    userTwitter.classList.add('opacity-50');
    userTwitter.querySelector('.user-link').innerText = 'Not Available';
    userTwitter.querySelector('.user-link').removeAttribute('href');
  } else {
    userTwitter.classList.remove('opacity-50');
    userTwitter.querySelector('.user-link').innerText = `@${user.twitter_username}`;
    userTwitter.querySelector('.user-link').href = `https://twitter.com/${user.twitter_username}`;
  }

  if (!user.blog || user.blog.length < 1) {
    userWebsite.classList.add('opacity-50');
    userWebsite.querySelector('.user-link').innerText = 'Not Available';
    userWebsite.querySelector('.user-link').removeAttribute('href');
  } else {
    const userWebsiteShort = user.blog.split('/')[2];

    userWebsite.classList.remove('opacity-50');
    userWebsite.querySelector('.user-link').innerText = userWebsiteShort;
    userWebsite.querySelector('.user-link').href = user.blog;
  }

  if (!user.company || user.company.length < 1) {
    userOrganization.classList.add('opacity-50');
    userOrganization.querySelector('.user-link').innerText = 'Not Available';
    userOrganization.querySelector('.user-link').removeAttribute('href');
  } else {
    const userOrganizationWithoutAt = user.company.split('@')[1];

    userOrganization.classList.remove('opacity-50');
    userOrganization.querySelector('.user-link').innerText = user.company;
    userOrganization.querySelector('.user-link').href = `https://github.com/${userOrganizationWithoutAt}`;
  }
}

// Toggles body class and switches over icons
function updateThemeClasses(themeToSwitchTo) {
  sunIcon.classList.add('hidden');
  moonIcon.classList.add('hidden');

  if (themeToSwitchTo === 'dark') {
    sunIcon.classList.remove('hidden');
    return body.classList.add('dark-theme');
  }

  moonIcon.classList.remove('hidden');
  body.classList.remove('dark-theme');
}

// Switch light themes via button
function switchTheme() {
  // If it contains dark-theme class, we're switching to light theme
  if (body.classList.contains('dark-theme')) {
    ThemeSwitchTxt.innerText = 'Dark';

    localStorage.setItem('theme', 'light');

    return updateThemeClasses('light');
  } else {
    ThemeSwitchTxt.innerText = 'Light';

    localStorage.setItem('theme', 'dark');

    return updateThemeClasses('dark');
  }
}

function initTheme() {
  // If user has dark preference, set the dark theme by default.

  // LocalStorage overrides this however, as the user has then changed the theme,
  // which we want to persist to those settings then.
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme === 'dark') {
    ThemeSwitchTxt.innerText = 'Light';

    return updateThemeClasses('dark');
  }

  if (storedTheme === 'light') {
    ThemeSwitchTxt.innerText = 'Dark';

    return updateThemeClasses('light');
  }

  if (prefersDarkScheme.matches) {
    ThemeSwitchTxt.innerText = 'Dark';

    return updateThemeClasses('dark');
  }
}

// Default user to be displayed
fetchUser('NinjaInShade');

// Default theme to be activated
initTheme();

/*
//Variables
const searchbar = document.querySelector(".searchbar-container");
const profilecontainer = document.querySelector(".profile-container");
const root = document.documentElement.style;
const get = (param) => document.getElementById(`${param}`);
const url = "https://api.github.com/users/";
const noresults = get("no-results");
const btnmode = get("btn-mode");
const modetext = get("mode-text");
const modeicon = get("mode-icon");
const btnsubmit = get("submit");
const input = get("input");
const avatar = get("avatar");
const userName = get("name");
const user = get("user");
const date = get("date");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const bio = get("bio");
const repos = get("repos");
const followers = get("followers");
const following = get("following");
const user_location = get("location");
const page = get("page");
const twitter = get("twitter");
const company = get("company");
let darkMode = false;
//btns
btnsubmit.addEventListener("click", function () {
  if (input.value !== "") {
    getUserData(url + input.value);
  }
});
input.addEventListener(
  "keydown",
  function (e) {
    if (!e) {
      var e = window.event;
    }
    if (e.key == "Enter") {
      if (input.value !== "") {
        getUserData(url + input.value);
      }
    }
  },
  false
);
input.addEventListener("input", function () {
  noresults.style.display = "none";
  profilecontainer.classList.remove("active");
  searchbar.classList.add("active");
});
btnmode.addEventListener("click", function () {
  if (darkMode == false) {
    darkModeProperties();
  } else {
    lightModeProperties();
  }
});
//functions
function getUserData(gitUrl) {
  fetch(gitUrl)
    .then((response) => response.json())
    .then((data) => {
      updateProfile(data);
    })
    .catch((error) => {
      throw error;
    });
}
function updateProfile(data) {
  if (data.message !== "Not Found") {
    noresults.style.display = "none";
    function checkNull(param1, param2) {
      if (param1 === "" || param1 === null) {
        param2.style.opacity = 0.5;
        param2.previousElementSibling.style.opacity = 0.5;
        return "Not available";
      } else {
        return `${param1}`;
      }
    }
    avatar.src = `${data.avatar_url}`;
    userName.innerText = `${data.name}`;
    user.innerText = `@${data.login}`;
    datesegments = data.created_at.split("T").shift().split("-");
    date.innerText = `Joined ${datesegments[2]} ${
      months[datesegments[1] - 1]
    } ${datesegments[0]}`;
    bio.innerText =
      data.bio == null ? "This profile has no bio" : `${data.bio}`;
    repos.innerText = `${data.public_repos}`;
    followers.innerText = `${data.followers}`;
    following.innerText = `${data.following}`;
    user_location.innerText = checkNull(data.location, user_location);
    page.innerText = checkNull(data.blog, page);
    twitter.innerText = checkNull(data.twitter_username, twitter);
    company.innerText = checkNull(data.company, company);
    searchbar.classList.toggle("active");
    profilecontainer.classList.toggle("active");
  } else {
    noresults.style.display = "block";
  }
}
//dark mode default
const prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const localStorageDarkMode = localStorage.getItem("daresfesf");
if(localStorageDarkMode === null) {
  localStorage.setItem("dark-mode", prefersDarkMode);
  darkMode = prefersDarkMode;
}
if (localStorageDarkMode) {
  darkMode = localStorageDarkMode;
  darkModeProperties();
} else {
  localStorage.setItem("dark-mode", prefersDarkMode);
  darkMode = prefersDarkMode;
  lightModeProperties();
}


function darkModeProperties() {
  root.setProperty("--lm-bg", "#141D2F");
  root.setProperty("--lm-bg-content", "#1E2A47");
  root.setProperty("--lm-text", "white");
  root.setProperty("--lm-text-alt", "white");
  root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
  modetext.innerText = "LIGHT";
  modeicon.src = "./assets/icon-sun.svg";
  root.setProperty("--lm-icon-bg", "brightness(1000%)");
  darkMode = true;
  localStorage.setItem("dark-mode", true);
}
function lightModeProperties() {
  root.setProperty("--lm-bg", "#F6F8FF");
  root.setProperty("--lm-bg-content", "#FEFEFE");
  root.setProperty("--lm-text", "#4B6A9B");
  root.setProperty("--lm-text-alt", "#2B3442");
  root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
  modetext.innerText = "DARK";
  modeicon.src = "./assets/icon-moon.svg";
  root.setProperty("--lm-icon-bg", "brightness(100%)");
  darkMode = false;
  localStorage.setItem("dark-mode", false);
}
profilecontainer.classList.toggle("active");
searchbar.classList.toggle("active");
getUserData(url + "octocat");
*/