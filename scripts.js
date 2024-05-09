// Import required Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
    getFirestore, onSnapshot, query, collection, orderBy, addDoc,
    deleteDoc, doc
} from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

// Web app's Firebase configuration
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

// Ensure DOM content is loaded before accessing DOM elements
$(document).ready(function () {
    let sortValue = $('#sort').val(); // Initialize sortValue after DOM is loaded
    let q = query(collection(db, "MovieApp"), orderBy(sortValue));
    load()

    $('#sort').on('change', function () {
        sortValue = $(this).val();
        q = query(collection(db, "MovieApp"), orderBy(sortValue));
        load();
    })

    function load() {
        onSnapshot(q, (snapshot) => {
            $('#grids').empty();
            snapshot.forEach((doc) => {
                var card = $("<div id='card'></div>").addClass('card');
                var name = '<h3>Name: ' + doc.data().Name + '</h3>';
                var release = '<strong><p>Release: ' + doc.data().Release + '</p></strong>';
                var director = '<strong><p>Director: ' + doc.data().Director + '</p></strong>';
                var rating = '<strong><p>Ratings: ' + doc.data().Ratings + '/5</p></strong>';
                var btn = $("<div></div>").addClass('btn-container');
                btn.append('<button class="edit" data-id="' + doc.id + '">Edit</button>' +
                    '<button class="delete" data-id="' + doc.id + '">Delete</button>');
                card.append(name)
                    .append(release)
                    .append(director)
                    .append(rating)
                    .append(btn);
                $('#grids').append(card);
            });
        })
    };
    // Add new data to the db
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


    $('#grids').on('click', '.delete', function () {
        // Get the movie ID from the data-id attribute of the delete button
        var movieId = $(this).data('id');

        // Call the deleteBook function 
        deleteBook(movieId);
    });

    function deleteBook(id) {
        if (confirm("Are you sure you want to delete this movie?")) {
            const movieDocRef = doc(db, "MovieApp", id);
            deleteDoc(movieDocRef)
                .then(() => {
                    console.log("Document successfully deleted!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
        }
    }
}
);
