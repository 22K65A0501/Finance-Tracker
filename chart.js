let expenseChart;

function updateExpenseChart() {
    const categories = ['food', 'rent', 'entertainment', 'utilities'];
    const categoryTotals = categories.map((category) => {
        return transactions
            .filter((transaction) => transaction.category === category)
            .reduce((acc, curr) => acc + curr.amount, 0);
    });

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: categoryTotals,
                backgroundColor: ['#F44336', '#2196F3', '#FFC107', '#4CAF50'],
                borderColor: ['#D32F2F', '#1976D2', '#FFA000', '#388E3C'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}