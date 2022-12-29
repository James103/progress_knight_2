onerror = () => {
    document.getElementById("errorInfo").hidden = false
    tempData.hasError = true
    setTimeout(() => {
        document.getElementById("errorInfo").hidden = true
    }, 30 * 1000)
}

function addMultipliers() {
    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getDarkMatterXpGain)
        task.xpMultipliers.push(getBindedTaskEffect("Dark Influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon Training"))
        task.xpMultipliers.push(getBindedTaskEffect("Void Influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Parallel Universe"))
        task.xpMultipliers.push(getBindedTaskEffect("Immortal Ruler"))
        task.xpMultipliers.push(getBindedTaskEffect("Blinded By Darkness"))
        task.xpMultipliers.push(getDarkMatterSkillXP)
        task.xpMultipliers.push(getTimeIsAFlatCircleXP)

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's Wealth"))
            task.incomeMultipliers.push(getLifeCoachIncomeGain)
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
            task.xpMultipliers.push(getBindedTaskEffect("Dark Knowledge"))
            task.xpMultipliers.push(getBindedItemEffect("Personal Squire"))
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study Desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
            task.xpMultipliers.push(getBindedItemEffect("Void Blade"))
            task.xpMultipliers.push(getBindedTaskEffect("Void Symbiosis"))
            task.xpMultipliers.push(getBindedItemEffect("Universe Fragment"))
            task.xpMultipliers.push(getBindedItemEffect("Custom Galaxy"))
            task.xpMultipliers.push(getBindedTaskEffect("Evil Incarnate"))
            task.xpMultipliers.push(getBindedTaskEffect("Dark Prince"))
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle Tactics"))
            task.xpMultipliers.push(getBindedItemEffect("Steel Longsword"))
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle Memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Sapphire Charm"))
            task.xpMultipliers.push(getBindedItemEffect("Observatory"))
            task.xpMultipliers.push(getBindedTaskEffect("Universal Ruler"))
            task.xpMultipliers.push(getTaaAndMagicXpGain)
        } else if (skillCategories["Void Manipulation"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Void Necklace"))
            task.xpMultipliers.push(getBindedItemEffect("Void Orb"))
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mana Control"))
            task.xpMultipliers.push(getTaaAndMagicXpGain)
            task.incomeMultipliers.push(getBindedTaskEffect("All Seeing Eye"))
        } else if (jobCategories["The Void"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Void Amplification"))
            task.xpMultipliers.push(getBindedItemEffect("Void Armor"))
            task.xpMultipliers.push(getBindedItemEffect("Void Dust"))
        } else if (jobCategories["Galactic Council"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Celestial Robe"))
            task.xpMultipliers.push(getBindedTaskEffect("Epiphany"))
        } else if (skillCategories["Dark Magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvilXpGain)
        } else if (skillCategories["Almightiness"].includes(task.name)) {
            task.xpMultipliers.push(getEssenceXpGain)
        } else if (skillCategories["Fundamentals"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Mind's Eye"))
        } else if (skillCategories["Darkness"].includes(task.name)) {
            task.xpMultipliers.push(getDarknessXpGain)
        }
    }

    for (const itemName in gameData.itemData) {
        const item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
        item.expenseMultipliers.push(getBindedTaskEffect("Brainwashing"))
        item.expenseMultipliers.push(getBindedTaskEffect("Abyss Manipulation"))
        item.expenseMultipliers.push(getBindedTaskEffect("Galactic Command"))
    }
}

function getHeroXpGainMultipliers(job)
{
    var baseMult = decimalOne

    if (job instanceof Job)
        baseMult = new Decimal(50000)

    if (gameData.requirements["Rise of Great Heroes"].isCompleted())
        baseMult = baseMult.times(10000)

    if (gameData.requirements["Lazy Heroes"].isCompleted())
        baseMult = baseMult.times(1e12)

    if (gameData.requirements["Dirty Heroes"].isCompleted())
        baseMult = baseMult.times(1e15)

    if (gameData.requirements["Angry Heroes"].isCompleted())
        baseMult = baseMult.times(1e15)

    if (gameData.requirements["Tired Heroes"].isCompleted())
        baseMult = baseMult.times(1e15)

    if (gameData.requirements["Scared Heroes"].isCompleted())
        baseMult = baseMult.times(1e15)

    if (gameData.requirements["Good Heroes"].isCompleted())
        baseMult = baseMult.times(1e15)

    if (gameData.requirements["Funny Heroes"].isCompleted())
        baseMult = baseMult.times(1e25)

    if (gameData.requirements["Beautiful Heroes"].isCompleted())
        baseMult = baseMult.times(1e50)

    if (gameData.requirements["Awesome Heroes"].isCompleted())
        baseMult = baseMult.times(1e10)

    if (gameData.requirements["Furious Heroes"].isCompleted()) {
        if (job instanceof Job)
            baseMult = baseMult.times(1000000)
        baseMult = baseMult.times(1e12)
    }

    if (gameData.requirements["Superb Heroes"].isCompleted())
        baseMult = baseMult.times(1000)

    return baseMult
}


function setCustomEffects() {
    const bargaining = gameData.taskData["Bargaining"]
    bargaining.getEffect = function () {
        return decimalOne.sub(bargaining.getLevel().add(1).log(bargaining.isHero ? 3 : 7).div(10)).max(0.1);
    }

    const intimidation = gameData.taskData["Intimidation"]
    intimidation.getEffect = function () {
        return decimalOne.sub(intimidation.getLevel().add(1).log(intimidation.isHero ? 3 : 7).div(10)).max(0.1);
    }

    const brainwashing = gameData.taskData["Brainwashing"]
    brainwashing.getEffect = function () {
        return decimalOne.sub(brainwashing.getLevel().add(1).log(brainwashing.isHero ? 3 : 7).div(10)).max(0.1);
    }

    const abyssManipulation = gameData.taskData["Abyss Manipulation"]
    abyssManipulation.getEffect = function () {
        return decimalOne.sub(abyssManipulation.getLevel().add(1).log(abyssManipulation.isHero ? 3 : 7).div(10)).max(0.1);
    }

    const galacticCommand = gameData.taskData["Galactic Command"]
    galacticCommand.getEffect = function () {
        return decimalOne.sub(galacticCommand.getLevel().add(1).log(galacticCommand.isHero ? 3 : 7).div(10)).max(0.1);
    }

    const timeWarping = gameData.taskData["Time Warping"]
    timeWarping.getEffect = function() {
        return decimalOne.add(timeWarping.getLevel().add(1).log(timeWarping.isHero ? 1.005 : 10));
    }

    const immortality = gameData.taskData["Life Essence"]
    immortality.getEffect = function () {
        return decimalOne.add(immortality.getLevel().add(1).log(immortality.isHero ? 1.01 : 33));
    }

    const unholyRecall = gameData.taskData["Cosmic Recollection"];
    unholyRecall.getEffect = function() {
        let ret = unholyRecall.getLevel().times(0.00065);
        
        if (unholyRecall.isHero)
            ret = ret.times(100);
        
        return ret;
    }

    const transcendentMaster = milestoneData["Transcendent Master"]
    transcendentMaster.getEffect = function () {
        if (gameData.requirements["Transcendent Master"].isCompleted())
            return 1.5

        return 1
    }

    const faintHope = milestoneData["Faint Hope"]
    faintHope.getEffect = function () {
        let mult = decimalOne
        if (gameData.requirements["A New Hope"].isCompleted()) {
            mult = softcap(new Decimal(1e308), 10000000, 0.01)
        }
        else if (gameData.requirements["Speed speed speed"].isCompleted()) {
            mult = Decimal.exp((gameData.requirements["Strong Hope"].isCompleted() ? gameData.rebirthFiveTime : gameData.rebirthThreeTime)
                .times(0.0053)).times(getUnpausedGameSpeed().log(2)).times(7.5275)
            mult = mult.min(1e308)
            mult = softcap(mult, 10000000, 0.01)
        }
        else if (gameData.requirements["Faint Hope"].isCompleted()) {
            let kickin = Decimal.sub(1.1754, gameData.rebirthThreeTime.add(1).ln().times(0.082)).max(0.15);
                
            mult = gameData.rebirthThreeTime
                .times(gameData.requirements["Angry Heroes"].isCompleted() ? 10 : 1)
                .div(kickin.times(7750))
                .times(getUnpausedGameSpeed().log(2))
                .add(1);
        }
        return mult
    }

    const riseOfGreatHeroes = milestoneData["Rise of Great Heroes"]
    riseOfGreatHeroes.getEffect = function () {
        let mult = decimalOne;
        
        if (gameData.requirements["Rise of Great Heroes"].isCompleted()) {
            let countHeroes = 0
            for (const taskName in gameData.taskData) {
                if (gameData.taskData[taskName].isHero)
                    countHeroes++
            }
            mult = Decimal.times(countHeroes, 6).div(74).add(1);
        }

        return mult
    }
}

function getDarknessXpGain() {
    const strangeMagic = gameData.requirements["Strange Magic"].isCompleted() ? 1e50 : 1
    return strangeMagic
}

function getHappiness() {
    if (gameData.active_challenge == "legends_never_die" || gameData.active_challenge == "the_darkest_time") return decimalOne
    
    const meditationEffect = getBindedTaskEffect("Meditation")
    const butlerEffect = getBindedItemEffect("Butler")
    const mindreleaseEffect = getBindedTaskEffect("Mind Release")
    const multiverseFragment = getBindedItemEffect("Multiverse Fragment")
    const stairWayToHeaven = getBindedItemEffect("Stairway to heaven")
    const godsBlessings = gameData.requirements["God's Blessings"].isCompleted() ? new Decimal(10000000) : decimalOne
    
    let happiness = godsBlessings
        .times(meditationEffect())
        .times(butlerEffect())
        .times(mindreleaseEffect())
        .times(multiverseFragment())
        .times(gameData.currentProperty.getEffect())
        .times(getChallengeBonus("an_unhappy_life"))
        .times(stairWayToHeaven())

    if (gameData.active_challenge == "dance_with_the_devil") return Decimal.pow(happiness, 0.075)
    if (gameData.active_challenge == "an_unhappy_life") return Decimal.pow(happiness, 0.5)
    return happiness
}

function getEvil() {
    return gameData.evil
}

function getEvilXpGain() {
    if (gameData.active_challenge == "legends_never_die" || gameData.active_challenge == "the_darkest_time") return decimalOne
    
    if (gameData.active_challenge == "dance_with_the_devil") {
        return Decimal.pow(getEvil(), 0.35).div(1e3).sub(1).max(0)
    }

    return getEvil()
}

function getEssence() {
    if (gameData.essence == Infinity || gameData.essence > 1e308)
        return 1e308
    return gameData.essence
}

function getEssenceXpGain() {
    if (gameData.active_challenge == "dance_with_the_devil" || gameData.active_challenge == "the_darkest_time") {
        return Decimal.pow(getEssence(), 0.35).div(100).sub(1).max(0)
    }

    return getEssence()
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = decimalOne
    multipliers.forEach((multiplierFunction) => {
        finalMultiplier = finalMultiplier.times(multiplierFunction())
    })
    return Decimal.times(value, finalMultiplier)
}

function applySpeed(value) {
    if (Decimal.eq(value, 0))
        return decimalZero
    if (Decimal.eq(value, Decimal.dInf))
        return Decimal.dInf
    return Decimal.times(value, getGameSpeed()).div(updateSpeed).times(tempData.devSpeed ? tempData.devSpeed : 1)
}

function applyUnpausedSpeed(value) {
    if (Decimal.eq(value, 0))
        return decimalZero
    if (Decimal.eq(value, Decimal.dInf))
        return Decimal.dInf
    return Decimal.times(value, getUnpausedGameSpeed()).div(updateSpeed).times(tempData.devSpeed ? tempData.devSpeed : 1)
}

function getEvilGain() {


    const evilControl = gameData.taskData["Evil Control"]
    const bloodMeditation = gameData.taskData["Blood Meditation"]
    const absoluteWish = gameData.taskData ["Absolute Wish"]
    const oblivionEmbodiment = gameData.taskData ["Void Embodiment"]
    const yingYang = gameData.taskData["Yin Yang"]
    const inferno = gameData.requirements["Inferno"].isCompleted() ? 5 : 1    
    const theDevilInsideYou = gameData.requirements["The Devil inside you"].isCompleted() ? 1e15 : 1
    const stairWayToHell = getBindedItemEffect("Highway to hell")
    const evilBooster = (gameData.perks.evil_booster == 1) ? 1e50 : 1

    return evilControl.getEffect()
        .times(bloodMeditation.getEffect())
        .times(absoluteWish.getEffect())
        .times(oblivionEmbodiment.getEffect())
        .times(yingYang.getEffect())
        .times(inferno)
        .times(getChallengeBonus("legends_never_die"))
        .times(getDarkMatterSkillEvil())
        .times(theDevilInsideYou)
        .times(stairWayToHell())
        .times(evilBooster)
}

function getEssenceGain() {
    const essenceControl = gameData.taskData["Yin Yang"]
    const essenceCollector = gameData.taskData["Essence Collector"]
    const transcendentMaster = milestoneData["Transcendent Master"]
    const faintHope = milestoneData["Faint Hope"]
    const rise = milestoneData["Rise of Great Heroes"]
    const darkMagician = gameData.taskData["Dark Magician"]

    const theNewGold = gameData.requirements["The new gold"].isCompleted() ? 1000 : 1
    const lifeIsValueable = gameData.requirements["Life is valueable"].isCompleted() ? gameData.dark_matter : 1

    return essenceControl.getEffect()
        .times(essenceCollector.getEffect())
        .times(transcendentMaster.getEffect())
        .times(faintHope.getEffect())
        .times(rise.getEffect())
        .times(getChallengeBonus("dance_with_the_devil"))
        .times(getAGiftFromGodEssenceGain())
        .times(darkMagician.getEffect())
        .times(getDarkMatterSkillEssence())
        .times(theNewGold)
        .times(lifeIsValueable)
        .times(essenceMultGain())
}

function getDarkMatterGain() {
    const darkRuler = gameData.taskData["Dark Ruler"]
    const darkMatterHarvester = gameData.requirements["Dark Matter Harvester"].isCompleted() ? 10 : 1
    const darkMatterMining = gameData.requirements["Dark Matter Mining"].isCompleted() ? 3 : 1
    const darkMatterMillionaire = gameData.requirements["Dark Matter Millionaire"].isCompleted() ? 500 : 1
    const Desintegration = gameData.itemData['Desintegration'].getEffect()
    const TheEndIsNear = getUnspentPerksDarkmatterGainBuff() 

    return decimalOne
        .times(darkRuler.getEffect())
        .times(darkMatterHarvester)
        .times(darkMatterMining)
        .times(darkMatterMillionaire)
        .times(getChallengeBonus("the_darkest_time"))
        .times(getDarkMatterSkillDarkMater())
        .times(darkMatterMultGain())
        .times((Desintegration == 0 ? 1 : Desintegration))
        .times(TheEndIsNear)
}

function getDarkMatter() {
    return gameData.dark_matter;
}

function getDarkMatterXpGain() {
    if (getDarkMatter().lt(1))
        return decimalOne

    return getDarkMatter().add(1);
}

function getDarkOrbs() {
    return gameData.dark_orbs
}

function getGameSpeed() {
    if (!canSimulate())
        return decimalZero

    return getUnpausedGameSpeed()
}

function getUnpausedGameSpeed() {
    const boostWarping = gameData.boost_active ? gameData.metaverse.boost_warp_modifier : 1
    const timeWarping = gameData.taskData["Time Warping"]
    const temporalDimension = gameData.taskData["Temporal Dimension"]
    const timeLoop = gameData.taskData["Time Loop"]
    const warpDrive = (gameData.requirements["Eternal Time"].isCompleted()) ? 2 : 1
    const speedSpeedSpeed = gameData.requirements["Speed speed speed"].isCompleted() ? 1000 : 1
    const timeIsAFlatCircle = gameData.requirements["Time is a flat circle"].isCompleted() ? 1000 : 1
    
    let gameSpeed = baseGameSpeed
        .times(boostWarping)
        .times(timeWarping.getEffect())
        .times(temporalDimension.getEffect())
        .times(timeLoop.getEffect())
        .times(warpDrive)
        .times(speedSpeedSpeed)
        .times(timeIsAFlatCircle)
        .times(getChallengeBonus("time_does_not_fly"))
        .times(getGottaBeFastGain())
        .times(getDarkMatterSkillTimeWarping())

    if (gameData.active_challenge == "time_does_not_fly" || gameData.active_challenge == "the_darkest_time")
        return Decimal.pow(gameSpeed, 0.7)

    if (gameData.active_challenge == "legends_never_die")
        return Decimal.pow(gameSpeed, 0.75)
        
    return gameSpeed
}

function applyExpenses() {
    if (!gameData.coins.isFinite())
        return

    gameData.coins = gameData.coins.sub(applySpeed(getExpense()))

    if (gameData.coins.lt(0)) {
        gameData.coins = decimalZero
        if (getIncome().lt(getExpense()))
            goBankrupt()
    }
}

function goBankrupt() {
    gameData.coins = decimalZero
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
    autoBuyEnabled = true
}

async function downloadFile() {
    let response = await fetch("./changelog.txt");

    if (response.status != 200) {
        throw new Error("Server Error");
    }

    // read response stream as text
    let text_data = await response.text();

    return text_data;
}

document.querySelector("#changelogTabTabButton").addEventListener('click', async function () {
    try {
        let text_data = await downloadFile();
        document.querySelector("#changelog").textContent = text_data;
    }
    catch (e) {
        alert(e.message);
    }
});

function togglePause() {
    gameData.paused = !gameData.paused
}

function forceAutobuy() {
    autoBuyEnabled = true
}

function setCurrentProperty(propertyName) {
    if (gameData.paused)
        return
    autoBuyEnabled = false
    gameData.currentProperty = gameData.itemData[propertyName]
}

function setMisc(miscName) {
    if (gameData.paused)
        return
    autoBuyEnabled = false
    const misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createGameObjects(data, baseData) {
    for (const key in baseData)
        createGameObject(data, baseData[key])
}

function createGameObject(data, entity) {
    if ("income" in entity) { data[entity.name] = new Job(entity) }
    else if ("maxXp" in entity) { data[entity.name] = new Skill(entity) }
    else if ("tier" in entity) { data[entity.name] = new Milestone(entity) }
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function setCurrency(index) {
    gameData.settings.currencyNotation = index
    selectElementInGroup("CurrencyNotation", index)
}

function setNotation(index) {
    gameData.settings.numberNotation = index
    selectElementInGroup("Notation", index)
}

function getNet() {
    return Decimal.abs(getIncome().sub(getExpense()))
}

function getIncome() {
    if (gameData.active_challenge == "the_darkest_time")
        return decimalZero
    
    return gameData.currentJob.getIncome()
        .times(getDarkMatterSkillIncome())
}

function getExpense() {
    var expense = decimalZero
    expense = expense.add(gameData.currentProperty.getExpense())
    for (misc of gameData.currentMisc) {
        expense = expense.add(misc.getExpense())
    }
    return expense
}

function increaseCoins() {
    gameData.coins = gameData.coins.add(applySpeed(getIncome()))
}

function autoPerks() {
    // perks
    if (gameData.perks.auto_boost == 1 && !gameData.boost_active && gameData.boost_cooldown.lte(0))
        applyBoost()

    if (gameData.perks.auto_dark_orb == 1 && gameData.dark_matter.gte(getDarkOrbGeneratorCost().times(10)) && gameData.dark_orbs.lt(getDarkOrbCap()))
        buyDarkOrbGenerator()

    if (gameData.perks.auto_dark_orb == 1 && gameData.dark_matter.gte(100) && gameData.dark_matter_shop.a_miracle == false)
        buyAMiracle()

    if (gameData.perks.auto_dark_shop == 1 && gameData.dark_orbs.gte(1000)) {
        buyADealWithTheChairman()
        buyAGiftFromGod()
        buyGottaBeFast()
        buyLifeCoach()
    }

    if (gameData.perks.auto_sacrifice == 1 && gameData.hypercubes.gte(1000)) {
        buyDarkMatterMult()
        buyChallengeAltar()
        buyEssenceMult()
        if (gameData.hypercubes.gt(evilTranCost().times(100)))
            buyEvilTran()
        if (gameData.hypercubes.gt(boostDurationCost().times(100)))
            buyBoostDuration()
        if (gameData.hypercubes.gt(reduceBoostCooldownCost().times(100)))
            buyReduceBoostCooldown()
        if (gameData.hypercubes.gt(hypercubeGainCost().times(100)))
            buyHypercubeGain()
    }
}

function autoPromote() {
    let maxIncome = decimalZero;
    for (const key in gameData.taskData) {
        const task = gameData.taskData[key]
        if (task instanceof Job && gameData.requirements[key].isCompleted()) {
            const income = task.getIncome();
            if (income.gt(maxIncome)) {
                maxIncome = income
                gameData.currentJob = task
            }
        }
    }
}

function autoBuy() {
    if (!autoBuyEnabled) return

    let usedExpense = decimalZero
    const income = getIncome()

    for (const key in gameData.itemData) {
        if (gameData.requirements[key].isCompleted()) {
            const item = gameData.itemData[key]
            const expense = item.getExpense()

            if (itemCategories['Properties'].indexOf(key) != -1) {
                if (expense.lt(income) && expense.gte(usedExpense)) {
                    gameData.currentProperty = item
                    usedExpense = expense
                }
            }
        }
    }

    for (const key in gameData.currentMisc) {
        usedExpense = usedExpense.add(gameData.currentMisc[key].getExpense())
    }

    for (const key in gameData.itemData) {
        if (gameData.requirements[key].isCompleted()) {
            const item = gameData.itemData[key]
            const expense = item.getExpense()
            if (itemCategories['Misc'].indexOf(key) != -1) {
                if (expense.lt(income - usedExpense)) {
                    if (gameData.currentMisc.indexOf(item) == -1) {
                        gameData.currentMisc.push(item)
                        usedExpense = usedExpense.add(expense)
                    }
                }
            }
        }
    }   
}

function increaseDays() {
    gameData.days = gameData.days.add(applySpeed(1))
    gameData.totalDays = gameData.totalDays.add(applySpeed(1))
}

function increaseRealtime() {
    if (!canSimulate())
        return;
    
    let realDiff = (tempData.devSpeed ? tempData.devSpeed : 1.0) / updateSpeed;
    gameData.realtime = gameData.realtime.add(realDiff);
    gameData.realtimeRun = gameData.realtimeRun.add(realDiff);
    gameData.rebirthOneTime = gameData.rebirthOneTime.add(realDiff);
    gameData.rebirthTwoTime = gameData.rebirthTwoTime.add(realDiff);
    gameData.rebirthThreeTime = gameData.rebirthThreeTime.add(realDiff);
    gameData.rebirthFourTime = gameData.rebirthFourTime.add(realDiff);
    gameData.rebirthFiveTime = gameData.rebirthFiveTime.add(realDiff);
    
    if (gameData.boost_active) {
        gameData.boost_timer = gameData.boost_timer.sub(realDiff);
        if (gameData.boost_timer.lt(0)) {
            gameData.boost_timer = decimalZero
            gameData.boost_active = false
            gameData.boost_cooldown = getBoostCooldownSeconds()
        }
    }
    else {
        gameData.boost_cooldown = gameData.boost_cooldown.sub(realDiff)

        if (gameData.boost_cooldown.lt(0)) 
            gameData.boost_cooldown = decimalZero
    }
}

function setTheme(index, reload=false) {
    const body = document.getElementById("body")

    body.classList.remove("dark")
    body.classList.remove("colorblind")

    if (index == 0) {
        // lignt
    }
    else if (index == 1) {
        // dark
        body.classList.add("dark")
    }
    else if (index == 2){
        // colorblind Tritanopia
        body.classList.add("colorblind")
    }

    gameData.settings.theme = index
    selectElementInGroup("Theme", index)

    if (reload) {
        saveGameData()
        location.reload()
    }
}

function setEnableKeybinds(enableKeybinds) {
    gameData.settings.enableKeybinds = enableKeybinds
    selectElementInGroup("EnableKeybinds", enableKeybinds ? 0 : 1)
}

function resetEvilPerks(){
    if (gameData.requirements["God's Blessings"].isCompleted())
        return;
    gameData.evil_perks_points = decimalZero
    gameData.evil_perks.receive_essence = decimalZero
    
    if (!gameData.evil_perks_keep){
        gameData.evil_perks.reduce_eye_requirement = decimalZero
        gameData.evil_perks.reduce_evil_requirement = decimalZero
        gameData.evil_perks.reduce_the_void_requirement = decimalZero
        gameData.evil_perks.reduce_celestial_requirement = decimalZero
    }
}

function rebirthOne() {
    if (!gameData.requirements["Rebirth button 1"].isCompleted())
        return;

    gameData.rebirthOneCount = gameData.rebirthOneCount.add(1)
    if (gameData.stats.fastest1 == null || gameData.rebirthOneTime.lt(gameData.stats.fastest1))
        gameData.stats.fastest1 = gameData.rebirthOneTime
    gameData.rebirthOneTime = decimalZero

    rebirthReset()
}

function rebirthTwo() {
    if (!gameData.requirements["Rebirth button 2"].isCompleted())
        return;

    gameData.rebirthTwoCount = gameData.rebirthTwoCount.add(1)
    gameData.evil = gameData.evil.add(getEvilGain())

    resetEvilPerks()

    if (gameData.stats.fastest2 == null || gameData.rebirthTwoTime.lt(gameData.stats.fastest2))
        gameData.stats.fastest2 = gameData.rebirthTwoTime
    gameData.rebirthOneTime = decimalZero
    gameData.rebirthTwoTime = decimalZero

    rebirthReset()
    gameData.active_challenge = ""

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = decimalZero
    }
}

function rebirthThree() {
    if (!gameData.requirements["Rebirth button 3"].isCompleted())
        return;

    gameData.rebirthThreeCount = gameData.rebirthThreeCount.add(1)
    gameData.essence = gameData.essence.add(getEssenceGain())
    gameData.evil = evilTranGain()

    resetEvilPerks()

    if (gameData.stats.fastest3 == null || gameData.rebirthThreeTime.lt(gameData.stats.fastest3))
        gameData.stats.fastest3 = gameData.rebirthThreeTime
    gameData.rebirthOneTime = decimalZero
    gameData.rebirthTwoTime = decimalZero
    gameData.rebirthThreeTime = decimalZero

    const recallEffect = gameData.taskData["Cosmic Recollection"].getEffect();

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = Decimal.floor(recallEffect.times(task.getLevel()));
    }

    rebirthReset()
    gameData.active_challenge = ""
}

function rebirthFour() {
    if (!gameData.requirements["Rebirth button 4"].isCompleted())
        return;

    gameData.rebirthFourCount = gameData.rebirthFourCount.add(1)
    gameData.essence = decimalZero
    gameData.evil = decimalZero
    gameData.dark_matter = gameData.dark_matter.add(getDarkMatterGain())
    gameData.evil_perks_points = decimalZero
    gameData.evil_perks.receive_essence = decimalZero

    if (gameData.metaverse.challenge_altar.eq(0) && gameData.perks.save_challenges == 0)  {
        for (const challenge in gameData.challenges) {
            gameData.challenges[challenge] = decimalZero
        }
        gameData.requirements["Challenges"].completed = false
    }

    if (gameData.stats.fastest4 == null || gameData.rebirthFourTime.lt(gameData.stats.fastest4))
        gameData.stats.fastest4 = gameData.rebirthFourTime
    gameData.rebirthOneTime = decimalZero
    gameData.rebirthTwoTime = decimalZero
    gameData.rebirthThreeTime = decimalZero
    gameData.rebirthFourTime = decimalZero

    rebirthReset()

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = decimalZero
    }

    gameData.active_challenge = ""
}

function rebirthFive() {
    if (!gameData.requirements["Rebirth button 5"].isCompleted())
        return;

    gameData.rebirthFiveCount = gameData.rebirthFiveCount.add(1)
    gameData.perks_points = gameData.perks_points.add(getMetaversePerkPointsGain())
    gameData.essence = decimalZero
    gameData.evil = decimalZero
    gameData.evil_perks_points = decimalZero
    gameData.evil_perks.receive_essence = decimalZero
    gameData.dark_matter = decimalZero
    gameData.dark_orbs = decimalZero
    gameData.dark_matter_shop.dark_orb_generator = decimalZero
    gameData.dark_matter_shop.a_miracle = false
    gameData.dark_matter_shop.continuum_unlock = true

    gameData.dark_matter_shop.a_deal_with_the_chairman = decimalZero
    gameData.dark_matter_shop.a_gift_from_god = decimalZero
    gameData.dark_matter_shop.gotta_be_fast = decimalZero
    gameData.dark_matter_shop.life_coach = decimalZero
    

    if (gameData.perks.keep_dark_mater_skills == 0) {
        gameData.dark_matter_shop.speed_is_life = 0
        gameData.dark_matter_shop.your_greatest_debt = 0
        gameData.dark_matter_shop.essence_collector = 0
        gameData.dark_matter_shop.explosion_of_the_universe = 0
        gameData.dark_matter_shop.multiverse_explorer = 0
    }

    if (gameData.perks.save_challenges == 0) {
        for (const challenge in gameData.challenges) {
            gameData.challenges[challenge] = decimalZero
        }
        gameData.requirements["Challenges"].completed = false
    }

    gameData.requirements["Dark Matter"].completed = false
    gameData.requirements["Dark Matter Skills"].completed = false
    gameData.requirements["Dark Matter Skills2"].completed = false


    if (gameData.stats.fastest5 == null || gameData.rebirthFiveTime.lt(gameData.stats.fastest5))
        gameData.stats.fastest5 = gameData.rebirthFiveTime
    gameData.rebirthOneTime = decimalZero
    gameData.rebirthTwoTime = decimalZero
    gameData.rebirthThreeTime = decimalZero
    gameData.rebirthFourTime = decimalZero
    gameData.rebirthFiveTime = decimalZero

    gameData.boost_active = false
    gameData.boost_timer = decimalZero
    gameData.boost_cooldown = decimalZero

    gameData.hypercubes = decimalZero
    gameData.metaverse.boost_cooldown_modifier = decimalOne
    gameData.metaverse.boost_timer_modifier = decimalOne
    gameData.metaverse.boost_warp_modifier = new Decimal(100)
    gameData.metaverse.hypercube_gain_modifier = decimalOne
    gameData.metaverse.evil_tran_gain = decimalZero
    gameData.metaverse.essence_gain_modifier = decimalZero
    gameData.metaverse.challenge_altar = decimalZero
    gameData.metaverse.dark_mater_gain_modifer = decimalZero

    rebirthReset()

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = decimalZero
    }

    gameData.active_challenge = ""
}

function applyMilestones() {
    if (((gameData.requirements["Magic Eye"].isCompleted()) && (gameData.requirements["Rebirth note 2"].isCompleted())) ||
        gameData.requirements["Almighty Eye"].isCompleted() || gameData.dark_matter_shop.continuum_unlock) {
        for (taskName in gameData.taskData) {
            const task = gameData.taskData[taskName]
            const effect = gameData.taskData["Cosmic Recollection"].getEffect()
            task.maxLevel = task.maxLevel.max(task.getLevel().times(effect.max(1)).floor())
        }
    }

    if (canSimulate()) {
        if (gameData.requirements["Deal with the Devil"].isCompleted() && gameData.requirements["Rebirth note 3"].isCompleted()) {
            if (gameData.evil.eq(0))
                gameData.evil = decimalOne
            if (gameData.evil.lt(getEvilGain()))
                gameData.evil = gameData.evil.times(Math.pow(1.001, 1))
        }

        if (gameData.requirements["Hell Portal"].isCompleted()) {
            if (gameData.evil.eq(0))
                gameData.evil = decimalOne
            if (gameData.evil.lt(getEvilGain())) {
                const exponent = gameData.requirements["Mind Control"].isCompleted() ? 1.07 : 1.01
                gameData.evil = gameData.evil.times(Math.pow(exponent, 1))
            }
        }

        if (gameData.requirements["Galactic Emperor"].isCompleted()) {
            if (gameData.essence.eq(0))
                gameData.essence = decimalOne
            if (gameData.essence.lt(getEssenceGain().times(10)))
                gameData.essence = gameData.essence.times(Math.pow(1.002, 1))
        }
    }
}

function rebirthReset(set_tab_to_jobs = true) {
    if (set_tab_to_jobs) {
        // if (gameData.settings.selectedTab == Tab.METAVERSE && gameData.perks.)

        if (gameData.settings.selectedTab == Tab.METAVERSE && gameData.hypercubes.gt(0)
            || gameData.settings.selectedTab == Tab.CHALLENGES && gameData.evil.gt(10000)
            || gameData.settings.selectedTab == Tab.MILESTONES && gameData.essence.gt(0)
            || gameData.settings.selectedTab == Tab.DARK_MATTER && gameData.dark_matter.gt(0)
            || gameData.settings.selectedTab == Tab.REBIRTH
            || gameData.settings.selectedTab == Tab.EVILPERKS 
        ) {
            // do not switch tab
        }
        else
            setTab("jobs")
    }

    gameData.coins = decimalZero
    gameData.days = new Decimal(365 * 14)
    gameData.realtime = decimalZero
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
    gameData.stats.EssencePerSecond = decimalZero
    gameData.stats.maxEssencePerSecond = decimalZero
    gameData.stats.maxEssencePerSecondRt = decimalZero
    gameData.stats.EvilPerSecond = decimalZero
    gameData.stats.maxEvilPerSecond = decimalZero
    gameData.stats.maxEvilPerSecondRt = decimalZero
    autoBuyEnabled = true

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = task.maxLevel.max(task.getLevel())
        task.level = decimalZero
        task.continuumLevel = decimalZero
        task.xp = decimalZero
        task.isHero = false
        task.isFinished = false
    }

    for (const itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.isHero = false
    }

    for (const key in gameData.requirements) {
        const requirement = gameData.requirements[key]
        if (requirement.completed && (permanentUnlocks.includes(key) || metaverseUnlocks.includes(key))) continue
        requirement.completed = false
    }

    // Keep milestones which were bought in the Dark Matter shop
    if (gameData.dark_matter_shop.a_miracle) {
        gameData.requirements["Magic Eye"].completed = true
        if (gameData.rebirthOneCount.eq(0))
            gameData.rebirthOneCount = decimalOne
    }
}

