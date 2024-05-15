// Import required Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
    getFirestore, onSnapshot, query, collection, orderBy, addDoc,
    deleteDoc, doc, getDoc, updateDoc
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
    let sortValue = $('#sort').val(); // Initialize sortValue 
    let q = query(collection(db, "MovieApp"), orderBy(sortValue));
    load()
    console.log($('#form-btn').val());
    $('#sort').on('change', function () {
        sortValue = $(this).val();
        q = query(collection(db, "MovieApp"), orderBy(sortValue));
        load();
    })
    // Display the data in firestore
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
    // Handle add/update of movies
    $('#form-btn').click(function (e) {
        e.preventDefault(); // Prevent default form submission
        if ($('#form-btn').val() == 'Add') {
            add();
            return
        }
        updateReview(e);

    })
    function add() {
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
    }

    $('#grids').on('click', '.delete', function () {
        // Get the movie ID from the data-id attribute of the delete button
        var movieId = $(this).data('id');

        // Call the deleteBook function 
        deleteReview(movieId);
    });


    function deleteReview(id) {
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
    $('#grids').on('click', '.edit', function (event) {
        // Get the movie ID from the data-id attribute of the delete button
        var movieId = $(this).data('id');
        editReview(movieId, event);
    });
    function editReview(id, e) {
        const docRef = doc(db, "MovieApp", id);
        getDoc(docRef).then((doc) => {

            const data = doc.data();
            $('#name').val(data.Name);
            $('#director').val(data.Director);
            $('#release').val(data.Release);
            $('#ratings').val(data.Ratings);
            $('#form-btn').val(id).text('Update');
            toggleVisibility(e)
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    }

    function updateReview(e) {
        const docRef = doc(db, "MovieApp", $('#form-btn').val());
        const name = $('#name').val();
        const director = $('#director').val();
        const release = $('#release').val();
        const ratings = $('#ratings').val();
        updateDoc(docRef, {
            Name: name,
            Director: director,
            Release: release,
            Ratings: ratings
        }).then(() => {
            console.log("Document updated successfully");
            confirm("Updated Successfully");
            $('#movie')[0].reset();
            // Reset the form after successful submission

            toggleVisibility(e)

        }).catch((error) => {
            console.error("Error updating document: ", error);
        });
    }

}
);
