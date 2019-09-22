
year = 2019
month = 09

let date = new Date(year, month, 0).getDate();


let days = []

for(let i = 0; i < date; i++){
    days.push(i + 1)
}

console.log(days)