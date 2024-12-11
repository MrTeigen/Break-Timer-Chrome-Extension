console.log("Hello from background.js");
console.log(this);

chrome.alarms.create('myAlarm', {
    periodInMinutes: 1/60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm);
    chrome.storage.local.get(['timer', 'isRunning'], (data) => {
        if (!data.isRunning) {
            if (data.timer == 0) {
                chrome.action.setBadgeText({
                    text: '',
                });
            }
            return;
        }
        const time = data.timer ?? 0;
        chrome.storage.local.set({
            timer: time + 1,
        });
        if (time >= 3600) {
            const hours = Math.floor(time / 3600);
            chrome.action.setBadgeText({
                text: hours + 'h',
            });
        } else if (time >= 60) {
            const minutes = Math.floor(time / 60);
            chrome.action.setBadgeText({
                text: minutes + 'm',
            });
        } else if (time > 0) {
            chrome.action.setBadgeText({
                text: time + 's',
            });
        }
        chrome.storage.sync.get(['notificationTime'], (data) => {
            const notificationTime = data.notificationTime ?? 60;

            const sendMessage = () => {
                chrome.runtime.sendMessage({ action: 'playSound' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError.message);
                        // Handle the error, e.g., log it or take some other action
                    } else {
                        console.log('Response from options page:', response.status);
                    }
                });
            };

            if ((time % notificationTime === 0) && (3600 / time === 1)) {
                this.registration.showNotification('Timer', {
                    body: `${Math.floor(time / 3600)} hour has passed.`,
                    icon: 'icon.png',
                });
                sendMessage('playSound');
            } else if ((time % 3600 === 0) && (time % notificationTime === 0) && (time !== 0)) {
                this.registration.showNotification('Timer', {
                    body: `${Math.floor(time / 3600)} hours have passed.`,
                    icon: 'icon.png',
                });
                sendMessage('playSound');
            
            } else if ((time > 3600) && (time % (notificationTime * 60) === 0)) {
                this.registration.showNotification('Timer', {
                    body: `${Math.floor(time / 3600)} hours and ${Math.floor((time % 3600) / 60)} minutes have passed.`,
                    icon: 'icon.png',
                });
                sendMessage('playSound');

            } else if ((notificationTime === 1) && (time === 60)) {
                this.registration.showNotification('Timer', {
                    body: `${Math.floor(time / 60)} minute has passed.`,
                    icon: 'icon.png',
                });
                sendMessage('playSound');
            } else if ((time % (notificationTime * 60) === 0) && (time !== 0)) {
                this.registration.showNotification('Timer', {
                    body: `${Math.floor(time / 60)} minutes have passed.`,
                    icon: 'icon.png',
                });
                sendMessage('playSound');
                console.log("notificationTime: " + notificationTime + "time: " + time);
            }
        });
    });
});

