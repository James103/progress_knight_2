class Task {
    constructor(baseData) {
        this.baseData = baseData
        this.name = baseData.name
        this.level = decimalZero
        this.continuumLevel = decimalZero
        this.maxLevel = decimalZero
        this.xp = decimalZero
        this.isHero = false
        this.isFinished = false
        this.unlocked = false

        this.xpMultipliers = []

        this.elementsCache = {}
    }

    toJSON() {
        return {
            baseData: this.baseData,
            name: this.name,
            level: this.level,
            continuumLevel: this.continuumLevel,
            maxLevel: this.maxLevel,
            xp: this.xp,
            isHero: this.isHero,
            isFinished: this.isFinished,
            unlocked: this.unlocked
        }
    }

    getMaxXp() {
        let maxXp = new Decimal(this.baseData.maxXp).times(Decimal.add(this.level, 1));
        if (this.isHero)
            maxXp = maxXp.times(Decimal.pow10(this.baseData.heroxp)).times(Decimal.pow(1.08, this.level));
        else
            maxXp = maxXp.times(Decimal.pow(1.01, this.level));
        
        // Cap max XP at 1.798e308, but add further scaling past this value
        if (maxXp.gt(Number.MAX_VALUE)) {
            maxXp = new Decimal(Number.MAX_VALUE).times(Decimal.pow(2, this.level.div(120))).times(Decimal.pow(2, Decimal.div(this.baseData.heroxp, 9)))
        }

        if (!Decimal.isFinite(maxXp)) {
            console.log("Invalid max XP value: " + maxXp);
            throw new Error("NaN/inf detected in getMaxXp for task " + (this.isHero ? "Great " : " ") + task.name + " level " + task.level);
        }

        return maxXp
    }
    
    getContinuumLevel() {
        /*
         * Max XP formula (before Heroes):
         * Y = A * (X + 1) * (1.01^X)
         * 
         * Max XP formula (after Heroes but before 1.798e308 XP):
         * Y = A * 10^B * (X + 1) * (1.08^X)
         * 
         * Max XP formula (after 1.798e308 XP):
         * Y = 2^1024 * 2^(X/120) * 2^(B/9)
         * Y = 2^(1024 + X/120 + B/9)
         * 
         * Inverse of the Max XP formula (before Heroes):
         * X = ProductLog[Y/A * 1.01 * Log[1.01]]/Log[1.01]
         * X ≈ 100.49917080713044 * ProductLog[0.010049834161699772 * Y / A]
         * 
         * Inverse of the Max XP formula (after Heroes but before 1.798e308 XP):
         * X = ProductLog[Y/(A * 10^B) * 1.08 * Log[1.08]]/Log[1.08]
         * X ≈ 12.993587212927691 * ProductLog[0.08311792442701867 * Y / (A * 10^B)]
         * 
         * Inverse of the Max XP formula (after 1.798e308 XP):
         * X = 40 ((B + 9216) (-Log[2]) + 9 Log[Y]) / Log[8]
         * X ≈ 19.235933878519514 * (-0.6931471805599453 * (9216 + B) + 9 * Log[Y])
         *
         * Where:
         * Y = this.getMaxXP() output
         * X = this.level
         * A = this.baseData.maxXp
         * B = this.baseData.heroxp
         * ProductLog is the lambert W function
         * Log is the natural logarithm
         * Inverse formulas computed with Mathematica
         */
        let baseContinuumLevel = decimalZero
        if (this.isHero)
            baseContinuumLevel = this.xp.div(Decimal.pow10(this.baseData.heroxp).times(this.baseData.maxXp)).times(0.08311792442701867).lambertw().times(12.993587212927691)
        else
            baseContinuumLevel = this.xp.div(this.baseData.maxXp).times(0.010049834161699772).lambertw().times(100.49917080713044)
        
        let scaledContinuumLevel = this.xp.ln().times(9).add(Decimal.add(9216, this.baseData.heroxp).times(-0.6931471805599453)).times(19.235933878519514)
        
        return baseContinuumLevel.max(scaledContinuumLevel).max(0)
    }
    
    getLevel() {
        if (gameData.dark_matter_shop.continuum_unlock)
            return this.continuumLevel
        else
            return this.level
    }

    getXpLeft() {
        return this.getMaxXp().sub(this.xp)
    }

    getMaxLevelMultiplier() {
        if (gameData.active_challenge == "dance_with_the_devil" || gameData.active_challenge == "the_darkest_time") {
            return Decimal.div(10, Decimal.add(this.maxLevel, 1));
        }
        else {
            let effect = gameData.taskData['Cosmic Recollection'].getEffect();
            if (Decimal.eq(effect, 0))
                effect = decimalOne
            return (this.baseData.heroxp < 1000) ? Decimal.div(this.maxLevel, 10).add(1) : Decimal.div(this.maxLevel, effect).add(1);
        }
    }

    getXpGain() {
        let ret = decimalOne;
        
        if (this.isHero)
            ret = ret.times(getHeroXpGainMultipliers(this));
        
        ret = ret.times(applyMultipliers(10, this.xpMultipliers));
        
        return ret;
    }

    getXpGainFormatted() {
        return format(this.getXpGain())
    }

    getXpLeftFormatted() {
        if (gameData.dark_matter_shop.continuum_unlock)
            return format(this.xp)
        else
            return format(this.getXpLeft())
    }

    increaseXp() {
        if (this.isFinished) {
            return;
        }
        
        if (gameData.dark_matter_shop.continuum_unlock) {
            this.xp = this.xp.add(applySpeed(this.getXpGain()))
            this.continuumLevel = this.getContinuumLevel()
            this.level = this.continuumLevel.floor()
            this.unlocked = true
            if (!Decimal.isFinite(this.level)) {
                console.log("Invalid task level value: " + task.level);
                throw new Error("NaN/inf detected in task level for task " + (this.isHero ? "Great " : " ") + task.name + " level " + task.level);
            }
            return;
        }
        
        this.xp = this.xp.add(applySpeed(this.getXpGain()))
        
        if (this.xp.gt(this.getMaxXp())) {
            let excess = this.xp.sub(this.getMaxXp())
            let levelsGained = 0
            // Don't level up a hero or skill more than 100 times per tick.
            // Working with Decimals is much slower than working with Numbers and uncapping this without further optimizations may cause huge lag spikes.
            // To level things up faster, use the continuum mechanic which is unlocked at 10 Dark Matter.
            while (excess.gte(0) && levelsGained < 100) {
                this.level = this.level.round().add(1);
                levelsGained++
                this.unlocked = true
                excess = excess.sub(this.getMaxXp());
            }
            this.xp = this.getMaxXp().add(excess).min(this.getMaxXp());
        }
    }

    querySelector(selector, row) {
        const cachedElement = this.elementsCache[selector]

        if (cachedElement !== undefined)
            return cachedElement

        const element = row.querySelector(selector)
        this.elementsCache[selector] = element
        return element
    }

}

