// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNnVgeZ3ksI0b8RfpDiowtuBMIXquD8S0",
  authDomain: "mission2-62d9c.firebaseapp.com",
  projectId: "mission2-62d9c",
  storageBucket: "mission2-62d9c.appspot.com",
  messagingSenderId: "32310739750",
  appId: "1:32310739750:web:01d38bf4d82b889397b7e7",
  measurementId: "G-ZLNZS75XH8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// References
const storage = firebase.storage();
const database = firebase.database();

document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const text = document.getElementById('text-input').value;
    const file = document.getElementById('file-upload').files[0];

    if (!file || !text) {
        document.getElementById('upload-message').textContent = 'Please provide both text and a file.';
        return;
    }

    const fileRef = storage.ref('images/' + file.name);
    fileRef.put(file).then(() => {
        return fileRef.getDownloadURL();
    }).then((url) => {
        return database.ref('uploads').push({
            text: text,
            imageUrl: url
        });
    }).then(() => {
        document.getElementById('upload-message').textContent = 'Upload successful!';
        document.getElementById('text-input').value = '';
        document.getElementById('file-upload').value = '';
        loadUploadedContent();
    }).catch(error => {
        document.getElementById('upload-message').textContent = 'Upload failed: ' + error.message;
    });
});

// Load uploaded content
function loadUploadedContent() {
    const contentDiv = document.getElementById('uploaded-content');
    const textDiv = document.getElementById('uploaded-text');
    const photoDiv = document.getElementById('uploaded-photo');

    contentDiv.innerHTML = ''; // Clear previous content

    database.ref('uploads').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.text) {
                const p = document.createElement('p');
                p.textContent = data.text;
                textDiv.appendChild(p);
            }
            if (data.imageUrl) {
                const img = document.createElement('img');
                img.src = data.imageUrl;
                photoDiv.appendChild(img);
            }
        });
    });
}

// Load content on page load
window.onload = loadUploadedContent;
