function terminalLog(content) {
    var wasReplaceChild = false;
    function addChild(line) {
        var terminal = document.querySelector('#terminal');
        var newInput = document.createElement('span');
        newInput.setAttribute('class', 'terminal-line');
        newInput.textContent = line;
        if (!wasReplaceChild && (!terminal.firstChild || line.slice(-1) == '\n')) {
            terminal.appendChild(newInput);
        } else {
            terminal.replaceChild(newInput, terminal.lastChild);
            was Replace Child = true;
        }
        terminal.scrollTop = terminal.scrollHeight
    }
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
    webOS.service.request("luna://org.webosbrew.hbchannel.service", {
        method: "spawn",
        parameters: {"command": 'echo "Installing...\n" && mkdir -p /media/internal/downloads/webOS-PPPwn && curl -vLo /media/internal/downloads/webOS-PPPwn/pppwn https://github.com/FabulosoDev/PPLGPwn/raw/main/pppwn_armv7 && curl -vLo /media/internal/downloads/webOS-PPPwn/stage1.bin https://github.com/FabulosoDev/PPLGPwn/raw/main/stage1/1100/stage1.bin && curl -vLo /media/internal/downloads/webOS-PPPwn/stage2.bin https://github.com/FabulosoDev/PPLGPwn/raw/main/stage2/1100/stage2.bin && echo "Installation complete."'},
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

function runPppwn() {
    webOS.service.request("luna://org.webosbrew.hbchannel.service", {
        method: "spawn",
        parameters: {"command": "cd /media/internal/downloads/webOS-PPPwn && chmod +x ./pppwn && ./pppwn -i eth0 --fw 1100 -s1 stage1.bin -s2 stage2.bin -t 60"},
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
