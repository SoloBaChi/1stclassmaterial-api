

function calculateGpResults(records, gradepointSystem){
if(![4,5].includes(gradepointSystem)) throw new Error("Invalid Grade Point Scale Entered");

let score = 0, unitLoad = 0;

for(let [grade,units] of records){
    let gradepoint;
    switch(grade){
        case "A" : gradepoint = gradepointSystem === 5 ? 5 : 4; break;
        case "B" : gradepoint = gradepointSystem === 5 ? 4 : 3; break;
        case "C" : gradepoint = gradepointSystem === 5 ? 3 : 2; break;
        case "D" : gradepoint = gradepointSystem === 5 ? 2 : 1; break;
        case "E" : gradepoint = gradepointSystem === 5 ? 1 : 0; break;
        case "F" : gradepoint = 0; break;
        default:
        throw new Error("Please enter a valid grade");
    }

    score += gradepoint * units;
    unitLoad += Number(units)
}

let CGPA = score / unitLoad;
if(!isNaN(CGPA)){
 if(CGPA > 4.5){
  return `Congratulations...! Your CGPA is ${CGPA.toFixed(2)}`
 }
 return `Kudos..! Your CGPA is ${CGPA.toFixed(2)}`
}
else{
throw new Error("Please Enter a valid Unit Load")
}
}

module.exports = calculateGpResults;