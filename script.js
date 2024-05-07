// Import required Firebase services
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
    Firestore,
    getFirestore,
    onSnapshot,
    query,
    collection,
    orderBy,
    addDoc
} from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

// web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjVYeT1CZRDJ2eoFaZJFCkPKantwZSjRE",
    authDomain: "movieapp-61895.firebaseapp.com",
    projectId: "movieapp-61895",
    storageBucket: "movieapp-61895.appspot.com",
    messagingSenderId: "647663950972",
    appId: "1:647663950972:web:d3ed607a2436f57dd5bdf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Getting live query from the Firestore
const q = query(collection(db, "MovieApp"), orderBy("Name"));

// Displaying the data of the db
const unsubscribe = onSnapshot(q, (snapshot) => {
    $('#movieList').empty();
    var rows = "";
    snapshot.forEach((doc) => {
        rows += '<tr>';
        rows += '<td>' + doc.data().Name + '</td>';
        rows += '<td>' + doc.data().Release + '</td>';
        rows += '<td>' + doc.data().Director + '</td>';
        rows += '<td>' + doc.data().Ratings + '/5</td>';
        rows += '<td><button class="table-btn" onclick="editBook(\'' + doc.id + '\')">Edit</button>' +
            '<button class="table-btn delete" onclick="deleteBook(\'' + doc.id + '\')">Delete</button></td>';

        rows += '</tr>';
    })
    $('#movieList').append(rows);
})

// Adding new data to the db
$('#form-btn').click(function (e) {
    e.preventDefault(); // Prevent default form submission
    const docRef = addDoc(collection(db, "MovieApp"), {
        Director: $("#director").val(),
        Name: $("#name").val(),
        Ratings: $("#ratings").val(),
        Release: $("#release").val()
    }).then(() => {
        console.log("Document added successfully");
        $('#movie')[0].reset(); // Reset the form after successful submission
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
})


