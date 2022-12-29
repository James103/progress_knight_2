// Costs Dark Matter
function getDarkOrbGeneratorCost() {
    return gameData.dark_matter_shop.dark_orb_generator.times(3).add(1)
}

function canBuyDarkOrbGenerator() {
    return gameData.dark_matter.gte(getDarkOrbGeneratorCost()) && getDarkOrbGeneration().lt(getDarkOrbGenerationCap())
}


function buyDarkOrbGenerator() {
    if (canBuyDarkOrbGenerator()) {
        gameData.dark_matter = gameData.dark_matter.sub(getDarkOrbGeneratorCost())
        gameData.dark_matter_shop.dark_orb_generator = gameData.dark_matter_shop.dark_orb_generator.add(1)
    }
}

// Costs Dark Orbs
function getADealWithTheChairmanCost() {
    return Decimal.pow(1e3, gameData.dark_matter_shop.a_deal_with_the_chairman.add(1))
}

function canBuyADealWithTheChairman() {
    return gameData.dark_orbs.gte(getADealWithTheChairmanCost())
}

function buyADealWithTheChairman() {
    if (canBuyADealWithTheChairman()) {
        gameData.dark_orbs = gameData.dark_orbs.sub(getADealWithTheChairmanCost())
        gameData.dark_matter_shop.a_deal_with_the_chairman = gameData.dark_matter_shop.a_deal_with_the_chairman.add(1)
    }
}

function getAGiftFromGodCost() {
    return Decimal.pow(1e5, gameData.dark_matter_shop.a_gift_from_god.add(1))
}

function canBuyAGiftFromGod() {
    return gameData.dark_orbs.gte(getAGiftFromGodCost())
}

function buyAGiftFromGod() {
    if (canBuyAGiftFromGod()) {
        gameData.dark_orbs = gameData.dark_orbs.sub(getAGiftFromGodCost())
        gameData.dark_matter_shop.a_gift_from_god = gameData.dark_matter_shop.a_gift_from_god.add(1)
    }
}

function getLifeCoachCost() {
    return Decimal.pow(1e10, gameData.dark_matter_shop.life_coach.add(1))
}

function canBuyLifeCoach() {
    return gameData.dark_orbs.gte(getLifeCoachCost())
}

function buyLifeCoach() {
    if (canBuyLifeCoach()) {
        gameData.dark_orbs = gameData.dark_orbs.sub(getLifeCoachCost())
        gameData.dark_matter_shop.life_coach = gameData.dark_matter_shop.life_coach.add(1)
    }
}

function getGottaBeFastCost() {
    return Decimal.pow(5e7, gameData.dark_matter_shop.gotta_be_fast.add(1))
}

function canBuyGottaBeFast() {
    return gameData.dark_orbs.gte(getGottaBeFastCost())
}

function buyGottaBeFast() {
    if (canBuyGottaBeFast()) {
        gameData.dark_orbs = gameData.dark_orbs.sub(getGottaBeFastCost())
        gameData.dark_matter_shop.gotta_be_fast = gameData.dark_matter_shop.gotta_be_fast.add(1)
    }
}

// Rewards
function getDarkOrbGeneration() {
    if (gameData.dark_matter_shop.dark_orb_generator == 0) return decimalZero

    const darkOrbiter = gameData.requirements["Dark Orbiter"].isCompleted() ? 1e10 : 1

    if (gameData.dark_matter_shop.dark_orb_generator.eq(0)) return decimalZero
    return Decimal.pow(100, gameData.dark_matter_shop.dark_orb_generator.sub(1)).times(darkOrbiter).min(getDarkOrbGenerationCap())
}

function getDarkOrbGenerationCap() {
    return new Decimal(Number.MAX_VALUE);
}

function getDarkOrbCap() {
    return new Decimal(Number.MAX_VALUE);
}

function getTaaAndMagicXpGain() {
    if (gameData.active_challenge == "the_darkest_time") return decimalOne

    return Decimal.pow(4, gameData.dark_matter_shop.a_deal_with_the_chairman)
}

function getAGiftFromGodEssenceGain() {
    if (gameData.active_challenge == "the_darkest_time") return decimalOne

    return Decimal.pow(2.1, gameData.dark_matter_shop.a_gift_from_god)
}

function getLifeCoachIncomeGain() {
    if (gameData.active_challenge == "the_darkest_time") return decimalOne

    return Decimal.pow(14, gameData.dark_matter_shop.life_coach)
}

function getGottaBeFastGain() {
    if (gameData.active_challenge == "the_darkest_time") return decimalOne

    return decimalOne.add(gameData.dark_matter_shop.gotta_be_fast.times(0.2))
}

function getAMiracleCost() {
    return 10
}

// Permanent unlocks
function canBuyAMiracle() {
    return getDarkMatter().gte(getAMiracleCost())
}

function buyAMiracle() {
    if (canBuyAMiracle()) {
        gameData.dark_matter_shop.a_miracle = true
        gameData.dark_matter_shop.continuum_unlock = true
        gameData.dark_matter = gameData.dark_matter.sub(getAMiracleCost())
    }
}


