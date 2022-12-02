# Leetcode Progress Tracker

![Github Socialify](https://socialify.git.ci/adi-g15/leetcode-progress-tracker/image?description=1&descriptionEditable=Fetch%20and%20analyse%20progress%20from%20leetcode%20profile&language=1&name=1&owner=1&theme=Dark)

<div align="center">
  <a href="https://app.netlify.com/sites/leetcode-progress/deploys"><img src="https://api.netlify.com/api/v1/badges/40a29736-e255-4ecb-ac63-58d2938275e0/deploy-status" alt="Netlify Status"></a>
  <a href="https://github.com/adi-g15/leetcode-progress-tracker/actions/workflows/update.yml"><img src="https://github.com/adi-g15/leetcode-progress-tracker/actions/workflows/update.yml/badge.svg" alt="Update records"></a>
</div>

Track your daily progress on leetcode. Automate data collection. See a graph of your own, or of your friends together :D

Deployed at https://leetcode-progress.netlify.app/.

To use yourself:
1. Edit `data/watchlist.json` to add your usernames
2. Remove `data/records.json` to start from fresh

### Usage

To update `data/records.json`, I would suggest simply activate the github action and `git pull` each time, or to update it yourself, run `scripts/leetcode-watcher.js`.

To see the frontend:

```sh
npm run start
```

### Structure

```
├── .github/workflows
│   └── update.yml        // Github Action: Runs leetcode-watcher.js daily
├── global.css
├── index.html        // Main page for frontend
├── index.ts          // Main logic for graphing and other features in frontend
├── package.json
├── tsconfig.json
├── webpack.config.js
├── data
│   ├── records.json      // The JSON file containing daily record
│   └── watchlist.json    // Contains array of usernames to track/watch
├── LICENSE
├── README.md
└── scripts                 // Contains scripts for updating data in data/ folder
    ├── leetcode-watcher.js // Fetches count of problems done from leetcode
    ├── package.json
    └── script.sh           // Helper script for Github Action
```

* The relevant code is in `scripts/leetcode-watcher.js`
* The records are written to `data/records.json`
* `scripts/script.sh` is provided to setup crontab on linux locally. Plus I will add some functions to it to help the github action too
* A Github action will also maintain the `records.json` for names written on this repo's `watchlist.json`

### Screenshot

![](./data/ss.png)

### Future

* [Done] Add github workflow for cronjob (refer https://github.com/adi-g15/archlinux-repository/tree/master/.github/workflows)
* [Done] Add a web interface (refer https://github.com/adi-g15/ipl_pred)
* [Done] Add graphing capability (can use plot.ly)

### Story

Simple web scraping kaam nhi kiya... Phir Networks tab me requests dekha, graphql tha... usme request me cookie aur kya kya tha to sochha chhod deta hu ab... lekin bemtlb ka cheez hta ke Edit and Resend kaam kiya... to phir bas, kardiya implement :)

Bonus: Got another good link from https://leetcode.com/discuss/feedback/187751/is-there-an-api-call-to-get-number-of-problems-solved

`https://leetcode.com/api/problems/algorithms/`: Current user ke liye bhar bhar ke data return karta hai :)

Unlicense :)

