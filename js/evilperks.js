function getEvilPerksGeneration()
{
	if (gameData.evil.eq(0)) return decimalZero
	let essence_perk_buff_mult = new Decimal(1e9)
	if (gameData.essence.eq(0))
		essence_perk_buff_mult = new Decimal(10)

	essence_perk_buff_mult = essence_perk_buff_mult.times(gameData.essence.max(1));

	return Decimal.log10(gameData.evil.add(1)).times(Decimal.log10(essence_perk_buff_mult).div(365))
}

function getEyeRequirement(){
	let newreq = Decimal.sub(65, gameData.evil_perks.reduce_eye_requirement.times(5))
	return newreq.max(15)
}

function getEvilRequirement(){
	let newreq = Decimal.sub(200, gameData.evil_perks.reduce_evil_requirement.times(12.5))
	return newreq.max(25).max(getEyeRequirement())
}

function getVoidRequirement(){
	let newreq = Decimal.sub(1000, gameData.evil_perks.reduce_the_void_requirement.times(100))
	return newreq.max(100).max(getEvilRequirement())
}

function getCelestialRequirement(){
	let newreq = Decimal.sub(10000, gameData.evil_perks.reduce_celestial_requirement.times(1000))
	return newreq.max(1000)
}

function getEssenceReward(){	
	return getEssenceRewardPercent().div(100).times(gameData.essence)
}

function getEssenceRewardPercent(){	
	return (gameData.evil_perks.receive_essence.add(1)).times(10)
}

function getEvilPerkCost(evilperknum){
	switch (evilperknum){
	case 1:
		if (gameData.evil_perks.reduce_eye_requirement == 10)
			return Infinity
		return Decimal.pow(2, gameData.evil_perks.reduce_eye_requirement.add(1)).add(4.66)
	case 2:
		if (gameData.evil_perks.reduce_evil_requirement == 14)
			return Infinity
		return Decimal.pow(3, gameData.evil_perks.reduce_evil_requirement.add(1)).add(66.66-3)
	case 3: 
		if (gameData.evil_perks.reduce_the_void_requirement == 9)
			return Infinity
		return Decimal.pow(5, gameData.evil_perks.reduce_the_void_requirement.add(1)).add(666.66-5)
	case 4:
		if (gameData.evil_perks.reduce_celestial_requirement == 9)
			return Infinity
		return Decimal.pow(5, gameData.evil_perks.reduce_celestial_requirement.add(1)).add(6666-5)
	case 5:
		return Decimal.pow(10, gameData.evil_perks.receive_essence).times(6.66e9)
	}	
}

function buyEvilPerk(evilperknum){
	switch (evilperknum){
		case 1:
			if (gameData.evil_perks_points.gte(getEvilPerkCost(1)))
			{
				gameData.evil_perks_points = gameData.evil_perks_points.sub(getEvilPerkCost(1))
				gameData.evil_perks.reduce_eye_requirement = gameData.evil_perks.reduce_eye_requirement.add(1)
			}
			break;
		case 2:
			if (gameData.evil_perks_points.gte(getEvilPerkCost(2)))
			{
				gameData.evil_perks_points = gameData.evil_perks_points.sub(getEvilPerkCost(2))
				gameData.evil_perks.reduce_evil_requirement = gameData.evil_perks.reduce_evil_requirement.add(1)
			}
			break;
		case 3:
			if (gameData.evil_perks_points.gte(getEvilPerkCost(3)))
			{
				gameData.evil_perks_points = gameData.evil_perks_points.sub(getEvilPerkCost(3))
				gameData.evil_perks.reduce_the_void_requirement = gameData.evil_perks.reduce_the_void_requirement.add(1)
			}
			break;
		case 4:
			if (gameData.evil_perks_points.gte(getEvilPerkCost(4)))
			{
				gameData.evil_perks_points = gameData.evil_perks_points.sub(getEvilPerkCost(4))
				gameData.evil_perks.reduce_celestial_requirement = gameData.evil_perks.reduce_celestial_requirement.add(1)
			}
			break;
		case 5:
			if (gameData.evil_perks_points.gte(getEvilPerkCost(5)))
			{
				gameData.evil_perks_points = gameData.evil_perks_points.sub(getEvilPerkCost(5))
				gameData.evil_perks.receive_essence = gameData.evil_perks.receive_essence.add(1)
				gameData.essence = gameData.essence.add(getEssenceReward())
			}
			break;
	}
}

function hasEvilPerk(i)
{
	switch(i){
		case 1: return gameData.evil_perks.reduce_eye_requirement.gt(0)
		case 2: return gameData.evil_perks.reduce_evil_requirement.gt(0)
		case 3: return gameData.evil_perks.reduce_the_void_requirement.gt(0)
		case 4: return gameData.evil_perks.reduce_celestial_requirement.gt(0)
		case 5: return gameData.evil_perks.receive_essence.gt(0)
		default: throw new Error("Invalid evil perk ID: " + i)
	}
}

function getAge0Requirement(){
	const eyeReq = getEyeRequirement()

	// A visualization of this formula can be found at: https://www.desmos.com/calculator/belx2gh0fd
	if (eyeReq.lt(3)) {
		return eyeReq.div(3)
	} else if (eyeReq.lt(15)) {
		return eyeReq.sub(2)
	} else if (eyeReq.lt(20)) {
		return eyeReq.times(3/5).add(4)
	} else if (eyeReq.lt(30)) {
		return eyeReq.times(2/5).add(8)
	} else if (eyeReq.lt(35)) {
		return new Decimal(20)
	} else if (eyeReq.lt(40)) {
		return eyeReq.sub(15)
	} else if (eyeReq.lt(65)) {
		return new Decimal(25)
	} else {
		return eyeReq.sub(5).div(3).add(5)
	}
}

function getAge1Requirement(){
	const eyeReq = getEyeRequirement()

	// A visualization of this formula can be found at: https://www.desmos.com/calculator/belx2gh0fd
	if (eyeReq.lt(3)) {
		return eyeReq.times(2/3)
	} else if (eyeReq.lt(15)) {
		return eyeReq.sub(1)
	} else if (eyeReq.lt(20)) {
		return eyeReq.times(4/5).add(2)
	} else if (eyeReq.lt(25)) {
		return eyeReq.times(2/5).add(10)
	} else if (eyeReq.lt(50)) {
		return eyeReq.sub(5)
	} else if (eyeReq.lt(65)) {
		return new Decimal(45)
	} else {
		return eyeReq.times(2).sub(10).div(3).add(5)
	}
}