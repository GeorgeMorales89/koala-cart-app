// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Define the Firebase settings
const appSettings = {
    databaseURL: "https://playground-7d4ee-default-rtdb.firebaseio.com/"
}

// Initialize the Firebase app with the defined settings
const app = initializeApp(appSettings)
// Get a reference to the Firebase database linked with the app
const database = getDatabase(app)
// Create a reference to "shoppingList" inside the database
const shoppingListInDB = ref(database, "shoppingList")

// Get the input field, add button and shopping list elements from the HTML
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Add an event listener to the add button that triggers when it is clicked
addButtonEl.addEventListener("click", function() {
    // Get the value from the input field
    let inputValue = inputFieldEl.value
    
    // Add the input value to the shopping list in the database
    push(shoppingListInDB, inputValue)
    
    // Clear the input field
    clearInputFieldEl()
})

// Listen to changes in the value of the shopping list in the database
onValue(shoppingListInDB, function(snapshot) {
    // If the snapshot of the database exists
    if (snapshot.exists()) {
        // Convert the snapshot value into an array
        let itemsArray = Object.entries(snapshot.val())
    
        // Clear the shopping list on the webpage
        clearShoppingListEl()
        
        // For each item in the items array
        for (let i = 0; i < itemsArray.length; i++) {
            // Get the current item, its ID and its value
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            // Add the current item to the shopping list on the webpage
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        // If the snapshot does not exist, display a placeholder message
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Function that clears the shopping list on the webpage
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function that clears the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function that adds an item to the shopping list on the webpage
function appendItemToShoppingListEl(item) {
    // Get the ID and value of the item
    let itemID = item[0]
    let itemValue = item[1]
    
    // Create a new list item element
    let newEl = document.createElement("li")
    
    // Set the text of the new list item to be the item value
    newEl.textContent = itemValue
    
    // Add an event listener to the new list item that triggers when it is clicked
    newEl.addEventListener("dblclick", function() {
        // Get a reference to the exact location of the clicked item in the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        // Remove the clicked item from the database
        remove(exactLocationOfItemInDB)
    })
    
    // Append the new list item to the shopping list on the webpage
    shoppingListEl.append(newEl)
}
