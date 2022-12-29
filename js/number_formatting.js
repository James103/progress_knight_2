function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor();
    let m = num.div(Decimal.pow(10, e));
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne;
        e = e.add(1);
    }
    e = (e.gte(1e6) ? format(e, 2) : (e.gte(1000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)));
    if (mantissa) {
        return m.toStringWithDecimalPlaces(precision) + "e" + e;
    } else {
        return "e" + e;
    }
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) {
        return "NaN";
    }
    if (num.mag < 0.001) {
        return (0).toFixed(precision);
    }
    let init = num.toStringWithDecimalPlaces(precision);
    let portions = init.split(".");
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    if (portions.length == 1) {
        return portions[0];
    } else {
        return portions[0] + "." + portions[1];
    }
}

function format(decimal, precision = 2) {
    const units = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "O", "N", "D",
    "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Od", "Nd", "V",
    "Uv", "Dv", "Tv", "Qav", "Qiv", "Sxv", "Spv", "Ov", "Nv", "Tr", "Ut", "Dt", "Tt"]
    
    decimal = new Decimal(decimal);
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        throw new Error("NaN encountered");
    }
    if (decimal.sign < 0) {
        return "-" + format(decimal.neg(), precision);
    }
    if (decimal.mag == Number.POSITIVE_INFINITY) {
        return "∞";
    }
    if (decimal.gte("eeee10")) {
        var slogFull = slog(decimal);
        if (slogFull.gte(1e4)) {
            return "F" + formatTreshold(slogFull.floor(), precision, 1e6);
        } else {
            let slogPart = Decimal.pow(10, slogFull.sub(slogFull.floor())).toStringWithDecimalPlaces(Math.max(precision, 3));
            return slogPart + "F" + commaFormat(slogFull.floor(), 0);
        }
    } else if (decimal.gte("1e10000")) {
        return exponentialFormat(decimal, 0, false);
    } else if (decimal.gte(1e308)) {
        return exponentialFormat(decimal, precision);
    } else {
        return standardFormat(decimal, precision);
    }
}

function standardFormat(decimal, precision) {
    if (decimal.gte(1e308))
        return format(decimal, precision)
    
    let number = decimal.toNumber();
    
    const units = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "O", "N", "D",
    "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Od", "Nd", "V",
    "Uv", "Dv", "Tv", "Qav", "Qiv", "Sxv", "Spv", "Ov", "Nv", "Tr", "Ut", "Dt", "Tt"]
    
    // what tier? (determines SI symbol)
    const tier = Math.log10(number) / 3 | 0;
    if (tier <= 0) return math.floor(number, precision).toFixed(precision);
    
    if ((gameData.settings.numberNotation == 0 || tier < 3) && (tier < units.length)) {
        const suffix = units[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = number / scale;
        return math.floor(scaled, precision).toFixed(precision) + suffix;
    } else {
        if (gameData.settings.numberNotation == 1) {
            const exp = Math.log10(number) | 0;
            const scale = Math.pow(10, exp);
            const scaled = number / scale;
            return math.floor(scaled, precision).toFixed(precision) + "e" + exp;
        } else {
            const exp = Math.log10(number) / 3 | 0;
            const scale = Math.pow(10, exp * 3);
            const scaled = number / scale;
            return math.floor(scaled, precision).toFixed(precision) + "e" + exp * 3;
        }
    }
}

function formatWhole(decimal, precision = 2) {
    decimal = new Decimal(decimal);
    if (decimal.gte(1e3)) {
        return format(decimal, precision);
    }
    if (decimal.lte(0.99) && !decimal.eq(0)) {
        return format(decimal, precision);
    }
    return commaFormat(decimal, 0);
}

function formatTreshold(number, decimals = 2, treshold = 100000) {
    if (number.lt(treshold))
        return Number(Decimal.floor(number)).toLocaleString()
    else
        return format(number, decimals)
}

function formatLevel(level) {
    if (Decimal.gte(level, 100000))
        return format(level)
    
    if (gameData.dark_matter_shop.continuum_unlock)
        return Number(level).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    else
        return Number(level).toLocaleString()
}

