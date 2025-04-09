pc.script.createLoadingScreen((app) => {
    // Create the main loading screen div
    const div = document.createElement('div');
    div.style.backgroundColor = "#222"; // Dark gray background
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.height = "100%";
    div.style.width = "100%";
    document.body.appendChild(div);

    // Hide the loading screen when the app starts
    app.once('start', () => {
        document.body.removeChild(div);
    });
});