function getLifespan() {
    const inLegendsNeverDie = gameData.active_challenge == "legends_never_die" || gameData.active_challenge == "the_darkest_time"

    if (gameData.rebirthFiveCount.gt(0) && !inLegendsNeverDie) return Decimal.dInf
    
    const immortality = gameData.taskData["Life Essence"]
    const superImmortality = gameData.taskData["Astral Body"]
    const higherDimensions = gameData.taskData["Higher Dimensions"]
    const abyss = gameData.taskData["Ceaseless Abyss"]
    const cosmicLongevity = gameData.taskData["Cosmic Longevity"]
    const speedSpeedSpeed = gameData.requirements["Speed speed speed"].isCompleted() ? 1000 : 1
    const lifeIsValueable = gameData.requirements["Life is valueable"].isCompleted() ? 1e5 : 1

    const lifespan = baseLifespan
        .times(immortality.getEffect())
        .times(superImmortality.getEffect())
        .times(abyss.getEffect())
        .times(cosmicLongevity.getEffect())
        .times(higherDimensions.getEffect())
        .times(speedSpeedSpeed)
        .times(lifeIsValueable)

    if (inLegendsNeverDie) return Decimal.pow(lifespan, 0.72).add(365 * 25)

    return lifespan
}

function isAlive() {
    const condition = gameData.days.lt(getLifespan()) || getLifespan().eq(Decimal.dInf)
    const deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
        //tempData.devSpeed = 1
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition && !tempData.hasError
}



