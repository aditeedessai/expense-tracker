const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const API_URL = '/api/transactions';

async function getTransactions() {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
}

function updateDOMValues(transactions) {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

async function addTransaction(e) {
    e.preventDefault();

    const transactionData = {
        text: text.value,
        amount: amount.value
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
    });

    if (res.ok) {
        text.value = '';
        amount.value = '';
        init();
    }
}

async function removeTransaction(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    init();
}

async function init() {
    list.innerHTML = '';
    const transactions = await getTransactions();
    transactions.forEach(addTransactionDOM);
    updateDOMValues(transactions);
}

form.addEventListener('submit', addTransaction);
init();
