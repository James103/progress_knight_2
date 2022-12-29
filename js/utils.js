// Universal decimal constants
var decimalZero = Decimal.dZero;
var decimalOne = Decimal.dOne;

function softcap(value, cap, power = 0.5) {
    if (Decimal.lte(value, cap)) return value
    
    return Decimal.pow(value, power).times(Decimal.pow(cap, decimalOne.sub(power)))
}

function getBaseLog(x, y) {
    return y.log(x);
}

function yearsToDays(years) {
    return Decimal.times(years, 365)
}

function daysToYears(days) {
    return Decimal.floor(Decimal.div(days, 365))
}

function getCurrentDay(days) {
    return Decimal.floor(days.sub(daysToYears(days).times(365)))
}

function getElementsByClass(className) {
    return document.getElementsByClassName(removeSpaces(className))
}

function removeSpaces(string) {
    return string.replace(/ /g, "")
}

function removeStrangeCharacters(string) {
    return string.replace(/'/g, "")
}

function getGeneralProgressRepresentation(x) {
    // F notation
    if (x.gte("eeee10")) {
        let slog = x.slog();
        if (slog.gte(10000)) {
            return getGeneralProgressRepresentation(slog);
        }
        return Decimal.pow(10, slog.sub(slog.floor())).div(10);
    }

    // 1e10000 and up
    if (x.gte("1e10000")) {
        return getGeneralProgressRepresentation(x.log10());
    }

    // Below 1e10000
    let bestValue = Decimal.pow(10, x.log10().ceil());
    return x.div(bestValue).max(0).min(1);
}

function getTaskProgress(task) {
    if (gameData.dark_matter_shop.continuum_unlock)
        return task.level.lt(100000) ? task.continuumLevel.sub(task.level.floor()).max(0).min(1).toNumber() : getGeneralProgressRepresentation(task.level).toNumber()
    else
        return task.xp.div(task.getMaxXp()).max(0).min(1).toNumber()
}

function getChallengeTaskGoalProgress(taskName) {
    if (!Object.keys(gameData.taskData).includes(taskName))
        return 0
    if (gameData.taskData[taskName].isHero)
        return gameData.taskData[taskName].getLevel().times(1000)
    else
        return gameData.taskData[taskName].getLevel()
}

function getFormattedChallengeTaskGoal(taskName, level) {
    if (level.lt(100000))
        return taskName + " lvl " + formatLevel(level)
    else
        return "Great " + taskName + " lvl " + formatLevel(gameData.dark_matter_shop.continuum_unlock ? level.div(1000) : Decimal.ceil(level.div(1000)))
}

function getFormattedTitle(parameter) {    
    let title = parameter.replaceAll("_", " ")
    title = title.charAt(0).toUpperCase() + title.slice(1)

    return title
}

// Dilation function from https://github.com/pg132/The-Modding-Tree/blob/dad320034747d6bea25b00c6e83d7dac3daf75c7/js/layers.js
function dilate(x, exponent, base = 10){
    if (x.lt(base)) return x
    return Decimal.pow(base, x.log(base).pow(exponent))
}

// Slog functions from https://github.com/c0v1d-9119361/The-Plague-Tree/blob/b265ac41d17321bc71d5673fb60eaad20a5ae31c/js/math.js
function slog(n){
    n = new Decimal(n)
    return Decimal.add(n.layer,new Decimal(n.mag).slog())
}

function slogadd(n,add){
    n = new Decimal(n)
    return Decimal.tetrate(10,slog(n).add(add))
}

function tet10(n){
    n = new Decimal(n)
    return Decimal.tetrate(10,n)
}