function getCoinsData() {
    switch (gameData.settings.currencyNotation) {
        case 0: return [
            { "name": "p", "color": "#79b9c7", "value": 1e6 },
            { "name": "g", "color": "#E5C100", "value": 10000 },
            { "name": "s", "color": "#a8a8a8", "value": 100 },
            { "name": "c", "color": "#a15c2f", "value": 1 },
        ];
        case 1: return [
            { "name": "𒀱", "color": "#ffffff", "value": 1e62, "class": "currency-shadow-rainbow" },
            { "name": "𒀱", "color": "#ffffff", "value": 1e47, "class": "currency-shadow" },
            { "name": "𒇫", "color": "#66ccff", "value": 1e41, "class": "currency-shadow" },
            { "name": "🜊", "color": "#00ff00", "value": 1e35, "class": "currency-bold" },
            { "name": "✹", "color": "#ffffcc", "value": 1e30 },
            { "name": "∰", "color": "#ff0083", "value": 1e26 },
            { "name": "Φ", "color": "#27b897", "value": 1e23 },
            { "name": "Ξ", "color": "#cd72ff", "value": 1e20 },
            { "name": "Δ", "color": "#f5c211", "value": 1e17 },
            { "name": "d", "color": "#ffffff", "value": 1e14 },
            { "name": "r", "color": "#ed333b", "value": 1e12 },
            { "name": "S", "color": "#6666ff", "value": 1e10 },
            { "name": "e", "color": "#2ec27e", "value": 1e8 },
            { "name": "p", "color": "#79b9c7", "value": 1e6 },
            { "name": "g", "color": "#E5C100", "value": 10000 },
            { "name": "s", "color": "#a8a8a8", "value": 100 },
            { "name": "c", "color": "#a15c2f", "value": 1 },
        ];
        case 2: return [
            { "name": "", "color": "#E5C100", "value": 240, "prefix": "£" },
            { "name": "s", "color": "#a8a8a8", "value": 12 },
            { "name": "d", "color": "#a15c2f", "value": 1 },
        ];
        default: throw new Error("Invalid currency notation set");
    }
}

function formatCoins(coins, element) {
    for (const c of element.children) {
        c.textContent = "";
    }
    
    switch (gameData.settings.currencyNotation) {
        case 0:
        case 1:
        case 2:
            const money2 = getCoinsData()
            
            let coinsUsed = 0
            for (let i = 0; i < money2.length; i++) {
                const m = money2[i];
                const prev = money2[i - 1];
                const diff = prev ? Decimal.div(prev.value, m.value) : Decimal.dInf;
                const amount2 = Decimal.floor(Decimal.div(coins, m.value));
                const amount = !diff.isFinite() ? amount2 : amount2.sub(amount2.div(diff).floor().times(diff)) // amount mod diff
                if ((amount.gt(0) || (decimalOne.gt(coins) && decimalOne.eq(m.value)))) {
                    element.children[coinsUsed].textContent = (m.prefix ?? "") + format(amount, amount < 1000 ? 0 : 2) + m.name
                    element.children[coinsUsed].style.color = m.color
                    element.children[coinsUsed].className = m.class ? m.class : ""
                    coinsUsed++
                }
                if (coinsUsed >= 2 || amount >= 100) break;
            }
            break;
        case 3:
            element.children[0].textContent = "$" + format(Decimal.div(coins, 100), 2)
            element.children[0].style.color = "#E5C100"
            element.children[0].className = ""
            break;
        default:
            throw new Error("Invalid currency notation set");
    }
}

