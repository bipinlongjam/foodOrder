document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('order-form');
    const expenseList = document.getElementById('order-list');

    // Function to fetch expenses from the API and render them
    function fetchAndRenderExpenses() {
        fetch('https://crudcrud.com/api/e1c2141f5405456fbdb70229945324b2/foodOrder')
            .then(response => response.json())
            .then(data => {
                expenses = data;
                renderExpenses();
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }

    // Function to render expenses
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${expense.description}</strong> - ${expense.amount} - ${expense.category}
                    </div>
                    <div>
                        
                        <button type="button" class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;
            expenseList.appendChild(listItem);
        });
    }

    // Function to add an expense via the API
    function addExpense(amount, description, category) {
        fetch('https://crudcrud.com/api/e1c2141f5405456fbdb70229945324b2/foodOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, description, category }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add expense');
            }
            fetchAndRenderExpenses(); // Refresh expense list after adding
        })
        .catch(error => console.error('Error adding expense:', error));
    }

    // Function to delete an expense via the API
    function deleteExpense(index) {

        fetch(`https://crudcrud.com/api/e1c2141f5405456fbdb70229945324b2/foodOrder/${expenses[index]._id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }
            fetchAndRenderExpenses(); // Refresh expense list after deleting
        })
        .catch(error => console.error('Error deleting expense:', error));
    }

    // Event listener for form submission
    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const amountInput = document.getElementById('item-amount');
        const descriptionInput = document.getElementById('item-description');
        const categoryInput = document.getElementById('table-number');

        const amount = parseFloat(amountInput.value);
        const description = descriptionInput.value.trim();
        const category = categoryInput.value.trim();

        if (!amount || !description || !category) {
            alert('Please fill in all fields.');
            return;
        }

        addExpense(amount, description, category);
        expenseForm.reset();
    });

    // Event delegation for delete buttons
    expenseList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            deleteExpense(index);
        }
    });

    // Initial fetch and render of expenses when the page loads
    fetchAndRenderExpenses();
});
