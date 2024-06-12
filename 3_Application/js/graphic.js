document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('emissionsChart').getContext('2d');
    const emissionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D', 'E', 'F'], // Emission levels
            datasets: [{
                label: 'Page Weight (MB)',
                data: [0.3, 0.6, 0.9, 1.2, 1.5, 1.8], // Corresponding page weights
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', // A
                    'rgba(75, 192, 192, 0.4)', // B
                    'rgba(75, 192, 192, 0.6)', // C
                    'rgba(255, 206, 86, 0.6)', // D
                    'rgba(255, 99, 132, 0.6)', // E
                    'rgba(255, 99, 132, 0.8)'  // F
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Page Weight (MB)'
                    },
                    ticks: {
                        stepSize: 0.5, 
                        max: 2.5 
                    },
                    grid: {
                        color: function(context) {
                            return 'rgba(0, 0, 0, 0.1)'; 
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Carbon Emissions Level'
                    },
                    grid: {
                        display: true // Hide vertical grid lines
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
});


