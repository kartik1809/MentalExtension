chrome.runtime.onInstalled.addListener(() => {
    console.log('MindMap Tracker installed');
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        const allowedDomains = [
            'www.youtube.com',
            'www.x.com',
            'www.instagram.com',
        ];
        const url = new URL(tab.url);
        const domain = url.hostname;

        if (allowedDomains.includes(domain)) {
            console.log('Allowed domain:', domain);
            
            chrome.storage.local.get(['content', 'timeSpent'], function (result) {
                if(result.timeSpent === undefined) {
                    result.timeSpent = 1;
                }

                sendDataToBackend(result.content, result.timeSpent);
                console.log('Data sent to backend:', result.content, result.timeSpent);

            });
        } else {
            console.log('Domain not allowed:', domain);
        }
    }
});

function sendDataToBackend(content, timeSpent) {
    const data = {
        content,
        timeSpent: timeSpent / 1000
    };

    console.log('Sending data to backend:', data);

    fetch('https://mentalextensionbackend.onrender.com/trackData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log('Data sent to backend:', data))
        .catch(error => console.error('Error sending data:', error));
}
