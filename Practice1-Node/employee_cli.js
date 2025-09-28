const readline = require('readline');

// The array to store employee data
let employees = [
    { name: 'Alice', id: 'E101' },
    { name: 'Bob', id: 'E102' },
    { name: 'Charlie', id: 'E103' }
];

// Create the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Displays the main menu and handles user input.
 */
function showMenu() {
    console.log('\nEmployee Management System');
    console.log('1. Add Employee');
    console.log('2. List Employees');
    console.log('3. Remove Employee');
    console.log('4. Exit');

    rl.question('\nEnter your choice: ', (choice) => {
        switch (choice.trim()) {
            case '1':
                addEmployee();
                break;
            case '2':
                listEmployees();
                break;
            case '3':
                removeEmployeePrompt();
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please enter a number between 1 and 4.');
                showMenu();
        }
    });
}

/**
 * Handles adding a new employee to the array.
 */
function addEmployee() {
    rl.question('Enter employee name: ', (name) => {
        // Simple check to ensure a name is entered
        if (!name.trim()) {
            console.log('Employee name cannot be empty. Try again.');
            return showMenu();
        }

        rl.question('Enter employee ID: ', (id) => {
            const employeeID = id.trim().toUpperCase(); // Normalize ID
            
            // Check if ID already exists
            if (employees.some(emp => emp.id === employeeID)) {
                console.log(`Error: Employee ID ${employeeID} already exists.`);
                return showMenu();
            }

            // Simple check to ensure an ID is entered
            if (!employeeID) {
                console.log('Employee ID cannot be empty. Try again.');
                return showMenu();
            }
            
            employees.push({ name: name.trim(), id: employeeID });
            console.log(`Employee ${name.trim()} (ID: ${employeeID}) added successfully.`);
            showMenu();
        });
    });
}

/**
 * Lists all employees in the array.
 */
function listEmployees() {
    console.log('\nEmployee List:');
    if (employees.length === 0) {
        console.log('The employee list is currently empty.');
    } else {
        employees.forEach((emp, index) => {
            console.log(`${index + 1}. Name: ${emp.name}, ID: ${emp.id}`);
        });
    }
    showMenu();
}

/**
 * Prompts for the employee ID to be removed.
 */
function removeEmployeePrompt() {
    rl.question('Enter employee ID to remove: ', (id) => {
        const employeeID = id.trim().toUpperCase();
        removeEmployee(employeeID);
    });
}

/**
 * Removes an employee by their ID.
 * @param {string} id - The ID of the employee to remove.
 */
function removeEmployee(id) {
    const initialLength = employees.length;
    
    // Find the index of the employee to remove
    const indexToRemove = employees.findIndex(emp => emp.id === id);

    if (indexToRemove !== -1) {
        // Store the removed employee's data before splicing
        const removedEmployee = employees[indexToRemove];
        
        // Remove the employee using splice
        employees.splice(indexToRemove, 1);
        
        console.log(`Employee ${removedEmployee.name} (ID: ${removedEmployee.id}) removed successfully.`);
    } else {
        console.log(`Error: Employee with ID ${id} not found.`);
    }

    showMenu();
}

// Event handler for when the readline interface is closed (e.g., on Exit)
rl.on('close', () => {
    console.log('\nExiting Employee Management System. Goodbye!');
    process.exit(0);
});

// Start the application
showMenu();