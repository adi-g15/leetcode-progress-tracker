// Visit https://www.rapidtables.com/tools/line-graph.html

const data = require("./records.json")
const names = ["70deepak58", "adityag15", "chaurasiya_g", "gauravrobin2000415"]

names.forEach(name => {
	console.log(name);
	console.log(data.map(d => d.profiles.find(r => r.username == name).submitCounts.All).join(' '))
})

