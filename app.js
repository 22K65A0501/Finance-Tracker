let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');

    // Pages to dynamically load
    const pages = {
        dashboard: `
            <section id="dashboard" class="active">
                <h2>Bank Account Overview</h2>
                <div class="overview">
                    <div>
                        <h3>Balance</h3>
                        <p id="balance">$0.00</p>
                    </div>
                    <div>
                        <h3>Total Income</h3>
                        <p id="total-income">$0.00</p>
                    </div>
                    <div>
                        <h3>Total Expenses</h3>
                        <p id="total-expenses">$0.00</p>
                    </div>
                </div>
                <table class="transaction-list">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody id="transaction-list"></tbody>
                </table>
            </section>
        `,
        'add-transaction': `
            <section id="add-transaction" class="active">
                <h2>Add Transaction</h2>
                <form id="transaction-form">
                    <input type="text" id="description" placeholder="Description" required>
                    <input type="number" id="amount" placeholder="Amount" required>
                    <select id="category">
                        <option value="income">Income</option>
                        <option value="food">Food</option>
                        <option value="rent">Rent</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="utilities">Utilities</option>
                    </select>
                    <button type="submit">Add Transaction</button>
                </form>
                <div class="success-message" id="success-message">Transaction added successfully!</div>
            </section>
        `,
        reports: `
            <section id="reports" class="active">
                <h2>Reports</h2>
                <canvas id="monthlyReportChart" width="400" height="200"></canvas>
            </section>
        `
    };

    // Function to load a page based on the link clicked
    function loadPage(pageName) {
        content.innerHTML = pages[pageName];
        if (pageName === 'dashboard') {
            updateDashboard(); // Load dashboard content
        } else if (pageName === 'reports') {
            renderReports(); // Load reports
        }
    }

    // Navigation listeners
    document.getElementById('link-dashboard').addEventListener('click', function () {
        loadPage('dashboard');
    });

    document.getElementById('link-add-transaction').addEventListener('click', function () {
        loadPage('add-transaction');
    });

    document.getElementById('link-reports').addEventListener('click', function () {
        loadPage('reports');
    });

    // Initial load: load the dashboard
    loadPage('dashboard');

    // Handle adding a new transaction
    document.body.addEventListener('submit', function (e) {
        if (e.target.id === 'transaction-form') {
            e.preventDefault(); // Prevent form submission
            
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('category').value;

            // Create transaction object
            const transaction = { description, amount, category };
            transactions.push(transaction); // Add to transactions array
            localStorage.setItem('transactions', JSON.stringify(transactions)); // Save to local storage

            // Show success message
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
                loadPage('dashboard'); // Redirect to the dashboard after 2 seconds
            }, 2000);
        }
    });

    // Update the dashboard with the transactions and stats
    function updateDashboard() {
        const balanceEl = document.getElementById('balance');
        const incomeEl = document.getElementById('total-income');
        const expensesEl = document.getElementById('total-expenses');
        const transactionList = document.getElementById('transaction-list');

        let totalIncome = 0;
        let totalExpenses = 0;
        let balance = 0;

        transactionList.innerHTML = ''; // Clear previous transactions

        transactions.forEach((transaction) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${transaction.description}</td>
                <td class="${transaction.category === 'income' ? 'income' : 'expense'}">$${transaction.amount.toFixed(2)}</td>
                <td>${transaction.category}</td>
            `;
            transactionList.appendChild(tr);

            if (transaction.category === 'income') {
                totalIncome += transaction.amount;
                balance += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
                balance -= transaction.amount;
            }
        });

        balanceEl.textContent = `$${balance.toFixed(2)}`;
        incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
        expensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
    }

    // Handle reports (monthly income vs expenses chart)
    function renderReports() {
        const ctx = document.getElementById('monthlyReportChart').getContext('2d');

        const incomeData = new Array(12).fill(0); // Income for each month
        const expensesData = new Array(12).fill(0); // Expenses for each month

        transactions.forEach((transaction) => {
            const month = new Date().getMonth(); // Assume all transactions happened this month
            if (transaction.category === 'income') {
                incomeData[month] += transaction.amount;
            } else {
                expensesData[month] += transaction.amount;
            }
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: '#4CAF50',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Expenses',
                        data: expensesData,
                        borderColor: '#F44336',
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});