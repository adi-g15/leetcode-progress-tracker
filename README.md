# Leetcode Progress Watcher

Simple js script to fetch progress from leetcode profile.

Iska use bas data dene me nhi hai, future me is data to analyze krke ek live progress graph banana hai, isliye isko Progress Watcher bola hai, abhi ke liye bas record save krte rhega har roj.

### Usage

To get current progress (number of questions solved, etc.):

```sh
npm run start
```

* The relevant code is in `leetcode-watcher.js`
* The records are written to `records.json`
* `script.sh` is provided to setup crontab on linux locally. Plus I will add some functions to it to help the github action too
* A Github action will also maintain the `records.json` for names written on this repo's `watchlist.json`

### Future

Basically, I am collecting this data to analyse later… time is short currently :')

* Add github workflow for cronjob (refer https://github.com/adi-g15/archlinux-repository/tree/master/.github/workflows)
* Add a web interface (refer https://github.com/adi-g15/ipl_pred)
* Add graphing capability (can use plot.ly)

### Story

Simple web scraping kaam nhi kiya... Phir Networks tab me requests dekha, graphql tha... usme request me cookie aur kya kya tha to sochha chhod deta hu ab... lekin bemtlb ka cheez hta ke Edit and Resend kaam kiya... to phir bas, kardiya implement :)

Bonus: Got another good link from https://leetcode.com/discuss/feedback/187751/is-there-an-api-call-to-get-number-of-problems-solved

https://leetcode.com/api/problems/algorithms/ Current user ke liye bhar bhar ke data return karta hai :)

Unlicense :)

