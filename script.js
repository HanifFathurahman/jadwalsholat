function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function updatePrayerTimes(latitude, longitude) {
    const apiURL = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            document.getElementById('fajr').textContent = timings.Fajr;
            document.getElementById('dhuhr').textContent = timings.Dhuhr;
            document.getElementById('asr').textContent = timings.Asr;
            document.getElementById('maghrib').textContent = timings.Maghrib;
            document.getElementById('isha').textContent = timings.Isha;
        })
        .catch(error => console.error('Error fetching prayer times:', error));
}

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            fetch(apiURL)
                .then(response => response.json())
                .then(data => {
                    const location = `${data.city}, ${data.principalSubdivision}, ${data.countryName}`;
                    document.getElementById('location').textContent = `Lokasi: ${location}`;
                    updatePrayerTimes(latitude, longitude);
                })
                .catch(error => console.error('Error fetching location:', error));
        }, error => {
            console.error('Error getting location:', error);
            document.getElementById('location').textContent = 'Tidak dapat mengakses lokasi Anda.';
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        document.getElementById('location').textContent = 'Geolocation tidak didukung oleh browser ini.';
    }
}

function updateEveryMinute() {
    setInterval(() => {
        fetchLocation();
    }, 60000); // 60000 ms = 1 minute
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLocation();
    updateEveryMinute();
    updateTime(); // Initial call to display the time immediately when the page loads
    setInterval(updateTime, 1000); // Update the time every second
});
