var deviceInfo;
webOS.deviceInfo(function (info) {
    deviceInfo = info;
});

function appendTerminalLine(content) {
    var terminal = document.querySelector('#terminal');
    var newInput = document.createElement('span');
    newInput.setAttribute('class', 'terminal-line');
    newInput.textContent = content;
    terminal.appendChild(newInput);
    terminal.scrollTo({
        top: terminal.scrollHeight,
        behavior: 'smooth'
    });
}

function Init() {
    webOS.fetchAppInfo(function (info) {
        if (info) {
            document.getElementById("appVersion").innerHTML = info.version;
        } else {
            console.error('Error occurs while getting appinfo.json.');
        }
    });
    
    document.getElementById('installButton').addEventListener('click', function() {
        appendTerminalLine('echo "Install button clicked"');

        webOS.service.request("luna://com.webos.notification", {
	    method: "createToast",
	    parameters: {"sourceId":"webosbrew","message": "<b>PPLGPwn</b><br/>Starting your Jailbreak."}',
	});
	    
        webOS.service.request("luna://org.webosbrew.hbchannel.service", {
	    method: "exec",
	    parameters: {"command": "cd /media/internal/downloads/PPLGPwn && chmod +x ./run.sh && ./run.sh"},
	    onSuccess: function (response) {
	        appendTerminalLine(response.stdoutString);
		appendTerminalLine("PPPwn installing...");
	    },
	    onFailure: function (error) {
		appendTerminalLine("Failed to install PPPwn!");
		appendTerminalLine("[" + error.errorCode + "]: " + error.errorText);
		return;
	    }
	});
    });
      
    document.getElementById('runButton').addEventListener('click', function() {
        appendTerminalLine('echo "Run button clicked"');
    });
      
    document.getElementById('clearButton').addEventListener('click', function() {
        var termynal = document.querySelector('#terminal');
        termynal.innerHTML = '';
    });
}
