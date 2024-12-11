document.addEventListener('DOMContentLoaded', () => {
    const timeElement = document.getElementById('time-input');
    const saveButton = document.getElementById('save-btn');
    const toggledark = document.getElementById('theme-toggle');
    const audioSelect = document.getElementById('audio-select');
    const playBtn = document.getElementById('play-btn');
    const notificationSound = document.getElementById('notification-sound');

    // Load the saved values from storage
    chrome.storage.sync.get(['notificationTime', 'selectedAudio', 'darkmode'], (data) => {
        timeElement.value = data.notificationTime ?? 60;
        audioSelect.value = data.selectedAudio ?? 'mute';
        notificationSound.src = data.selectedAudio !== 'mute' ? data.selectedAudio : '';
        const isDarkMode = data.darkmode ?? false;
        document.body.classList.toggle('dark-mode', isDarkMode);
        toggledark.textContent = isDarkMode ? '☀️' : '🌙';
    });

    // Save the values to storage when the save button is clicked
    saveButton.addEventListener('click', () => {
        const notificationTime = timeElement.value;
        const selectedAudio = audioSelect.value;
        chrome.storage.sync.set({
            notificationTime,
            selectedAudio,
        }, () => {
            console.log('Options saved');
        });
    });

    // Play the selected sound when the play button is clicked
    playBtn.addEventListener('click', () => {
        const selectedAudio = audioSelect.value;
        console.log(selectedAudio);
        if (selectedAudio !== 'mute') {
            notificationSound.src = selectedAudio;
            notificationSound.play();
        }
    });

    // Toggle dark mode
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

    // Listen for changes in storage and update the inputs
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
            if (changes.notificationTime) {
                timeElement.value = changes.notificationTime.newValue;
            }
            if (changes.selectedAudio) {
                audioSelect.value = changes.selectedAudio.newValue;
                notificationSound.src = changes.selectedAudio.newValue !== 'mute' ? changes.selectedAudio.newValue : '';
            }
            if (changes.darkmode) {
                const isDarkMode = changes.darkmode.newValue;
                document.body.classList.toggle('dark-mode', isDarkMode);
                toggledark.textContent = isDarkMode ? '☀️' : '🌙';
            }
        }
    });

    // Have the notification sound play when function sendMessage is called from background.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'playSound') {
            const selectedAudio = audioSelect.value;
            if (selectedAudio !== 'mute') {
                notificationSound.src = selectedAudio;
                notificationSound.play();
            }
        }
    });
});


