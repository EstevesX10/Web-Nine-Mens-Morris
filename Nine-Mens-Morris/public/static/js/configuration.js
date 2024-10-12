document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('config-form');

    // Load a previous configuration when loading the page
    loadSavedSettings();

    // Save the configuration when submiting the form
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão de submissão

        // Capturar os valores dos campos de configuração
        const boardSize = document.getElementById('board-size').value;
        const opponent = document.getElementById('opponent').value;
        const firstPlayer = document.getElementById('first-player').value;
        const aiLevel = document.getElementById('ai-level').value;

        // Save parameters in the local storage
        localStorage.setItem('boardSize', boardSize);
        localStorage.setItem('opponent', opponent);
        localStorage.setItem('firstPlayer', firstPlayer);
        localStorage.setItem('aiLevel', aiLevel);

        alert('Configuration saved successfuly!');
    });

    // Load previously saved configuration
    function loadSavedSettings() {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedOpponent = localStorage.getItem('opponent');
        const savedFirstPlayer = localStorage.getItem('firstPlayer');
        const savedAiLevel = localStorage.getItem('aiLevel');

        // Fill the brackets with the saved values
        if (savedBoardSize) document.getElementById('board-size').value = savedBoardSize;
        if (savedOpponent) document.getElementById('opponent').value = savedOpponent;
        if (savedFirstPlayer) document.getElementById('first-player').value = savedFirstPlayer;
        if (savedAiLevel) document.getElementById('ai-level').value = savedAiLevel;
    }
});
