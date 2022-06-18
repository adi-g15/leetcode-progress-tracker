import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import fs from 'fs';

// NOTE: The `node-fetch` module won't be required in node >= v18

const classes = "mr-[5px] text-base font-medium leading-[20px] text-label-1 dark:text-dark-label-1";

const usernames = ["adityag15", "chaurasiya_g"];

usernames.forEach(uname => {
    // get current date
    let date = (new Date()).toDateString().split(" ").slice(1, 4).join(" ");
    
    const url = `https://leetcode.com/${uname}`;

    // fetch url
    fetch(url)
	.then(res => res.text())
	.then(body => {
	    // create dom
	    const dom = new JSDOM(body);
	    // get dom
	    const document = dom.window.document;
	    // get all elements with class mr-5px text-base font-medium leading-20px text-label-1 dark:text-dark-label-1
	    const elements = document.getElementsByClassName(classes);

	    // write dom.serialize() to file
	    const file = `${uname}-${date}.html`;
	    fs.writeFile(file, dom.serialize(), (err) => {
		if (err) throw err;
		console.log(`${file} saved!`);
	    });

	    console.log(elements);
	    console.log(`${uname}'s Leetcode stats:`);
	    console.log(`${date}`);
	    /*
	    console.log(`${elements[0].innerHTML}`);
	    console.log(`${elements[1].innerHTML}`);
	    console.log(`${elements[2].innerHTML}`);
	    */
	})
});
