function enterChallenge(challengeName) {
    rebirthReset(false)
    gameData.active_challenge = challengeName
    gameData.rebirthOneTime = decimalZero
    gameData.rebirthTwoTime = decimalZero

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = decimalZero
    }
}

function exitChallenge() {
    setChallengeProgress()
    rebirthReset(false)
    gameData.active_challenge = ""
    gameData.rebirthOneTime = decimalZero
    gameData.rebirthTwoTime = decimalZero

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = decimalZero
    }
}

function setChallengeProgress() {
    if (gameData.active_challenge == "an_unhappy_life") {
        gameData.challenges.an_unhappy_life = Decimal.max(gameData.challenges.an_unhappy_life, getHappiness())
    }
    if (gameData.active_challenge == "rich_and_the_poor") {
        gameData.challenges.rich_and_the_poor = Decimal.max(gameData.challenges.rich_and_the_poor, getIncome())
    }
    if (gameData.active_challenge == "time_does_not_fly") {
        gameData.challenges.time_does_not_fly = Decimal.max(gameData.challenges.time_does_not_fly, getUnpausedGameSpeed().div(baseGameSpeed))
    }
    if (gameData.active_challenge == "dance_with_the_devil") {
        gameData.challenges.dance_with_the_devil = Decimal.max(gameData.challenges.dance_with_the_devil, getEvilGain().sub(10).max(0))
    }
    if (gameData.active_challenge == "legends_never_die") {
        gameData.challenges.legends_never_die = Decimal.max(gameData.challenges.legends_never_die, getChallengeTaskGoalProgress("Chairman"))
    }
    if (gameData.active_challenge == "the_darkest_time") {
        gameData.challenges.the_darkest_time = Decimal.max(gameData.challenges.the_darkest_time, getChallengeTaskGoalProgress("Sigma Proioxis").div(100))
    }
}

function getChallengeBonus(challenge_name, current = false) {
    if (challenge_name == "an_unhappy_life" || challenge_name == 1) {
        return softcap(Decimal.pow((current ? getHappiness() : gameData.challenges.an_unhappy_life).add(1), 0.31), 500, 0.45)
    }
    if (challenge_name == "rich_and_the_poor" || challenge_name == 2) {
        return softcap(Decimal.pow((current ? getIncome() : gameData.challenges.rich_and_the_poor).add(1), 0.25), 25, 0.55)
    }
    if (challenge_name == "time_does_not_fly" || challenge_name == 3) {
        return softcap(Decimal.pow((current ? getUnpausedGameSpeed().div(baseGameSpeed) : gameData.challenges.time_does_not_fly).add(1), 0.055), 2)
    }
    if (challenge_name == "dance_with_the_devil" || challenge_name == 4) {
        return softcap(Decimal.pow((current ? getEvilGain().sub(10).max(0) : gameData.challenges.dance_with_the_devil).add(1), 0.09), 2, 0.75)
    }
    if (challenge_name == "legends_never_die" || challenge_name == 5) {
        return softcap(Decimal.pow((current ? getChallengeTaskGoalProgress("Chairman") : gameData.challenges.legends_never_die).add(1), 0.85), 25, 0.6)
    }
    if (challenge_name == "the_darkest_time" || challenge_name == 6) {
        return softcap(Decimal.pow((current ? getChallengeTaskGoalProgress("Sigma Proioxis").div(100) : gameData.challenges.the_darkest_time).add(1), 0.85), 25, 0.6)
    }
}

function getChallengeGoal(challenge_name) {
    if (challenge_name == "an_unhappy_life" || challenge_name == 1) {
        return gameData.challenges.an_unhappy_life.add(1)
    }
    if (challenge_name == "rich_and_the_poor" || challenge_name == 2) {
        return gameData.challenges.rich_and_the_poor.add(1)
    }
    if (challenge_name == "time_does_not_fly" || challenge_name == 3) {
        return Decimal.max(1, gameData.challenges.time_does_not_fly.add(0.1))
    }
    if (challenge_name == "dance_with_the_devil" || challenge_name == 4) {
        return gameData.challenges.dance_with_the_devil.add(10.1)
    }
    if (challenge_name == "legends_never_die" || challenge_name == 5) {
        let goal = gameData.challenges.legends_never_die.add(1)
        return gameData.dark_matter_shop.continuum_unlock ? goal : Decimal.floor(goal)
    }
    if (challenge_name == "the_darkest_time" || challenge_name == 6) {
        let goal = gameData.challenges.the_darkest_time.add(1)
        return gameData.dark_matter_shop.continuum_unlock ? goal : Decimal.floor(goal)
    }
}