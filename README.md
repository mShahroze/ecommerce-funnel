# Scout Technical Exercise: Ecommerce Funnel

## Intro

Built with `create-next-app`, this is a NextJS ecommerce-related app that uses MongoDB for the database and is containerized to run using Docker compose.

## Quick start

Introduction video: https://drive.google.com/file/d/1_ZWpnqWCzAGg8Ojg2jULDtfu2iaoYaRg/view?usp=drive_link

1. Clone the repo: `git clone {REPO_URL}`

2. CD into the repo: `cd /path/to/repo`

3. Install dependencies: `npm install`

4. Start via docker compose: `docker-compose up` ([walkthrough video](https://www.loom.com/share/00aa3e69c53044e8a06bf09e8f2b2bba?sid=afd4030b-bbb4-4f50-8dad-9d1852408da9))

5. Once running, visit `http://localhost:3000/` to load the app--the first load might be slow. You should see the following page if everything is successful:
   <img width="1483" alt="Home page" src="https://teamupsgeneral.blob.core.windows.net/teamupspublic/assessments/ecommerce-funnel/funnel-home.png">

## Sample git workflow

Sample flow for making changes and submitting a PR after getting the app up and running.

```
// check out a new branch for your changes
git checkout -b {BRANCH_NAME}

// make changes and commit them
git add --all
git commit

// push new branch up to GitHub
git push origin {BRANCH_NAME}

// use GitHub to make PR
```
