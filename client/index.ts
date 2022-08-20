const getRecords = import("../records.json")

type LCProfile = {
    username: string,
    submitCounts: {
        All: number | null,
        Easy: number | null,
        Medium: number | null,
        Hard: number | null,
    },
    beatsPercentage: {
        Easy: number | null,
        Medium: number | null,
        Hard: number | null,
    }
};

type LCRecord = {
    date: string,
    profiles: LCProfile[]
};

function initProfilesTable(records: LCRecord[]) {
    const last_record = records[records.length - 1];
    const submit_counts = last_record.profiles.map(profile => {
        return ({
            username: profile.username,
            count: profile.submitCounts["All"]
        });
    });

    // sorted in descending order
    submit_counts.sort((a, b) => b.count - a.count);

    document.getElementById("chances_table").innerHTML = "";
    const table = document.createElement("table");
    table.id = "score_table_rust";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const username = document.createElement("th");   // team name
    const counts = document.createElement("th");   // team chances
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
        const t_chances = document.createElement("td");

        t_name.innerText = score.username;
        t_chances.innerText = score.count.toString();

        tr.appendChild(t_name);
        tr.appendChild(t_chances);

        tbody.appendChild(tr);
    }

    const caption = document.createElement("caption");
    const notice = document.createElement("strong");
    notice.id = "score_table_notice";
    notice.innerText = `Current Situation (ie. 56 league matches tak)`;
    const p = document.createElement("p");
    p.innerText = "Chances of teams qualifying for PlayOffs";

    caption.appendChild(notice);
    caption.appendChild(p);
    table.appendChild(caption);

    document.getElementById("chances_table").appendChild(table);
}

/*
function handleClick(data, extra_matches_to_compute) {
    console.log("Data: ", data);

    let call_time = Date.now();
    const possibilities = wasm.get_chances(JSON.stringify(data), extra_matches_to_compute);
    console.info(`[Rust] Elapsed time: ${(Date.now() - call_time) / 1000}s`);

    // call_time = Date.now();
    // const _possibilities = js_code.get_chances(JSON.stringify(data), extra_matches_to_compute);
    // console.info(`[JS] Elapsed time: ${(Date.now() - call_time)/1000}s`);

    console.log("Received from rust: ", possibilities);

    const scores = JSON.parse(possibilities);    // returns Javascript object

    const scores_arr = [];

    for (const key in scores) {
        if (Object.hasOwnProperty.call(scores, key)) {
            if (key == "min_qual") continue;
            const percentage = scores[key];

            scores_arr.push({ team: key, percentage });
        }
    }

    // sorted in descending order
    scores_arr.sort((a, b) => b.percentage - a.percentage);

    try {
        document.getElementById("score_table_rust").id; // this must cause a failure, if not available

        for (const score of scores_arr) {
            const tr = document.getElementById(`${score.team}_tr`);
            const t_chances = tr.children[1];

            t_chances.innerText = score.percentage;
        }

        document.getElementById("score_table_notice").innerText = `TILL ${extra_matches_to_compute + get_num_finished_matches(data)} Matches`;
    } catch (err) {
        console.error(err);
        initProfilesTable();
    }
}

function plotData() {
    let data_arr = [];
    for (let key in records) {
        try {
            parseInt(key);
            data_arr[key] = records[key];
        } catch { }
    }

    console.log("Plotting Data; Total rows in graph_data (data keys only): ", data_arr);

    let x_arr = data_arr.map((_, i) => i);
    let csk_arr = data_arr.map((entry) => entry['CSK']);
    let rr_arr = data_arr.map((entry) => entry['RR']);
    let mi_arr = data_arr.map((entry) => entry['MI']);
    let dd_arr = data_arr.map((entry) => entry['DC']);
    let pbks_arr = data_arr.map((entry) => entry['PBKS']);
    let rcb_arr = data_arr.map((entry) => entry['RCB']);
    let srh_arr = data_arr.map((entry) => entry['SRH']);
    let kkr_arr = data_arr.map((entry) => entry['KKR']);

    Plotly.newPlot(
        'trends_graph',
        [{
            x: x_arr,
            y: csk_arr,
            name: "CSK",
            line: {
                color: 'rgb(255, 255, 60)',
                width: 2
            }
        }, {
            x: x_arr,
            y: rr_arr,
            name: "RR",
            line: {
                color: 'rgb(37, 74, 165)',
                width: 2
            }
        }, {
            x: x_arr,
            y: mi_arr,
            name: "MI",
            line: {
                color: 'rgb(0, 75, 150)',
                width: 2
            }
        }, {
            x: x_arr,
            y: dd_arr,
            name: "DC",
            line: {
                color: 'rgb(239, 27, 35)',
                width: 2
            }
        }, {
            x: x_arr,
            y: pbks_arr,
            name: "PBKS",
            line: {
                color: 'rgb(237, 27, 36)',
                width: 2
            }
        }, {
            x: x_arr,
            y: rcb_arr,
            name: "RCB",
            line: {
                color: 'rgb(43, 42, 41)',
                width: 2
            }
        }, {
            x: x_arr,
            y: srh_arr,
            name: "SRH",
            line: {
                color: 'rgb(255, 130, 42)',
                width: 2
            }
        }, {
            x: x_arr,
            y: kkr_arr,
            name: "KKR",
            line: {
                color: 'rgb(46, 8, 84)',
                width: 2
            }
        }],
        {
            title: "Trend of Qualification Chances of teams for Playoffs",
            // margin: { t: 40 },
            // height: '80%',
            // width: '100%',
            xaxis: {
                title: "Number of finished matches",
                // showgrid: false,
                // zeroline: false
            },
            yaxis: {
                title: 'Qualification chances',
                //   showline: false,
                zeroline: true
            }
        }
    );
}
*/

function preprocessRecords(records: LCRecord[]) {
    console.log({records});
    return records.map(record => {
        let date = new Date(Date.parse(record["date"]));
        let date_string = date.toDateString();
    
        return {
            ...record,
            date: date_string
        };
    });
}

getRecords
    .then((r_: LCRecord[]) => {
        const records = preprocessRecords(r_);

        initProfilesTable(records);
    })
    .catch(err => {
        console.error("Failed to get records: ", err);
    })

//document.records = preprocessRecords(records);

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

