function emptyOrRows(rows) {
    if (!rows) {
        return []
    }
    return rows
}

function getDistanceTime(date) {
    let distance =  new Date().getTime() - date.getTime()

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} ngày`
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    if (hours > 0) return `${hours} giờ`
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    if (minutes > 0) return `${minutes} phút`

    return `Vừa mới`
}

function getAspect(aspect) {
    let newAspect = 0
    switch (aspect) {
        case 1:
            newAspect = 0
            break
        case 4 / 5:
            newAspect = 1
            break
        case 16 / 9:
            newAspect = 2
            break
        default:
        // code block
    }
    return newAspect
}

module.exports = {
    emptyOrRows,
    getAspect,
    getDistanceTime,
}
