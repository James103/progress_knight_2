function getHypercubeGeneration() {
    if (gameData.rebirthFiveCount.eq(0)) return decimalZero

    let tesseractEffect = gameData.itemData["Tesseract"].getEffect()
    let hypersphereEffect = gameData.itemData["Hypersphere"].getEffect()

    return new Decimal(0.03)
        .times(hypersphereEffect)
        .times(tesseractEffect)
        .times(gameData.metaverse.hypercube_gain_modifier)
        .times(gameData.perks.hypercube_boost == 1 ? 10 : 1)
        .times(gameData.perks.hyper_speed == 1 ? 1000 : 1)
}

function getNextPowerOfNumber(number, add_power = decimalZero) {
    let log10Number = Decimal.log10(number)
    if (Decimal.isNaN(log10Number))
        return decimalOne
    return Decimal.pow(10, Decimal.ceil(log10Number).add(add_power)).max(1)
}

function getTimeTillNextHypercubePower(add_power = decimalZero) {
    return (getNextPowerOfNumber(gameData.hypercubes, add_power).sub(gameData.hypercubes)).div(applyUnpausedSpeed(getHypercubeGeneration()).times(updateSpeed))
}

function getBoostTimeSeconds() {
    let defaultTime = new Decimal(60.0)
        .times(gameData.metaverse.boost_timer_modifier)

    return defaultTime
}

function getBoostCooldownSeconds() {
    let defaultTime = new Decimal(60.0 * 10.0)
        .div(gameData.metaverse.boost_cooldown_modifier)

    return defaultTime
}

function canApplyBoost() {
    return gameData.boost_cooldown.lte(0) && !gameData.boost_active;
}

function applyBoost() {
    if (canApplyBoost()) {
        gameData.boost_timer = getBoostTimeSeconds();
        gameData.boost_active = true;
    }
}

// shop
function reduceBoostCooldownCost() {
    return Decimal.times(1000, Decimal.pow(3, gameData.metaverse.boost_cooldown_modifier.sub(1)))
}

function canBuyReduceBoostCooldown() {
    return gameData.hypercubes.gte(reduceBoostCooldownCost())
}

function buyReduceBoostCooldown() {
    if (canBuyReduceBoostCooldown()) {
        gameData.hypercubes = gameData.hypercubes.sub(reduceBoostCooldownCost())
        gameData.metaverse.boost_cooldown_modifier = gameData.metaverse.boost_cooldown_modifier.add(1)
    }
}


function boostDurationCost() {
    return Decimal.times(5000, Decimal.pow(5, gameData.metaverse.boost_timer_modifier.sub(1)))
}

function canBuyBoostDuration() {
    return gameData.hypercubes.gte(boostDurationCost())
}

function buyBoostDuration() {
    if (canBuyBoostDuration()) {
        gameData.hypercubes = gameData.hypercubes.sub(boostDurationCost())
        gameData.metaverse.boost_timer_modifier = gameData.metaverse.boost_timer_modifier.add(1)
    }
}


function hypercubeGainCost() {
    return Decimal.times(800, Decimal.pow(1.5, gameData.metaverse.hypercube_gain_modifier.sub(1)))
}

function canBuyHypercubeGain() {
    return gameData.hypercubes.gte(hypercubeGainCost())
}

function buyHypercubeGain() {
    if (canBuyHypercubeGain()) {
        gameData.hypercubes = gameData.hypercubes.sub(hypercubeGainCost())
        gameData.metaverse.hypercube_gain_modifier = gameData.metaverse.hypercube_gain_modifier.add(1)
    }
}

function evilTranGain() {
    return (gameData.metaverse.evil_tran_gain.eq(0)) ? decimalZero : Decimal.times(250000, Decimal.pow(10, gameData.metaverse.evil_tran_gain))
}

function evilTranCost() {
    return Decimal.times(100000000, Decimal.pow(10, gameData.metaverse.evil_tran_gain))
}

function canBuyEvilTran() {
    return gameData.hypercubes.gte(evilTranCost())
}

function buyEvilTran() {
    if (canBuyEvilTran()) {
        gameData.hypercubes = gameData.hypercubes.sub(evilTranCost())
        gameData.metaverse.evil_tran_gain = gameData.metaverse.evil_tran_gain.add(1)
    }
}

function essenceMultGain() {
    return (gameData.metaverse.essence_gain_modifier.eq(0)) ? decimalOne : Decimal.pow(10, gameData.metaverse.essence_gain_modifier)
}

function essenceMultCost() {
    return Decimal.times(1e9, Decimal.pow(10, gameData.metaverse.essence_gain_modifier))
}

function canBuyEssenceMult() {
    return gameData.hypercubes.gte(essenceMultCost())
}

function buyEssenceMult() {
    if (canBuyEssenceMult()) {
        gameData.hypercubes = gameData.hypercubes.sub(essenceMultCost())
        gameData.metaverse.essence_gain_modifier = gameData.metaverse.essence_gain_modifier.add(1)
    }
}


function challengeAltarCost() {
    return 1e14
}

function canBuyChallengeAltar() {
    return gameData.metaverse.challenge_altar.eq(0) && gameData.hypercubes.gte(challengeAltarCost())
}

function buyChallengeAltar() {
    if (canBuyChallengeAltar()) {
        gameData.hypercubes = gameData.hypercubes.sub(challengeAltarCost())
        gameData.metaverse.challenge_altar = decimalOne
    }
}


function darkMatterMultGain() {
    return (gameData.metaverse.dark_mater_gain_modifer.eq(0)) ? decimalOne : Decimal.pow(10, gameData.metaverse.dark_mater_gain_modifer)
}

