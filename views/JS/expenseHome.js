function displayExpenseForm() {
    if (document.getElementById("expense-form-container").style.display == "block") {
        document.getElementById("expense-form-container").style.display = "none";
    } else {
        document.getElementById("expense-form-container").style.display = "block";
        document.getElementById("income-form-container").style.display = "none";
    }


}
function displayIncomeForm() {
    if (document.getElementById("income-form-container").style.display == "block") {
        document.getElementById("income-form-container").style.display = "none";
    } else {
        document.getElementById("income-form-container").style.display = "block";
        document.getElementById("expense-form-container").style.display = "none";
    }
}
function submitExpense(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const description = document.getElementById('expense-name').value;
    const amount = document.getElementById('expense-amount').value;

    const expenseDetails = {
        category: category,
        description: description,
        amount: amount
    }
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    axios.post('http://localhost:3000/expense', expenseDetails, {headers}).then(() => {
        getExpenseDetails(event);
        getIncomeDetail(event);
        document.getElementById('category').value = "";
        document.getElementById('expense-name').value = "";
        document.getElementById('expense-amount').value = "";
        document.getElementById("expense-form-container").style.display = "none";
    });
}

function submitIncome(event) {
    event.preventDefault();
    const income = document.getElementById('income-amount').value;

    const incomeDetail = {
        income: income
    }
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    axios.post('http://localhost:3000/income', incomeDetail, {headers}).then(() => {
        document.getElementById('income-amount').value = "";
        document.getElementById("income-form-container").style.display = "none";
        getIncomeDetail();
    })
}


function getExpenseDetails() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/get-expense', { headers: {"Authorization": token}})
        .then(response => {
            const expenses = response.data;

            // Get the list group element
            const listGroup = document.getElementById('list-group');
            listGroup.innerHTML = "";

            let totalExense = 0;
            // Iterate over the expenses and create list items
            expenses.forEach(expense => {
                const listId = expense.id;
                // Create list item
                const listItem = document.createElement('li');
                listItem.className = 'list-item';

                // Create expense details container div
                const expenseDetails = document.createElement('div');
                expenseDetails.className = 'expense-details';

                // Create separate divs for each expense detail
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'detail';
                categoryDiv.textContent = expense.category;

                const descriptionDiv = document.createElement('div');
                descriptionDiv.className = 'detail';
                descriptionDiv.textContent = expense.description;

                const amountDiv = document.createElement('div');
                amountDiv.className = 'detail';
                amountDiv.textContent = expense.amount;

                totalExense = totalExense + Number(expense.amount);

                // Append expense details divs to the expense details container
                expenseDetails.appendChild(categoryDiv);
                expenseDetails.appendChild(descriptionDiv);
                expenseDetails.appendChild(amountDiv);

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'X';

                // Add click event listener to delete button
                function deleteEvent(listId) {
                    deleteButton.onclick = (event) => {
                        event.preventDefault();
                        deleteFromServer(listId);

                    };
                }

                deleteEvent(listId);

                // Append expense details container and delete button to list item
                listItem.appendChild(expenseDetails);
                listItem.appendChild(deleteButton);

                // Append list item to list group
                listGroup.appendChild(listItem);
            });
            document.getElementById('expense').textContent = `Expense: ${totalExense}`;
        })
        .catch(error => {
            console.error('Error fetching expense data:', error);
        });
}

function deleteFromServer(listId) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    axios.delete(`http://localhost:3000/delete-list/${listId}`, {headers})
        .then(() => {
            getExpenseDetails();
        })
}

function getIncomeDetail() {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    axios.get('http://localhost:3000/get-income', {headers})
        .then(response => {
            const incomeDetail = response.data;
            let totalIncome = 0;

            incomeDetail.forEach(detail => {

                totalIncome += Number(detail.income);
            });



            document.getElementById('income').textContent = `Income: ${totalIncome}`;
        }).catch(err => console.log(err));

}

window.addEventListener("DOMContentLoaded", getExpenseDetails);
window.addEventListener("DOMContentLoaded", getIncomeDetail);