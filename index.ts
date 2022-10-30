const getRecords = import("./data/records.json")
const { randomColor } = require("randomcolor");
declare const Plotly: { [index:string]: Function };

type DifficultyLevel = "Easy" | "Medium" | "Hard" | "All";

/* Not using all stored data, such as allQuestionsCount, profiles[].beatsPercentage */
type LCProfile = {
    username: string,
    submitCounts: {
        All: number | null,
        Easy: number | null,
        Medium: number | null,
        Hard: number | null,
    },
};

type LCRecord = {
    date: string,
    profiles: LCProfile[]
};

function updateProfilesTable(records: LCRecord[]) {
    const last_record = records[records.length - 1];
    const submit_counts = last_record.profiles.map(profile => {
        return ({
            username: profile.username,
            count: profile.submitCounts[difficulty_level]
        });
    });

    // sorted in descending order
    submit_counts.sort((a, b) => (b.count??0) - (a.count??0));

    document.getElementById("counts_table")!.innerHTML = "";
    const table = document.createElement("table");
    table.id = "score_table_rust";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const username = document.createElement("th");   // team name
    const counts = document.createElement("th");   // team counts
    username.innerText = "Username";
    counts.innerText = "Submit Count (All)";
    tr.appendChild(username);
    tr.appendChild(counts);

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (const score of submit_counts) {
        const tr = document.createElement("tr");
        tr.id = `${score.username}_tr`;
        const t_name = document.createElement("td");
        const t_counts = document.createElement("td");

        if (t_name && t_counts) {
            t_name.innerHTML ='<a href="https://leetcode.com/'+ score.username+'" style="text-decoration:none">'+score.username+'</a>';
            t_counts.innerText = score.count!.toString();
        } else {
            throw "Development Bug";
        }

        tr.appendChild(t_name);
        tr.appendChild(t_counts);

        tbody.appendChild(tr);
    }

    const caption = document.createElement("caption");
    const notice = document.createElement("strong");
    notice.id = "score_table_notice";
    notice.innerText = `Current Progress`;
    caption.appendChild(notice);
    table.appendChild(caption);

    document.getElementById("counts_table")!.appendChild(table);
}

function plotData(r_: LCRecord[], count_type: DifficultyLevel, days_count: number) {
    // don't change the graph on such invalid input
    if (days_count <= 0 || isNaN(days_count)) return;

    let records = r_.slice(-days_count);

    let set = new Set();
    for(const record of records) {
        for(const profile of record.profiles) {
            set.add(profile.username);
        }
    }
    const usernames = Array.from(set) as string[];

    // x_arr contains array of dates
    // y_arr contains mapping from username to submitCount on corresponding date
    let x_arr = records.map(record => record.date);
    let y_data: {[index: string]: (number | undefined)[]} = {};
    for(const uname of usernames) {
        y_data[uname] = [];
    }

    // Initialise y_data
    for(let record of records) {
        for (const profile of record.profiles) {
            y_data[profile.username].push(profile.submitCounts[count_type] ?? undefined)
        }
    }

    // Ensure that length of each y_data[username] is same and equals = days_count
    for(let username in y_data) {
        while(y_data[username].length < days_count) {
            y_data[username].unshift(undefined!)
        }
    }

    console.log("Plotting Data:", {x_arr, y_data});
    
    const plotted_data = Object.keys(y_data).map(username => {
        return {
            x: x_arr,
            y: y_data[username],
            name: username,
            line: {
                color: randomColor(),
                width: 2
            }
        };
    });

    Plotly.newPlot(
        'trends_graph',
        plotted_data,
        {
            title: "Leetcode Progress",
            // margin: { t: 40 },
            // height: '80%',
            // width: '100%',
            xaxis: {
                title: '',
                // showgrid: false,
                // zeroline: false
            },
            yaxis: {
                title: `Submit Count (${count_type})`,
                //   showline: false,
                zeroline: true
            }
        }
    );
}

function preprocessRecords(r_: LCRecord[]) {
    /* records is not of type "Array", for some reason when using dynamic import
     * lekin .length property hai, isliye aise loop se access kr rha hu */
    let records = Array.from(r_).map(record => {
        let date = new Date(Date.parse(record["date"]));
        // date_string is of the form: 'Aug 21 2022'
        let date_string = date.toDateString().split(' ').splice(1).join(' ');
    
        return {
            ...record,
            date: date_string
        };
    });

    let deduplicated_records = [];

    for (let i = 0; i < records.length; i++) {
        /* Chose the last record of each day, for example there maybe 2 each day
         * one of morning aur ek shaam ke time ka */
        while (i < (records.length-1) && records[i+1].date == records[i].date) {
            ++i;
        }

        deduplicated_records.push(records[i]);
    }

    return deduplicated_records;
}

/**
 * Will be effective only once
 */
function setMaxDaysCount(days_count: number) {
    let count = document.getElementById("days_count") as HTMLInputElement;

    if (count) {
        count.placeholder = count.placeholder.replace("{{MAX_DAYS}}", days_count.toString());
        count.max = days_count.toString();
    } else {
        console.error("Development Bug: Count field (#days_count) not found");
    }
}

/* onChange handler for days count input field */
function onDaysCountChangeHandler(e: Event) {
    let count = document.getElementById("days_count") as HTMLInputElement;

    days_count = parseInt(count.value);
    updateProfilesTable(dedup_records);
    plotData(dedup_records, difficulty_level, days_count);

    console.log("Current count: ", days_count);
}

/* onChange handler for Difficulty Level select field */
function onDifficultyLevelChangeHandler(e: Event) {
    let level = document.getElementById("difficulty_level") as HTMLSelectElement;

    difficulty_level = level.value as DifficultyLevel;
    updateProfilesTable(dedup_records);
    plotData(dedup_records, difficulty_level, days_count);

    console.log("Current level: ", difficulty_level);
}

var dedup_records: LCRecord[] = [];
var days_count = 0;
var difficulty_level: DifficultyLevel = "All";

getRecords
    .then((r_: LCRecord[]) => {
        dedup_records = preprocessRecords(r_);

        updateProfilesTable(dedup_records);
        setMaxDaysCount(dedup_records.length);
        days_count = dedup_records.length;
        plotData(dedup_records, difficulty_level, days_count);

        document.getElementById("days_count")!.oninput = onDaysCountChangeHandler;
        document.getElementById("difficulty_level")!.onchange = onDifficultyLevelChangeHandler;
   })
    .catch(err => {
        console.error("Failed to get records: ", err);
    })

/*
const matches_form = document.querySelector("#num_matches_form");
matches_form.addEventListener("submit", (event) => {
    event.preventDefault();

    return new Promise((resolve, reject) => {
        let num_match = 30;

        try {
            num_match = parseInt(document.getElementById("extra_num").value)
        } catch { }

        handleClick(window.ipl_json_data, num_match - get_num_finished_matches(window.ipl_json_data));
        resolve();
    }).then(() => {});
})

initChancesTable();
plotData();
*/