function canSimulate() {
    return !gameData.paused && isAlive()
}

function isHeroesUnlocked() {
    return gameData.requirements["New Beginning"].isCompleted() && (gameData.taskData["One Above All"].getLevel().gte(2000) || gameData.taskData["One Above All"].isHero)
}

function makeHero(task) {
    if ((task instanceof Job || task instanceof Skill) && !task.isHero) {           
        task.level = decimalZero
        task.maxLevel = decimalZero
        task.xp = decimalZero
        task.isHero = true
        if (task.name === 'Life Essence') {
            task.level = decimalOne
        }
    }
}

function makeHeroes() {
    if (!isHeroesUnlocked()) return

    for (const taskname in gameData.taskData) {
        const task = gameData.taskData[taskname]

        if (task.isHero)
            continue

        const prev = getPreviousTaskInCategory(taskname)

        if (prev != "" && (!gameData.taskData[prev].isHero || gameData.taskData[prev].getLevel().lt(20)))
                continue

        const req = gameData.requirements[taskname]
        let isNewHero = true

        if (req instanceof TaskRequirement) {
            if (!req.isCompletedActual(true))
                continue
            for (const requirement of req.requirements)
                if (!(gameData.taskData[requirement.task] && gameData.taskData[requirement.task].isHero)) {
                    isNewHero = false
                    break
                }
        }
        else if (req instanceof EssenceRequirement) {
            if (!req.isCompletedActual(true))
                continue
        }

        if (isNewHero)
            makeHero(task)
    }

    for (const key in gameData.itemData) {
        const item = gameData.itemData[key]
        if (item.isHero)
            continue
        item.isHero = true
        gameData.currentProperty = gameData.itemData["Homeless"]
        gameData.currentMisc = []
    }
}


