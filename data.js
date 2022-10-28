 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
 import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyBXz1pHsU2j696OuytdGxOh8yBSY4LpQEA",
   authDomain: "guiaskmb.firebaseapp.com",
   projectId: "guiaskmb",
   storageBucket: "guiaskmb.appspot.com",
   messagingSenderId: "326888937551",
   appId: "1:326888937551:web:6b1696faca54faf44f323a"
 };

 // Initialize Firebase
 
 const app = initializeApp(firebaseConfig);

 // Initialize Cloud Firestore and get a reference to the service
 const db = getFirestore(app);

 let users = []

 
 const getUsers = async () => {
   const data = await getDocs(collection(db, "usuarios"));
   data.forEach((doc) => {
     users.push(doc.data())
   });
   console.log(users);
 }
 getUsers()
 let email = ''
 let password = ''
 let clikLogin = ''

 const typeLogin = (e) => {
   clikLogin = e.target.id
 }

 const textPass = (e) => {
     const alert = document.getElementById('alertMsg')
     alert.style.display= 'none'
         password = e.target.value
 }

 const textMail = (e) => {
     const alert = document.getElementById('alertMsg')
     alert.style.display= 'none'
         email = e.target.value
 }

 const loginUser = (e) => {
     const alert = document.getElementById('alertMsg')
     alert.style.display= 'none'
         const user = users.filter(x=>x.email == email && x.password == password)
         if (user.length) {
           if (clikLogin == 'clickGuias') {
             document.getElementById('guiasOpen').click()
           }else{
             document.getElementById('kitOpen').click()
           }
         }else{
           window.alert('Usuario no existe')
         }
 }

 async function submitForm(e) {
     e.preventDefault();
     const alert = document.getElementById('alertMsg')
     var validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
     if (!validEmail.test(email)) {
         alert.style.display= 'block'
     }else{
         alert.style.display= 'none'
         const user = users.filter(x=>x.email == email && x.password == password)
         if (user.length) {
           window.alert('Usuario ya existe')
         }else{
           document.getElementById('closeUser').click()
           
           const docRef = await addDoc(collection(db, "usuarios"), {
                 email,
                 password,
             });
             users = []
             getUsers()
             console.log("Document written with ID: ", docRef.id);
         }
         
     }
 }

 document.getElementById("exampleInputEmail1")
   .addEventListener("keyup", textMail, false);

 document.getElementById("exampleInputPassword1")
   .addEventListener("keyup", textPass, false);

 document.getElementById('contactForm')
     .addEventListener('submit', submitForm);

     document.getElementById('loginUser')
     .addEventListener('click', loginUser);

     document.getElementById('clickkit')
     .addEventListener('click', typeLogin);

     const clickGuias = document.getElementById('clickGuias')
    if (clickGuias) {
        clickGuias
     .addEventListener('click', typeLogin);
    }
     