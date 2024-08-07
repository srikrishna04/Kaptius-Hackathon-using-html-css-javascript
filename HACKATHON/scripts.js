// Retrieve the stored total income and total expenditure from localStorage, or initialize them to 0
let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
let totalExpenditure = parseFloat(localStorage.getItem('totalExpenditure')) || 0;

// Retrieve the stored income and expenditure transactions from localStorage, or initialize them to empty arrays
let incomeTransactions = JSON.parse(localStorage.getItem('incomeTransactions')) || [];
let expenditureTransactions = JSON.parse(localStorage.getItem('expenditureTransactions')) || [];

// Function to navigate to a different page
function navigateTo(page) {
    window.location.href = page;
}

// Function to submit a new income transaction
function submitIncome() {
    const incomeAmount = parseFloat(document.getElementById('incomeAmount').value);
    const incomeDescription = document.getElementById('incomeDescription').value;

    // Check if the income amount is a number and the description is not empty
    if (!isNaN(incomeAmount) && incomeDescription.trim() !== "") {
        totalIncome += incomeAmount; // Add the income amount to the total income
        localStorage.setItem('totalIncome', totalIncome); // Store the updated total income in localStorage

        // Create a new transaction object
        const transaction = {
            date: new Date().toLocaleString(), // Set the current date and time
            description: incomeDescription,
            amount: incomeAmount,
            source: 'income'
        };

        incomeTransactions.push(transaction); // Add the new transaction to the income transactions array
        localStorage.setItem('incomeTransactions', JSON.stringify(incomeTransactions)); // Store the updated income transactions in localStorage
        updateIncomeTable(incomeTransactions); // Update the income table with the new transaction
        updateTotalAmount(); // Update the total amount displayed
    }
}

// Function to submit a new expenditure transaction
function submitExpenditure() {
    const expenditureAmount = parseFloat(document.getElementById('expenditureAmount').value);
    const expenditureDescription = document.getElementById('expenditureDescription').value;

    // Check if the expenditure amount is a number and the description is not empty
    if (!isNaN(expenditureAmount) && expenditureDescription.trim() !== "") {
        totalExpenditure += expenditureAmount; // Add the expenditure amount to the total expenditure
        localStorage.setItem('totalExpenditure', totalExpenditure); // Store the updated total expenditure in localStorage

        // Create a new transaction object
        const transaction = {
            date: new Date().toLocaleString(), // Set the current date and time
            description: expenditureDescription,
            amount: -expenditureAmount, // Use a negative amount for expenditure
            source: 'expenditure'
        };

        expenditureTransactions.push(transaction); // Add the new transaction to the expenditure transactions array
        localStorage.setItem('expenditureTransactions', JSON.stringify(expenditureTransactions)); // Store the updated expenditure transactions in localStorage
        updateExpenditureTable(expenditureTransactions); // Update the expenditure table with the new transaction
        updateTotalAmount(); // Update the total amount displayed
    }
}

// Function to update the total amount displayed and the status message
function updateTotalAmount() {
    const totalAmount = totalIncome - totalExpenditure; // Calculate the total amount
    localStorage.setItem('totalAmount', totalAmount); // Store the total amount in localStorage

    const totalAmountField = document.getElementById('totalAmount');
    const statusMessage = document.getElementById('statusMessage');
    const bronzeCup = document.getElementById('bronzeCup');
    const silverCup = document.getElementById('silverCup');
    const goldCup = document.getElementById('goldCup');

    if (totalAmountField) {
        totalAmountField.value = totalAmount; // Set the total amount field to the calculated total amount

        // Update the total amount field's background color and the status message based on the total amount
        if (totalAmount < 1000) {
            totalAmountField.classList.add('below-thousand');
            totalAmountField.classList.remove('equal-thousand', 'above-thousand');
            statusMessage.textContent = "Please maintain minimum balance";
            bronzeCup.classList.add('active');
            silverCup.classList.remove('active');
            goldCup.classList.remove('active');
        } else if (totalAmount === 1000) {
            totalAmountField.classList.add('equal-thousand');
            totalAmountField.classList.remove('below-thousand', 'above-thousand');
            statusMessage.textContent = "Have a nice day";
            bronzeCup.classList.add('active');
            silverCup.classList.add('active');
            goldCup.classList.remove('active');
        } else {
            totalAmountField.classList.add('above-thousand');
            totalAmountField.classList.remove('below-thousand', 'equal-thousand');
            statusMessage.textContent = "Invest in stocks";
            bronzeCup.classList.add('active');
            silverCup.classList.add('active');
            goldCup.classList.add('active');
        }
    }
}

