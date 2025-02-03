// Show a version for version control
        console.log('%cVersion 1.4.0', 'color: red; font-style: italic;');

        // Log the current HTML file and its file path
        console.log(`%cFile: ${document.location.pathname}`, 'color: red; font-style: italic;');

        // Function to hide the default cursor globally
        function hideDefaultCursor() {
            const globalStyle = document.createElement('style');
            globalStyle.innerHTML = `* { cursor: none !important; }`;
            document.head.appendChild(globalStyle);
            console.log("Default cursor hidden");
        }

        // Hide the cursor when the page loads
        hideDefaultCursor();

        // Prevent context menu unless Shift is held
        document.addEventListener('contextmenu', function(e) {
            if (!e.shiftKey) {
                e.preventDefault();
            }
        });

document.addEventListener("DOMContentLoaded", function () {
    const userInputElement = document.getElementById("user-input");
    const commandLine = document.getElementById("command-line");
    const historyContainer = document.getElementById("history");

    let confirmAction = false; // To store if confirmation prompt was shown

    // Force focus on the input field
    function forceFocus() {
        userInputElement.focus();
    }

    // Keep focus when the user clicks anywhere
    document.addEventListener("mousedown", function (e) {
        e.preventDefault(); // Prevents normal click behavior
        forceFocus();
    });

    // Keep focus when any key is pressed
    document.addEventListener("keydown", function () {
        forceFocus();
    });

    // Prevent input field from losing focus
    userInputElement.addEventListener("blur", function () {
        setTimeout(forceFocus, 0);
    });

    // Function to handle commands
    function processCommand(command) {
        let response = "";
        switch (command) {
            case 'sudo reboot':
                response = "Are you sure you want to reboot the system? (Y/N)";
                confirmAction = 'reboot'; // Flag to indicate reboot confirmation
                break;
            case 'sudo halt':
                response = "Are you sure you want to shut down the system? (Y/N)";
                confirmAction = 'halt'; // Flag to indicate halt confirmation
                break;
            case 'clear':
                setTimeout(() => {
                    location.reload(); // Refresh the page to simulate clearing the terminal
                }, 0);
                return ""; // No output needed for the history
            case 'help':
                response = `
                    <div class="help-list">
                        <p><span class="command">sudo reboot</span><span class="description">reboots the system</span></p>
                        <p><span class="command">sudo halt</span><span class="description">shuts down the system</span></p>
                        <p><span class="command">clear</span><span class="description">clears the terminal screen</span></p>
                        <p><span class="command">help</span><span class="description">displays this help message</span></p>
                    </div>
                `;
                break;
            default:
                response = `Command not found: ${command}`;
        }
        return response;
    }

    document.addEventListener("keydown", function (e) {
        if (!userInputElement) return;

        if (e.key === "Enter") {
            const input = userInputElement.value.trim();
            let response = "";

            // If waiting for confirmation, handle it
            if (confirmAction) {
                if (input.toLowerCase() === 'y') {
                    if (confirmAction === 'reboot') {
                        response = "Rebooting system...";
                        setTimeout(() => {
                            window.location.href = '../end/rest.html'; // Go to rest.html on sudo reboot
                        }, 1000);
                    } else if (confirmAction === 'halt') {
                        response = "Shutting down system...";
                        setTimeout(() => {
                            window.location.href = '../end/shut.html'; // Go to shut.html on sudo halt
                        }, 1000);
                    }
                } else if (input.toLowerCase() === 'n') {
                    response = confirmAction === 'reboot' ? "Canceling reboot." : "Canceling halt.";
                } else {
                    response = "Invalid input. Please type Y or N.";
                }
                confirmAction = false; // Reset the confirmation flag
            } else {
                response = processCommand(input);
            }

            // Append the user input to the history
            if (input !== "") {
                const userCommand = document.createElement("p");
                const historyPrompt = document.createElement("span");
                historyPrompt.classList.add("prompt");
                historyPrompt.innerHTML = `<span class="prompt">root</span><span class="white">@</span><span class="prompt">DoorsOS-server</span><span class="white">#</span> `;

                userCommand.appendChild(historyPrompt);
                userCommand.appendChild(document.createTextNode(input));
                historyContainer.appendChild(userCommand);
            }

            // Append the response to the history
            if (response) {
                const output = document.createElement("p");
                output.innerHTML = response;
                historyContainer.appendChild(output);
            }

            // Clear the input field and scroll to bottom
            userInputElement.value = "";
            commandLine.scrollTop = commandLine.scrollHeight;
        }
    });

    // Ensure input is always focused on page load
    forceFocus();
});