class Milestone {
    constructor(baseData) {
        this.baseData = baseData
        this.name = baseData.name
        this.tier = baseData.tier
        this.expense = baseData.expense
        this.description = baseData.description
        this.unlocked = false
    }

    getTier() { return this.tier }
}

class Job extends Task {
    constructor(baseData) {
        super(baseData)
        this.incomeMultipliers = []
    }

    getLevelMultiplier() {
        return Decimal.add(this.getLevel(), 1).log10().add(1)
    }

    getIncome() {
        let income = decimalOne;
        
        income = income.times(applyMultipliers(this.baseData.income, this.incomeMultipliers));
        income = income.times(getChallengeBonus("rich_and_the_poor"));
        if (this.isHero) {
            income = income.times(heroIncomeMult).times(this.baseData.heroxp > 78 ? 1e6 : 1).times(this.baseData.heroxp > 130 ? 1e5 : 1);
        }
        if (gameData.active_challenge == "rich_and_the_poor" || gameData.active_challenge == "the_darkest_time") {
            income = Decimal.pow(income, 0.35);
        }

        return income
    }
}

class Skill extends Task {
    constructor(baseData) {
        super(baseData)
    }

    getEffect() {
        let effectiveLevel = new Decimal(this.getLevel());
        if (this.isHero) {
            effectiveLevel = effectiveLevel.times(1000).add(8000);
        }
        
        let effect = effectiveLevel.times(this.baseData.effect).add(1);
        return effect
    }

    getEffectDescription() {
        return "x" + format(this.getEffect(), 2) + " " + this.baseData.description
    }
}

class Item {
    constructor(baseData) {
        this.baseData = baseData
        this.name = baseData.name
        this.expenseMultipliers = []
        this.isHero = false
        this.unlocked = false
    }

