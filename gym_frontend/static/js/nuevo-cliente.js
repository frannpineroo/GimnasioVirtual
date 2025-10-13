document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('client-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const userName = document.getElementById('user-name').value.trim();
        const userLastName = document.getElementById('user-lastname').value.trim();
        const experienceLevel = document.getElementById('experience_level').value;
        const goal = document.getElementById('goal').value;
        const injuries = document.getElementById('injuries').value.trim();
        const status = document.getElementById('status').value;

        const clienteData = {
            name: userName,
            last_name: userLastName,
            experience_level: experienceLevel,
            goal: goal,
            injuries: injuries || "",
            status: status
        };

        fetch('http://localhost:8000/api/clientes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        })
        .then(response => {
            console.log('=== RESPUESTA DEL SERVIDOR ===');
            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);
            console.log('==============================');
            
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response body:', text);
                    throw new Error(`Error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('=== CLIENTE CREADO ===');
            console.log('Respuesta:', data);
            console.log('=======================');
            
            alert('Cliente guardado exitosamente!');
            window.location.href = 'clientes.html';
        })
        .catch(error => {
            console.error('=== ERROR ===');
            console.error('Error completo:', error);
            console.error('=============');
            alert('Ocurrió un problema al guardar el nuevo cliente: ' + error.message);
        });
    });
});