// Function to update the income table with the given transactions
function updateIncomeTable(transactions) {
    const incomeTableBody = document.getElementById('incomeTableBody');
    if (incomeTableBody) {
        incomeTableBody.innerHTML = transactions.map(transaction => `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
            </tr>
        `).join(''); // Create table rows for each transaction and join them into a single string
    }
}

// Function to update the expenditure table with the given transactions
function updateExpenditureTable(transactions) {
    const expenditureTableBody = document.getElementById('expenditureTableBody');
    if (expenditureTableBody) {
        expenditureTableBody.innerHTML = transactions.map(transaction => `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
            </tr>
        `).join(''); // Create table rows for each transaction and join them into a single string
    }
}

// Function to update the total transactions table with all transactions (income and expenditure)
function updateTotalTable() {
    const totalTableBody = document.getElementById('totalTableBody');
    if (totalTableBody) {
        // Combine income and expenditure transactions, sort them by date, and create table rows
        const allTransactions = [...incomeTransactions, ...expenditureTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        totalTableBody.innerHTML = allTransactions.map(transaction => `
            <tr class="${transaction.source === 'income' ? 'income-row' : 'expenditure-row'}">
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
            </tr>
        `).join('');
    }
}

// Function to filter income transactions based on the selected start and end time
function filterIncome() {
    const startTime = document.getElementById('incomeStartTime').value;
    const endTime = document.getElementById('incomeEndTime').value;
    if (startTime && endTime) {
        // Filter transactions by checking if their time is within the selected range
        const filteredTransactions = incomeTransactions.filter(transaction => {
            const transactionTime = new Date(transaction.date).toTimeString().split(' ')[0];
            return transactionTime >= startTime && transactionTime <= endTime;
        });
        updateIncomeTable(filteredTransactions); // Update the income table with the filtered transactions
    }
}

// Function to filter expenditure transactions based on the selected start and end time
function filterExpenditure() {
    const startTime = document.getElementById('expenditureStartTime').value;
    const endTime = document.getElementById('expenditureEndTime').value;
    if (startTime && endTime) {
        // Filter transactions by checking if their time is within the selected range
        const filteredTransactions = expenditureTransactions.filter(transaction => {
            const transactionTime = new Date(transaction.date).toTimeString().split(' ')[0];
            return transactionTime >= startTime && transactionTime <= endTime;
        });
        updateExpenditureTable(filteredTransactions); // Update the expenditure table with the filtered transactions
    }
}

// Event listener to execute when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update the total amount displayed if the totalAmount element is present
    if (document.getElementById('totalAmount')) {
        updateTotalAmount();
    }

    // Add a click event listener to the total amount button to navigate to the total transactions page
    if (document.getElementById('totalAmountBtn')) {
        document.getElementById('totalAmountBtn').addEventListener('click', () => navigateTo('total.html'));
    }

    // Update the income table with the stored income transactions
    if (document.getElementById('incomeTableBody')) {
        updateIncomeTable(incomeTransactions);
    }

    // Update the expenditure table with the stored expenditure transactions
    if (document.getElementById('expenditureTableBody')) {
        updateExpenditureTable(expenditureTransactions);
    }

    // Update the total transactions table with all stored transactions
    if (document.getElementById('totalTableBody')) {
        updateTotalTable();
    }
});
