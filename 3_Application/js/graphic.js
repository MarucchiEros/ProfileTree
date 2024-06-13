/* this function generates the graph for the carbon emissions rating */
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('emissionsChart').getContext('2d');
    const emissionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D', 'E', 'F'],
            datasets: [{
                label: 'Page Weight (MB)',
                data: [0.3, 0.6, 0.9, 1.2, 1.5, 1.8],
                backgroundColor: [
                    'rgba(40, 167, 70, 0.5)', // A
                    'rgba(238, 255, 0, 0.5)', // B
                    'rgba(255, 166, 0, 0.5)', // C
                    'rgba(178, 0, 248, 0.5)', // D
                    'rgba(0, 4, 255, 0.5)', // E
                    'rgba(255, 0, 0, 0.5)'  // F
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
                        color: function (context) {
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
                        display: true
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

/* this function is used to show and hide the navbar */
function toggleNavbar() {
    var navbar = document.getElementById("navbar");
    navbar.classList.toggle("active");
}

