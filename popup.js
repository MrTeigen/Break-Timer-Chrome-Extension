document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('timer');

    function updateTimer() {
        chrome.storage.local.get(['timer'], (data) => {
            const time = data.timer ?? 0;
            if (time >= 3600) {
                const hours = Math.floor(time / 3600);
                const minutes = Math.floor((time % 3600) / 60);
                const seconds = time % 60;
                timerElement.textContent = 'Timer: ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
                return;
            } else if (time >= 60) {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                timerElement.textContent = 'Timer: ' + minutes + 'm ' + seconds + 's';
                return;
            } else if (time > 0) {
                timerElement.textContent = 'Timer: ' + time + 's';
                return;
            }
            timerElement.textContent = 'Timer: 0s';
        });
    };

    updateTimer();
    setInterval(updateTimer, 1000);

    console.log(this);

    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    const resetBtn = document.getElementById('reset');
    const toggledark = document.getElementById('theme-toggle');

    toggledark.addEventListener('click', () => {
        chrome.storage.sync.get(['darkmode'], (data) => {
            const isDarkMode = data.darkmode ?? false;
            const newDarkMode = !isDarkMode;
            chrome.storage.sync.set({ darkmode: newDarkMode }, () => {
                document.body.classList.toggle('dark-mode', newDarkMode);
                toggledark.textContent = newDarkMode ? '☀️' : '🌙';
            });
        });
    });

    chrome.storage.sync.get(['darkmode'], (data) => {
        const isDarkMode = data.darkmode ?? false;
        document.body.classList.toggle('dark-mode', isDarkMode);
        toggledark.textContent = isDarkMode ? '☀️' : '🌙';
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.darkmode) {
            const isDarkMode = changes.darkmode.newValue;
            document.body.classList.toggle('dark-mode', isDarkMode);
            toggledark.textContent = isDarkMode ? '☀️' : '🌙';
        }
    });

    startBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            isRunning: true,
        });
    });

    stopBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            isRunning: false,
        });
    });

    resetBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            timer: 0,
            isRunning: false,
        });
    });

    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
});