const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const addButton = document.getElementById("add");
const expensesList = document.getElementById("expenses");
const saveButton = document.getElementById("save");



// Async function to get the expenses from local storage
async function getExpenses() {
  try {
    const expenses = await JSON.parse(localStorage.getItem("expenses")) || [];
    return expenses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Async function to save the expenses to local storage
async function saveExpenses(expenses) {
  try {
    await localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error(error);
  }
}

// Async function to render the expenses
async function renderExpenses() {
  try {
    // Clear the existing expenses
    expensesList.innerHTML = "";

    // Get the expenses from local storage
    const expenses = await getExpenses();

    // Render each expense as a list item with edit and delete buttons
    expenses.forEach((expense, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `${expense.description} - ${expense.amount} (${expense.category}) <button class="btn btn-primary btn-sm mx-2 edit" data-index="${index}">Edit</button> <button class="btn btn-danger btn-sm delete" data-index="${index}">Delete</button>`;
      expensesList.appendChild(li);
    });

    // Add event listeners to the edit and delete buttons
    expensesList.querySelectorAll(".edit").forEach((editButton) => {
      editButton.addEventListener("click", async (event) => {
        try {
          const index = event.target.dataset.index;
          const expenses = await getExpenses();
          const expense = expenses[index];
          amountInput.value = expense.amount;
          descriptionInput.value = expense.description;
          categoryInput.value = expense.category;
          saveButton.addEventListener('click',async ()=>{
            const amount = amountInput.value;
            const description = descriptionInput.value;
            const category = categoryInput.value;
            console.log(amount);
            console.log(expenses[index])
            expenses[index].amount=amount;
            expenses[index].description=description;
            expenses[index].category=category;
            await saveExpenses(expenses);
          })
        } catch (error) {
          console.error(error);
        }
      });
    });

    expensesList.querySelectorAll(".delete").forEach((deleteButton) => {
      deleteButton.addEventListener("click", async (event) => {
        try {
          const index = event.target.dataset.index;
          const expenses = await getExpenses();
          expenses.splice(index, 1);
          await saveExpenses(expenses);
          await renderExpenses();
        } catch (error) {
          console.error(error);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}


addButton.addEventListener("click", async () => {
  try {
    // Get the user input
    const amount = amountInput.value;
    const description = descriptionInput.value;
    const category = categoryInput.value;
    
    // Validate the user input
    if (!amount || !description || !category) {
      alert("Please enter all the fields.");
      return;
    }

    // Get the existing expenses from local storage
    const expenses = await getExpenses();

    // Add the new expense to the expenses array
    expenses.push({ amount, description, category });

    // Save the updated expenses to local storage
    await saveExpenses(expenses);

    // Clear the input fields
    amountInput.value = "";
    descriptionInput.value = "";

    // Render the updated expenses
    await renderExpenses();
  } catch (error) {
    console.error(error);
  }
});

// Render the initial expenses
renderExpenses();