function formatTime(sec_num, show_ms = false) {
    if (sec_num == null) {
        return "unknown"
    }
    if (sec_num instanceof Decimal) {
        if (sec_num.lt(0)) {
            return "-" + formatTime(sec_num.neg(), show_ms);
        }
        if (sec_num.gte(31536000e3)) { // 1,000 years
            return format(sec_num.div(31536000)) + " years";
        } else {
            return formatTime(sec_num.toNumber(), show_ms);
        }
    } else {
        if (sec_num < 0) {
            return "-" + formatTime(-sec_num, show_ms);
        }
        if (sec_num > 31536000e3) { // 1,000 years
            return formatTime(new Decimal(sec_num), show_ms);
        }
    }
    
    if (sec_num >= 31536000) {
        let years = Math.floor(sec_num / 31536000)
        return years + 'y ' + formatTime(sec_num % 31536000, show_ms)
    }
    if (sec_num >= 86400) {
        let days = Math.floor(sec_num / 86400)
        return days + 'd ' + formatTime(sec_num % 86400, show_ms)
    }
    
    if (show_ms && sec_num !== 0 && sec_num < 0.001)
        return formatTimeLong(sec_num)

    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60))
    let ms = Math.floor((sec_num - Math.floor(sec_num)) * 1000)
    let mss = (show_ms ? "." + ms.toString().padStart(3, "0") : "")

    if (hours < 10) hours = "0" + hours
    if (minutes < 10) minutes = "0" + minutes
    if (seconds < 10) seconds = "0" + seconds
    return (sec_num >= 3600 ? hours + ':' : '') + minutes + ':' + seconds + mss   
}

function formatTimeLong(s) {
    s = new Decimal(s)
    if (s.lt(0)) return "-" + formatTimeLong(s.neg())
    let years = s.div(31536000)
    if (years.gte(1)) return format(years) + " years"
    if (s.gte(86400)) return format(s.div(86400)) + " days"
    if (s.gte(3600)) return format(s.div(3600)) + " hours"
    if (s.gte(60)) return format(s.div(60)) + " minutes"
    if (s.gte(1)) return format(s) + " seconds"
    if (s.gte(0.001)) return format(s.mul(1e3)) + " milliseconds"
    if (s.gte(1e-6)) return format(s.mul(1e6)) + " microseconds"
    if (s.gte(1e-9)) return format(s.mul(1e9)) + " nanoseconds"
    if (s.gte(1e-12)) return format(s.mul(1e12)) + " picoseconds"
    if (s.gte(1e-15)) return format(s.mul(1e15)) + " femtoseconds"
    if (s.gte(1e-18)) return format(s.mul(1e18)) + " attoseconds"
    if (s.gte(1e-21)) return format(s.mul(1e21)) + " zeptoseconds"
    if (s.gte(1e-24)) return format(s.mul(1e24)) + " yoctoseconds"
    if (s.gte(1e-27)) return format(s.mul(1e27)) + " rontoseconds"
    if (s.gte(1e-30)) return format(s.mul(1e30)) + " quectoseconds"
    return format(s.mul(1.855e43)) + " Planck Times"
}

function formatAge(days) {
    const years = daysToYears(days)
    const day = getCurrentDay(days)
    if (years.gt(10000))    
        return "Age " + format(years)    
    else if (years.gte(1))
        return "Age " + years + " Day " + day
    else
        return "Age: " + formatTimeLong(days.times(86400))
}

function formatLifespan(days) {
    const years = daysToYears(days)
    if (years.gt(10))
        return formatWhole(years) + " years"
    else
        return formatTimeLong(Decimal.times(days, 86400))
}

// Imported from https://github.com/1e1000000/The-Modding-Tree/blob/dcd36ff5b8bc7ba9d2fcf29d3ef463ef528da4f5/js/layers.js#L492
function formatOrdinal(num) {
    num = new Decimal(num)
    if (num.gte(1e5)) return formatWhole(num) + "th"
    let div100 = num.div(100)
    let mod100 = Math.floor(div100.sub(div100.floor()).mul(100).toNumber())
    let ord = ""
    if (Math.floor(mod100 / 10) == 1) ord = "th"
    else {
        switch(mod100%10){
            case 1:
                ord = "st"
                break;
            case 2:
                ord = "nd"
                break;
            case 3:
                ord = "rd"
                break;
            default:
                ord = "th"
        }
    }
    return formatTreshold(num) + ord
}