function assignMethods() {
    for (const key in gameData.taskData) {
        let task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)

        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        }
        
        gameData.taskData[key] = task
    }

    for (const key in gameData.itemData) {
        let item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (const key in gameData.requirements) {
        let requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "essence") {
            requirement = Object.assign(new EssenceRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "darkMatter") {
            requirement = Object.assign(new DarkMatterRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "darkOrb") {
            requirement = Object.assign(new DarkOrbsRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "metaverse") {
            requirement = Object.assign(new MetaverseRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "hypercube") {
            requirement = Object.assign(new HypercubeRequirement(requirement.querySelectors, requirement.requirements), requirement)
        } else if (requirement.type == "perkpoint") {
            requirement = Object.assign(new PerkPointRequirement(requirement.querySelectors, requirement.requirements), requirement)
        }
        

        const tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    const newArray = []
    for (const misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (const key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
            else if (saveDict[key].querySelectors == undefined) {
                saveDict[key].querySelectors = tempData["requirements"][key].querySelectors
            }

        }
    }

    for (const key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function peekSettingFromSave(setting) {
    try {
        const save = localStorage.getItem("gameDataSave")
        if (save == null)
            return gameData.settings[setting]
        const gameDataSave = JSON.parse(save)
        if (gameDataSave.settings == undefined || gameDataSave.settings[setting] == undefined)
            return gameData.settings[setting]
        return gameDataSave.settings[setting]
    } catch (error) {
        console.error(error)
        console.log(localStorage.getItem("gameDataSave"))
        alert("It looks like you tried to load a corrupted save... If this issue persists, feel free to contact the developers!")
    }
}

function loadGameData() {
    try {
        const gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

        if (gameDataSave !== null) {
            // When the game contains completedTimes, add 1 Dark Matter and remove the instance.
            if ("completedTimes" in gameDataSave && gameDataSave["completedTimes"] > 0) {
                delete gameDataSave["completedTimes"]
                gameDataSave.dark_matter = Decimal.add(gameDataSave.dark_matter, 1)
                console.log("Gave 1 free Dark Matter")
            }

            // remove milestoneData from gameData
            if ("milestoneData" in gameDataSave) {
                delete gameDataSave["milestoneData"]                
            }

            replaceSaveDict(gameData, gameDataSave)
            replaceSaveDict(gameData.requirements, gameDataSave.requirements)
            replaceSaveDict(gameData.taskData, gameDataSave.taskData)
            replaceSaveDict(gameData.itemData, gameDataSave.itemData)
            replaceSaveDict(gameData.settings, gameDataSave.settings)
            replaceSaveDict(gameData.stats, gameDataSave.stats)
            replaceSaveDict(gameData.challenges, gameDataSave.challenges)
            replaceSaveDict(gameData.dark_matter_shop, gameDataSave.dark_matter_shop)
            replaceSaveDict(gameData.metaverse, gameDataSave.metaverse)
            replaceSaveDict(gameData.perks, gameDataSave.perks)
            gameData = gameDataSave

            if (gameData.coins == null)
                gameData.coins = decimalZero

            if (gameData.essence == null)
                gameData.essence = decimalZero

            if (gameData.days == null)
                gameData.days = new Decimal(365 * 14)

            if (gameData.evil == null)
                gameData.evil = decimalZero

            if (gameData.dark_matter == null || Decimal.isNaN(gameData.dark_matter))
                gameData.dark_matter = decimalZero

            if (gameData.dark_orbs == null || Decimal.isNaN(gameData.dark_orbs))
                gameData.dark_orbs = decimalZero

            if (gameData.hypercubes == null || Decimal.isNaN(gameData.hypercubes))
                gameData.hypercubes = decimalZero

            if (gameData.perks_points == null || Decimal.isNaN(gameData.perks_points))
                gameData.perks_points = decimalZero

            if (gameData.settings.theme == null) {
                gameData.settings.theme = 1
            }

            if (gameData.rebirthOneTime == null || Decimal.eq(gameData.rebirthOneTime, 0)) {
                gameData.rebirthOneTime = gameData.realtime
            }

            if (gameData.rebirthTwoTime == null || Decimal.eq(gameData.rebirthTwoTime, 0)) {
                gameData.rebirthTwoTime = gameData.realtime
            }

            if (gameData.rebirthThreeTime == null || Decimal.eq(gameData.rebirthThreeTime, 0)) {
                gameData.rebirthThreeTime = gameData.realtime
            }

            if (gameData.rebirthFourTime == null || Decimal.eq(gameData.rebirthFourTime, 0)) {
                gameData.rebirthFourTime = gameData.realtime
            }

            if (gameData.rebirthFiveTime == null || Decimal.eq(gameData.rebirthFiveTime, 0)) {
                gameData.rebirthFiveTime = gameData.realtime
            }

            // Remove invalid active misc items
            gameData.currentMisc = gameData.currentMisc.filter((element) => element instanceof Item)

            convertSaveToDecimal();
        }
    } catch (error) {
        console.error(error)
        console.log(localStorage.getItem("gameDataSave"))
        alert("It looks like you tried to load a corrupted save... If this issue persists, feel free to contact the developers!")
    }

    assignMethods()
}

function convertSaveToDecimal() {
    // Convert game data
    let gameDataItems = [
        'coins', 'days', 'totalDays', 'evil', 'essence', 'dark_matter', 'dark_orbs', 'hypercubes', 'perks_points',
        'rebirthOneCount', 'rebirthTwoCount', 'rebirthThreeCount', 'rebirthFourCount', 'rebirthFiveCount',
        'rebirthOneTime', 'rebirthTwoTime', 'rebirthThreeTime', 'rebirthFourTime', 'rebirthFiveTime',
        'realtime', 'realtimeRun', 'boost_cooldown', 'boost_timer', 'evil_perks_points'
    ];
    for (i in gameDataItems) {
        let decimal = new Decimal(gameData[gameDataItems[i]]);
        if (!Decimal.isNaN(decimal))
            gameData[gameDataItems[i]] = decimal
    }
    // Convert task data
    for (i in gameData.taskData) {
        // Level, max level, and xp
        gameData.taskData[i].level = new Decimal(gameData.taskData[i].level);
        gameData.taskData[i].continuumLevel = new Decimal(gameData.taskData[i].continuumLevel);
        gameData.taskData[i].maxLevel = new Decimal(gameData.taskData[i].maxLevel);
        gameData.taskData[i].xp = new Decimal(gameData.taskData[i].xp);
        // Perform operations necessary to migrate tasks from the old BigInt XP system
        if (gameData.taskData[i].isFinished && gameData.taskData[i].level.lt(1e9)) {
            gameData.taskData[i].xp = new Decimal(gameData.taskData[i].xpBigInt)
            delete gameData.taskData[i].xpBigInt
            gameData.taskData[i].isFinished = false
        }
    }
    // Convert stats
    for (i in gameData.stats) {
        if (i == 'startDate' || gameData.stats[i] === null)
            continue;
        let decimal = new Decimal(gameData.stats[i]);
        if (!Decimal.isNaN(decimal))
            gameData.stats[i] = decimal
    }
    // Convert challenges
    for (i in gameData.challenges) {
        let decimal = new Decimal(gameData.challenges[i]);
        if (!Decimal.isNaN(decimal))
            gameData.challenges[i] = decimal
    }
    // Convert Dark Matter Shop items
    for (i in gameData.dark_matter_shop) {
        if (i == 'a_miracle' || i == 'continuum_unlock' || i == 'speed_is_life' || i == 'your_greatest_debt'
            || i == 'essence_collector' || i == 'explosion_of_the_universe' || i == 'multiverse_explorer')
            continue;
        let decimal = new Decimal(gameData.dark_matter_shop[i]);
        if (!Decimal.isNaN(decimal))
            gameData.dark_matter_shop[i] = decimal
    }
    // Convert Metaverse
    for (i in gameData.metaverse) {
        let decimal = new Decimal(gameData.metaverse[i]);
        if (!Decimal.isNaN(decimal))
            gameData.metaverse[i] = decimal
    }
    // Convert Evil Perks
    for (i in gameData.evil_perks) {
        let decimal = new Decimal(gameData.evil_perks[i]);
        if (!Decimal.isNaN(decimal))
            gameData.evil_perks[i] = decimal
    }
    // Unlock Continuum immediately when the save has "A miracle" unlocked (or has at least one Metaverse reset)
    if (gameData.dark_matter_shop.a_miracle || gameData.rebirthFiveCount.gt(0))
        gameData.dark_matter_shop.continuum_unlock = true
}

function update(needUpdateUI = true) {
    makeHeroes()
    increaseRealtime()
    increaseDays()
    autoPerks()
    autoPromote()
    autoBuy()
    applyExpenses()
    // Perform all unlocked tasks at once
    for (const key in gameData.taskData) {
        const task = gameData.taskData[key]
        if ((task instanceof Skill || task instanceof Job) && gameData.requirements[key].isCompleted()) {
            task.increaseXp()
        }
    }
    increaseCoins()

    gameData.evil_perks_points = gameData.evil_perks_points.add(applySpeed(getEvilPerksGeneration()))
    gameData.dark_orbs = gameData.dark_orbs.add(applySpeed(getDarkOrbGeneration())).min(getDarkOrbCap())
    gameData.hypercubes = gameData.hypercubes.add(applySpeed(getHypercubeGeneration())).min(getHypercubeCap())
    
    applyMilestones()
    applyEvilPerks()
    applyPerks()
    updateStats()
    if (needUpdateUI && !document.hidden)
        updateUI()
    else
        updateRequirements()
}

function applyPerks() {
    if (gameData.perks.instant_evil == 1) {
        gameData.evil = gameData.evil.max(getEvilGain().times(10))
    }

    if (gameData.perks.instant_essence == 1) {
        gameData.essence = gameData.essence.max(getEssenceGain().times(10))
    }

    if (gameData.perks.instant_dark_matter == 1) {
        gameData.dark_matter = gameData.dark_matter.max(getDarkMatterGain().times(10))
    }
}

function applyEvilPerks() {
    if (!gameData.evil_perks_keep && gameData.requirements["Dark Orbiter"].isCompleted())
        gameData.evil_perks_keep = true


    gameData.requirements["Rebirth note 0"].requirements[0].requirement = getAge0Requirement()
    gameData.requirements["Rebirth note 1"].requirements[0].requirement = getAge1Requirement()
    gameData.requirements["Rebirth note 2"].requirements[0].requirement = getEyeRequirement()
    gameData.requirements["Rebirth button 1"].requirements[0].requirement = getEyeRequirement()
    gameData.requirements["key1"].requirements[0].requirement = getEyeRequirement()

    gameData.requirements["Rebirth note 3"].requirements[0].requirement = getEvilRequirement()
    gameData.requirements["Rebirth button 2"].requirements[0].requirement = getEvilRequirement()
    gameData.requirements["Rebirth stats evil"].requirements[0].requirement = getEvilRequirement()    
    gameData.requirements["key2"].requirements[0].requirement = getEvilRequirement()

    gameData.requirements["Rebirth note 4"].requirements[0].requirement = getVoidRequirement()
    gameData.requirements["Void Manipulation"].requirements[0].requirement = getVoidRequirement()
    gameData.requirements["The Void"].requirements[0].requirement = getVoidRequirement()
    gameData.requirements["Corrupted"].requirements[0].requirement = getVoidRequirement()

    gameData.requirements["Galactic Council"].requirements[0].requirement = getCelestialRequirement()
    gameData.requirements["Celestial Powers"].requirements[0].requirement = getCelestialRequirement()
    gameData.requirements["Rebirth note 5"].requirements[0].requirement = getCelestialRequirement()
    gameData.requirements["Eternal Wanderer"].requirements[0].requirement = getCelestialRequirement()
}

function updateRequirements() {
    // Call isCompleted on every requirement as that function caches its result in requirement.completed
    for (const i in gameData.requirements) gameData.requirements[i].isCompleted()
}

function updateStats() {
    if (gameData.requirements["Rebirth stats evil"].isCompleted() && gameData.rebirthTwoTime.gt(0)) {
        gameData.stats.EvilPerSecond = getEvilGain().div(gameData.rebirthTwoTime)
        if (gameData.stats.EvilPerSecond.gt(gameData.stats.maxEvilPerSecond)) {
            gameData.stats.maxEvilPerSecond = gameData.stats.EvilPerSecond
            gameData.stats.maxEvilPerSecondRt = gameData.rebirthTwoTime
        }
    }

    if (gameData.requirements["Rebirth stats essence"].isCompleted() && gameData.rebirthThreeTime.gt(0)) {
        gameData.stats.EssencePerSecond = getEssenceGain().div(gameData.rebirthThreeTime)
        if (gameData.stats.EssencePerSecond.gt(gameData.stats.maxEssencePerSecond)) {
            gameData.stats.maxEssencePerSecond = gameData.stats.EssencePerSecond
            gameData.stats.maxEssencePerSecondRt = gameData.rebirthThreeTime
        }
    }

    if (gameData.essence > gameData.stats.maxEssenceReached)
        gameData.stats.maxEssenceReached = gameData.essence
}

function resetGameData(force) {
    clearInterval(saveloop)
    clearInterval(gameloop)
    if (force) {
        localStorage.clear()
        location.reload()
        return
    }
    if (!confirm('Are you sure you want to reset the game?')) {
        gameloop = setInterval(update, 1000 / updateSpeed)
        saveloop = setInterval(saveGameData, 3000)
        return
    }
    resetGameData(true)
}

function importGameData() {
    try {
        const importExportBox = document.getElementById("importExportBox")
        if (importExportBox.value == "") {
            alert("It looks like you tried to load an empty save... Paste save data into the box, then click \"Import Save\" again.")
            return
        }
        const data = JSON.parse(window.atob(importExportBox.value))
        clearInterval(gameloop)
        gameData = data
        saveGameData()
        location.reload()
    } catch (error) {
        alert("It looks like you tried to load a corrupted save... If this issue persists, feel free to contact the developers!")
    }
}

function exportGameData() {
    const importExportBox = document.getElementById("importExportBox")
    const saveString = window.btoa(JSON.stringify(gameData))
    importExportBox.value = saveString
    copyTextToClipboard(saveString)
    setTimeout(() => {
        if (importExportBox.value == saveString) {
            importExportBox.value = ""
        }
    }, 15 * 1000)
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.getElementById("exportTooltip");
        tooltip.innerHTML = "&nbsp;&nbsp;Save copied to clipboard!" ;
    }, err => {
        //console.error('Async: Could not copy text: ', err);
    })
}

function outExportButton() {
    const tooltip = document.getElementById("exportTooltip");
    tooltip.textContent = "";
}

function onFontButtonHover() {
    const tooltip = document.getElementById("fontSizeTooltip");
    tooltip.classList.remove("hidden")
}

function onFontButtonStopHover() {
    const tooltip = document.getElementById("fontSizeTooltip");
    tooltip.classList.add("hidden")
}

function isNextDarkMagicSkillInReach() {
    const totalEvil = gameData.evil.add(getEvilGain())

    for (const key in gameData.taskData) {
        const skill = gameData.taskData[key]
        if (skillCategories["Dark Magic"].includes(key)) {
            const requirement = gameData.requirements[key]
            if (!requirement.isCompleted()) {
                if (Decimal.gte(totalEvil, requirement.requirements[0].requirement)) {
                    return true
                }
            }
        }
    }

    return false
}




// Loads the game save, does the initial render and starts the game update and render loop.

createGameObjects(gameData.taskData, jobBaseData)
createGameObjects(gameData.taskData, skillBaseData)
createGameObjects(gameData.itemData, itemBaseData)
createGameObjects(milestoneData, milestoneBaseData)

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = requirementsBaseData

createMilestoneRequirements()

tempData["requirements"] = {}
for (const key in gameData.requirements) {
    const requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

initializeUI()

setCustomEffects()
addMultipliers()

update()

setTab(gameData.settings.selectedTab)
setTabSettings("settingsTab")
setTabDarkMatter("shopTab")
setTabMetaverse("metaverseTab1")

let ticking = false;

var gameloop = setInterval(function() {
    if (ticking) return;
    ticking = true;
    update();

    // fps for debug only
    //var thisFrameTime = (thisLoop = new Date) - lastLoop;
    //frameTime += (thisFrameTime - frameTime) / filterStrength;
    //lastLoop = thisLoop;

    ticking = false;
}, 1000 / updateSpeed)

var saveloop = setInterval(saveGameData, 3000)

/* FPS */
/*
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
var fpsOut = document.getElementById('fps');
setInterval(function () {
    fpsOut.innerHTML = (1000 / frameTime).toFixed(1) + " fps";
}, 1000);
*/