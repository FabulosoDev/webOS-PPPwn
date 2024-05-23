function terminalLog(content) {
    function addChild(line) {
        var terminal = document.querySelector('#terminal');
        var newInput = document.createElement('span');
        newInput.setAttribute('class', 'terminal-line');
        newInput.textContent = line;
        if (line.slice(-1) == '\n' || !terminal.lastChild) {
            terminal.appendChild(newInput);
        } else {
            terminal.replaceChild(newInput, terminal.lastChild);
        }
        //terminal.scrollTo({
        //    top: terminal.scrollHeight,
        //    behavior: 'smooth'
        //});
    }
    //addChild(content);
    var lf = content.indexOf("\n");
    if (lf > -1 && lf < content.length -1) {
        var lines = content.split("\n");
        for (i = 0; i < lines.length; i++) {
            if (!!lines[i]) {
                addChild(lines[i] + "\n");
            }
        }
    } else if (!!content) {
        addChild(content);
    }
}

function installPppwn() {
    console.log('echo "Install button clicked"');
    terminalLog('echo "Install button clicked"');
}

function runPppwn() {
    terminalLog('Starting PPPwn...\n');
    
    webOS.service.request("luna://org.webosbrew.hbchannel.service", {
        method: "spawn",
        parameters: {"command": "cd /media/internal/downloads/PPLGPwn && chmod +x ./run.sh && ./run.sh"},
        onSuccess: function (response) {
            switch(response.event) {
                case "stdoutData":
                    terminalLog(response.stdoutString);
                    console.log(response.stdoutString);
                    break;
            }            
        },
        onFailure: function (error) {
            terminalLog(error);
            console.log(error);
            return;
        },
        subscribe: true,
        resubscribe: true
    });
}

function clearLog() {
    document.querySelector('#terminal').innerHTML = '';
}

webOS.fetchAppInfo(function (info) {
    if (info) {
        document.getElementById("version").innerHTML = info.version;
    } else {
        console.error('Error occurs while getting appinfo.json.');
    }
});
