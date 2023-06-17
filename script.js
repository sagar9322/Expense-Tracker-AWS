// Simulated expense data
const expenses = [
    { date: '2023-06-16', amount: 20.5 },
    { date: '2023-06-16', amount: 35 },
    { date: '2023-06-15', amount: 15 },
    { date: '2023-06-14', amount: 50 },
    // ... additional expense data
  ];
  
  // Function to calculate daily, monthly, and yearly expenses
  function calculateExpenses() {
    const dailyExpenses = {};
    const monthlyExpenses = {};
    const yearlyExpenses = {};
  
    for (const expense of expenses) {
      const expenseDate = new Date(expense.date);
      const day = expenseDate.toDateString();
      const month = expenseDate.toLocaleString('default', { month: 'long' });
      const year = expenseDate.getFullYear();
  
      // Daily expenses
      if (!dailyExpenses[day]) {
        dailyExpenses[day] = expense.amount;
      } else {
        dailyExpenses[day] += expense.amount;
      }
  
      // Monthly expenses
      const monthKey = `${month} ${year}`;
      if (!monthlyExpenses[monthKey]) {
        monthlyExpenses[monthKey] = expense.amount;
      } else {
        monthlyExpenses[monthKey] += expense.amount;
      }
  
      // Yearly expenses
      if (!yearlyExpenses[year]) {
        yearlyExpenses[year] = expense.amount;
      } else {
        yearlyExpenses[year] += expense.amount;
      }
    }
  
    return {
      dailyExpenses,
      monthlyExpenses,
      yearlyExpenses
    };
  }
  
  // Function to display expenses in the respective sections
  function displayExpenses() {
    const { dailyExpenses, monthlyExpenses, yearlyExpenses } = calculateExpenses();
  
    const dailyExpensesList = document.getElementById('daily-expenses');
    dailyExpensesList.innerHTML = '';
    for (const [day, amount] of Object.entries(dailyExpenses)) {
      const listItem = document.createElement('li');
      listItem.textContent = `${day}: $${amount.toFixed(2)}`;
      dailyExpensesList.appendChild(listItem);
    }
  
    const monthlyExpensesList = document.getElementById('monthly-expenses');
    monthlyExpensesList.innerHTML = '';
    for (const [monthYear, amount] of Object.entries(monthlyExpenses)) {
      const listItem = document.createElement('li');
      listItem.textContent = `${monthYear}: $${amount.toFixed(2)}`;
      monthlyExpensesList.appendChild(listItem);
    }
  
    const yearlyExpensesList = document.getElementById('yearly-expenses');
    yearlyExpensesList.innerHTML = '';
    for (const [year, amount] of Object.entries(yearlyExpenses)) {
      const listItem = document.createElement('li');
      listItem.textContent = `${year}: $${amount.toFixed(2)}`;
      yearlyExpensesList.appendChild(listItem);
    }
  }
  
  // Call the displayExpenses function to render the expenses on page load
  displayExpenses();