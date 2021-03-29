function sortDate(chirps) {
    chirps.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    })
}

export default sortDate;