    getEffect() {
        let effect = new Decimal(this.baseData.effect);

        if (this.isHero) {
            if (itemCategories["Misc"].includes(this.name))
            {
                if (gameData.currentMisc.includes(this)) {
                    effect = effect.times(this.baseData.heroeffect)
                    this.unlocked = true
                }
            }

            if (itemCategories["Properties"].includes(this.name)) {
                if (gameData.currentProperty == this) {
                    effect = this.baseData.heroeffect
                    this.unlocked = true
                }
                else
                    effect = decimalOne
            }
        } else {
            if (gameData.currentProperty != this && !gameData.currentMisc.includes(this))
                return decimalOne
            else
                this.unlocked = true
        }

        return effect
    }

    getEffectDescription() {
        let description = this.baseData.description
        let effect = new Decimal(this.baseData.effect)

        if (this.isHero) {
            if (itemCategories["Misc"].includes(this.name)) {
                effect = effect.times(this.baseData.heroeffect)
            }

            if (itemCategories["Properties"].includes(this.name)) {
                description = "Happiness"
                effect = new Decimal(this.baseData.heroeffect)
            }
        }
        else {
            if (itemCategories["Properties"].includes(this.name)) description = "Happiness"
        }

        return "x" + format(effect) + " " + description
    }

    getExpense(heroic) {
        let expense = applyMultipliers(this.baseData.expense, this.expenseMultipliers);

        if (heroic === undefined)
            heroic = this.isHero
        
        if (heroic) {
            expense = expense.times(heroIncomeMult).times(4).times(Decimal.pow(10, this.baseData.heromult));
        }
        
        return expense;
    }
}

class Requirement {
    constructor(querySelectors, requirements) {
        this.querySelectors = querySelectors
        this.elements = []
        this.requirements = requirements
        this.completed = false
    }

    queryElements() {
        this.querySelectors.forEach(querySelector => {
            this.elements.push(...document.querySelectorAll(querySelector))
        })
    }

    isCompleted() {
        if (this.completed) return true
        for (const requirement of this.requirements) {
            if (!this.getCondition(false, requirement)) {
                return false
            }
        }
        this.completed = true
        return true
    }

    isCompletedActual(isHero = false) {
        for (const requirement of this.requirements) {
            if (!this.getCondition(isHero, requirement)) {
                return false
            }
        }
        return true
    }
}

class TaskRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "task"
    }

    getCondition(isHero, requirement) {
        if (isHero && requirement.herequirement != null)
            return Decimal.gte(gameData.taskData[requirement.task].level, requirement.herequirement)
        else if (gameData.taskData[requirement.task].isHero && requirement.isHero)
            return true
        else
            return Decimal.gte(gameData.taskData[requirement.task].level, requirement.requirement)
    }
}

class CoinRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "coins"
    }

    getCondition(isHero, requirement) {
        return gameData.coins.gte(requirement.requirement)
    }
}

class AgeRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "age"
    }

    getCondition(isHero, requirement) {
        return daysToYears(gameData.days).gte(requirement.requirement)
    }
}

class EvilRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "evil"
    }

    getCondition(isHero, requirement) {
        return gameData.evil.gte(requirement.requirement)
    }
}

class EssenceRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "essence"
    }

    getCondition(isHero, requirement) {
        //return gameData.essence >= requirement.requirement

        if (isHero && requirement.herequirement != null)
            return gameData.essence.gte(requirement.herequirement)
        else
            return gameData.essence.gte(requirement.requirement)

    }
}

class DarkMatterRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "darkMatter"
    }

    getCondition(isHero, requirement) {
        return gameData.dark_matter.gte(requirement.requirement)
    }
}

class DarkOrbsRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "darkOrb"
    }

    getCondition(isHero, requirement) {
        return gameData.dark_orbs.gte(requirement.requirement)
    }
}

class MetaverseRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "metaverse"
    }

    getCondition(isHero, requirement) {
        return gameData.rebirthFiveCount.gte(requirement.requirement)
    }
}

class HypercubeRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "hypercube"
    }

    getCondition(isHero, requirement) {
        return gameData.hypercubes.gte(requirement.requirement)
    }
}

class PerkPointRequirement extends Requirement {
    constructor(querySelectors, requirements) {
        super(querySelectors, requirements)
        this.type = "perkpoint"
    }

    getCondition(isHero, requirement) {
        return gameData.perks_points.gte(requirement.requirement)
    }
}