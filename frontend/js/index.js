var cpuArch;

var installPppwnScript = 
'echo "Installing..."\n' +
'mkdir -p /media/internal/downloads/webOS-PPPwn\n' +
'curl -fsSLo /media/internal/downloads/webOS-PPPwn/pppwn https://github.com/FabulosoDev/webOS-PPPwn/raw/develop/pppwn/pppwn_' + cpuArch + '\n' +
'curl -fsSLo /media/internal/downloads/webOS-PPPwn/stage1.bin https://github.com/FabulosoDev/webOS-PPPwn/raw/develop/pppwn/stage1/1100/stage1.bin\n' +
'curl -fsSLo /media/internal/downloads/webOS-PPPwn/stage2.bin https://github.com/FabulosoDev/webOS-PPPwn/raw/develop/pppwn/stage2/1100/stage2.bin\n' +
'echo "Installation complete."';

var runPppwnScript = 
'cd /media/internal/downloads/webOS-PPPwn\n' +
'chmod +x ./pppwn\n' +
'./pppwn -i eth0 --fw 1100 --stage1 stage1.bin --stage2 stage2.bin';

function terminalLog(content) {
    function addChild(line) {
        var terminal = document.querySelector('#terminal');
        var newInput = document.createElement('span');
        newInput.setAttribute('class', 'terminal-line');
        newInput.textContent = line;
        if (!terminal.firstChild || line.slice(-1) == '\n') {
            terminal.appendChild(newInput);
        } else {
            terminal.replaceChild(newInput, terminal.lastChild);
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

function init() {
    webOS.fetchAppInfo(function (info) {
        if (info) {
            document.getElementById("version").innerHTML = info.version;
        } else {
            console.error('Error occurs while getting appinfo.json.');
        }
    });

    webOS.service.request("luna://org.webosbrew.hbchannel.service", {
        method: "exec",
        parameters: {"command": "uname -m"},
        onSuccess: function (response) {
            terminalLog(response.stdoutString);
            console.log(response.stdoutString);

            switch (response.stdoutString) {
                case "armv7":
                case "armv7l":
                    cpuArch = "armv7";
                    break;
                case "aarch64":
                    cpuArch = "aarch64";
                    break;            
                default:
                    cpuArch = "armv7";
                    break;
            }    
            document.getElementById("cpuArch").innerHTML = cpuArch;
        },
        onFailure: function (error) {
            terminalLog(error);
            console.log(error);
        }
    });
}

function installPppwn() {
    if (!!cpuArch) {
        webOS.service.request("luna://org.webosbrew.hbchannel.service", {
            method: "spawn",
            parameters: {"command": installPppwnScript},
            onSuccess: function (response) {
                switch(response.event) {
                    case "stdoutData":
                        terminalLog(response.stdoutString);
                        console.log(response.stdoutString);
                        break;
                    case "stderrData":
                        terminalLog(response.stderrString);
                        console.log(response.stderrString);
                        break;
                    case "close":
                        terminalLog("CloseCode: " + response.closeCode);
                        console.log("CloseCode: " + response.closeCode);
                        break;
                    case "exit":
                        terminalLog("ExitCode: " + response.exitCode);
                        console.log("ExitCode: " + response.exitCode);
                        break;
                }
            },
            onFailure: function (error) {
                terminalLog(error);
                console.log(error);
            },
            subscribe: true,
            resubscribe: true
        });
    } else {
        terminalLog("Unknown CPU architecture!");
        console.log("Unknown CPU architecture!");
    }
}

function runPppwn() {
    webOS.service.request("luna://org.webosbrew.hbchannel.service", {
        method: "spawn",
        parameters: {"command": runPppwnScript},
        onSuccess: function (response) {
            switch(response.event) {
                case "stdoutData":
                    terminalLog(response.stdoutString);
                    console.log(response.stdoutString);
                    break;
                case "stderrData":
                    terminalLog(response.stderrString);
                    console.log(response.stderrString);
                    break;
                case "close":
                    terminalLog("CloseCode: " + response.closeCode);
                    console.log("CloseCode: " + response.closeCode);
                    break;
                case "exit":
                    terminalLog("ExitCode: " + response.exitCode);
                    console.log("ExitCode: " + response.exitCode);
                    break;
            }
        },
        onFailure: function (error) {
            terminalLog(error);
            console.log(error);
        },
        subscribe: true,
        resubscribe: true
    });
}

function clearLog() {
    document.querySelector('#terminal').innerHTML = '';
}