function darkMatterMultCost() {
    return Decimal.times(1e19, Decimal.pow(10, gameData.metaverse.dark_mater_gain_modifer))
}

function canBuyDarkMatterMult() {
    return gameData.hypercubes.gte(darkMatterMultCost())
}

function buyDarkMatterMult() {
    if (canBuyDarkMatterMult()) {
        gameData.hypercubes = gameData.hypercubes.sub(darkMatterMultCost())
        gameData.metaverse.dark_mater_gain_modifer = gameData.metaverse.dark_mater_gain_modifer.add(1)
    }
}

// perks

function getMetaversePerkPointsGain() {
    if (gameData.essence.gte(1e90)) {
        let perk_points = Decimal.floor(Decimal.log10(gameData.essence)).sub(89)
            .times(gameData.perks.more_perk_points == 1 ? 10 : 1)
            .times(gameData.perks.double_perk_points_gain == 1 ? 2 : 1)
        return perk_points
    }

    return decimalZero
}

const perks_cost = {
    auto_dark_orb: 1,
    auto_dark_shop: 1,
    auto_boost: 1,
    instant_evil: 2,
    hypercube_boost: 5,
    instant_essence: 10,
    save_challenges: 15,
    instant_dark_matter: 25,
    auto_sacrifice: 40,
    double_perk_points_gain: 50,
    positive_dark_mater_skills: 100,
    hyper_speed: 200,
    both_dark_mater_skills: 300,
    keep_dark_mater_skills: 500,
    evil_booster: 2500,
    more_perk_points: 5000,
}

const perk_names = {
    auto_dark_orb: "Auto buy dark orb generators",
    auto_dark_shop: "Auto buy dark shop items",
    auto_boost: "Auto boost",
    instant_evil: "Instant evil",
    hypercube_boost: "Hypercube boost",
    instant_essence: "Instant essence",
    save_challenges: "Save challenges",
    instant_dark_matter: "Instant dark matter",
    auto_sacrifice: "Auto sacrifice",
    double_perk_points_gain: "2x perk points gain",
    positive_dark_mater_skills: "Only positive dark matter abilities",
    hyper_speed: "Hyper speed",
    both_dark_mater_skills: "Pick both dark matter abilities",
    keep_dark_mater_skills: "keep dark matter abilities",
    evil_booster: "Evil booster",
    more_perk_points: "10x perk points gain",
}

function getMetaversePerkName(perkName) {    
    return perk_names[perkName]
}

function getPerkCost(perkName) {
    return perks_cost[perkName]
}

function canBuyPerk(perkName) {
    return gameData.perks_points.gte(getPerkCost(perkName))
}

function buyPerk(perkName) {
    if (gameData.perks[perkName] == 0) {
        if (canBuyPerk(perkName)) {
            gameData.perks_points = gameData.perks_points.sub(getPerkCost(perkName))
            gameData.perks[perkName] = 1

            if (perkName == "both_dark_mater_skills") {
                buySpeedOfLife(3)
                buyYourGreatestDebt(3)
                buyEssenceCollector(3)
                buyExplosionOfTheUniverse(3)
                buyMultiverseExplorer(3)
            }
        }
    }
    else {
        gameData.perks[perkName] = 0
        gameData.perks_points = gameData.perks_points.add(getPerkCost(perkName))

        if (perkName == "both_dark_mater_skills") {
            if (gameData.dark_matter_shop.speed_is_life == 3)
                gameData.dark_matter_shop.speed_is_life = 2
            if (gameData.dark_matter_shop.your_greatest_debt == 3)
                gameData.dark_matter_shop.your_greatest_debt = 1    
            if (gameData.dark_matter_shop.essence_collector == 3)
                gameData.dark_matter_shop.essence_collector = 2
            if (gameData.dark_matter_shop.explosion_of_the_universe == 3)
                gameData.dark_matter_shop.explosion_of_the_universe = 2
            if (gameData.dark_matter_shop.multiverse_explorer == 3)
                gameData.dark_matter_shop.multiverse_explorer = 2    
        }
    }
}

function getTotalPerkPoints() {
    let total = gameData.perks_points
    for (const key of Object.keys(gameData.perks)) {
        if (gameData.perks[key] == 1)
            total = total.add(getPerkCost(key))
    }
    return total
}

function collectPerkPoints(value) {
    for (const key of Object.keys(gameData.perks)) {
        if (gameData.perks[key] == value) {
            buyPerk(key)
        }        
    }
}

function getBoostCooldownString() {
    return gameData.boost_active
        ? "Active: " + formatTime(gameData.boost_timer)
        : (gameData.boost_cooldown.lte(0) ? "Ready!" : "Cooldown: " + formatTime(gameData.boost_cooldown))
}

function getTimeIsAFlatCircleXP() {
    if (gameData.active_challenge == "the_darkest_time")
        return 1

    return gameData.requirements["Time is a flat circle"].isCompleted() ? 1e50 : 1
}

function getUnspentPerksDarkmatterGainBuff() {
    const effect = softcap(gameData.perks_points.times(0.0027).add(2), 75, 0.01)

    return gameData.requirements["The End is near"].isCompleted() ? Decimal.pow(10, effect): 1
}

function getHypercubeCap(next = 0) {
    if (getTotalPerkPoints().gte(1) || (next > 0 && getMetaversePerkPointsGain().gt(0)))
        return new Decimal(Number.MAX_VALUE)

    return Decimal.times(1e7, Decimal.pow(10, (gameData.rebirthFiveCount.add(next)).times(3))).min(Number.MAX_VALUE)
}