// Skill tree
function resetSkillTree() {
    if (gameData.dark_matter.lt(1e11) && confirm("Are you sure that you want to reset your Dark Matter Abilities?")
        || gameData.dark_matter.gte(1e11)) {
        gameData.dark_matter_shop.speed_is_life = 0
        gameData.dark_matter_shop.your_greatest_debt = 0
        gameData.dark_matter_shop.essence_collector = 0
        gameData.dark_matter_shop.explosion_of_the_universe = 0
        gameData.dark_matter_shop.multiverse_explorer = 0
        return true
    }
    return false
}

function buySpeedOfLife(number) {
    buyDarkMatterSkill("speed_is_life", 100, number)   
}

function buyYourGreatestDebt(number) {
    buyDarkMatterSkill("your_greatest_debt", 1000, number)    
}

function buyEssenceCollector(number) {
    buyDarkMatterSkill("essence_collector", 10000, number)
}

function buyExplosionOfTheUniverse(number) {
    buyDarkMatterSkill("explosion_of_the_universe", 100000, number)
}

function buyMultiverseExplorer(number) {
    buyDarkMatterSkill("multiverse_explorer", 100000000, number)
}

function buyDarkMatterSkill(skill_name, cost, number) {
    if (gameData.dark_matter.gte(cost)) {
        gameData.dark_matter = gameData.dark_matter.sub(cost)

        if (gameData.dark_matter_shop[skill_name] == 0)
            gameData.dark_matter_shop[skill_name] = number
        else if (gameData.dark_matter_shop[skill_name] == 1 && (number == 2 || number == 3))
            gameData.dark_matter_shop[skill_name] = 3
        else if (gameData.dark_matter_shop[skill_name] == 2 && (number == 1 || number == 3))
            gameData.dark_matter_shop[skill_name] = 3
        else
            gameData.dark_matter = gameData.dark_matter.add(cost)
    }
}

function getDarkMatterSkillIncome() {
    if (gameData.active_challenge == "the_darkest_time")
        return 0

    if (gameData.perks.positive_dark_mater_skills == 1)
        return 1

    let income = 1
    
    income *= [1, 3].includes(gameData.dark_matter_shop.your_greatest_debt) ? 0.1 : 1
    income *= [2, 3].includes(gameData.dark_matter_shop.your_greatest_debt) ? 0.5 : 1
    income *= [2, 3].includes(gameData.dark_matter_shop.essence_collector) ? 0.04 : 1
    income *= [2, 3].includes(gameData.dark_matter_shop.explosion_of_the_universe) ? 0.00001 : 1

    return income 

}

function getDarkMatterSkillTimeWarping() {
    if (gameData.active_challenge == "the_darkest_time")
        return 1

    let timewarping = 1

    timewarping *= [1, 3].includes(gameData.dark_matter_shop.speed_is_life) ? 3 : 1
    timewarping *= [2, 3].includes(gameData.dark_matter_shop.speed_is_life) ? 7 : 1
    timewarping *= [1, 3].includes(gameData.dark_matter_shop.multiverse_explorer) ?
        (gameData.perks.positive_dark_mater_skills == 1 ? 1 : 0.001) : 1

    return timewarping
}

function getDarkMatterSkillXP() {
    if (gameData.active_challenge == "the_darkest_time")
        return 1

    let xp = 1

    xp *= [1, 3].includes(gameData.dark_matter_shop.your_greatest_debt) ? 500 : 1
    xp *= [1, 3].includes(gameData.dark_matter_shop.explosion_of_the_universe) ? 1e100 : 1
    xp *= [2, 3].includes(gameData.dark_matter_shop.explosion_of_the_universe) ? 1e150 : 1

    return xp
}

function getDarkMatterSkillEssence() {
    if (gameData.active_challenge == "the_darkest_time")
        return 0.25

    let ess = 1

    ess *= (gameData.perks.positive_dark_mater_skills == 0 && [2, 3].includes(gameData.dark_matter_shop.speed_is_life)) ? 0.5 : 1
    ess *= (gameData.perks.positive_dark_mater_skills == 0 && [1, 3].includes(gameData.dark_matter_shop.explosion_of_the_universe)) ? 0.5 : 1

    ess *= [1, 3].includes(gameData.dark_matter_shop.essence_collector) ? 500 : 1
    ess *= [2, 3].includes(gameData.dark_matter_shop.essence_collector) ? 1000 : 1

    ess *= [1, 3].includes(gameData.dark_matter_shop.multiverse_explorer) ? 5000 : 1
    ess *= [2, 3].includes(gameData.dark_matter_shop.multiverse_explorer) ? 10000 : 1

    return ess
}

function getDarkMatterSkillEvil() {
    if (gameData.active_challenge == "the_darkest_time")
        return 0.25

    let evil = 1

    evil *= [2, 3].includes(gameData.dark_matter_shop.your_greatest_debt) ? 100 : 1
    evil *= (gameData.perks.positive_dark_mater_skills == 0 && [1, 3].includes(gameData.dark_matter_shop.speed_is_life)) ? 0.5 : 1
    evil *= (gameData.perks.positive_dark_mater_skills == 0 && [1, 3].includes(gameData.dark_matter_shop.essence_collector)) ? 0.5 : 1

    return evil
}
function getDarkMatterSkillDarkMater() {
    if (gameData.active_challenge == "the_darkest_time")
        return 1

    return (gameData.perks.positive_dark_mater_skills == 0 && [2, 3].includes(gameData.dark_matter_shop.multiverse_explorer)) ? 0.01 : 1
}