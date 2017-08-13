import * as firebase from 'firebase'
let database
export const init = () => {
    let config = {
        apiKey: "AIzaSyDWF9W2lF-LUwrreOnFNgtvY1l4n7HFkyg",
        authDomain: "simtim-40b81.firebaseapp.com",
        databaseURL: "https://simtim-40b81.firebaseio.com",
        projectId: "simtim-40b81",
        storageBucket: "simtim-40b81.appspot.com",
        messagingSenderId: "314231547250"
    }
    firebase.initializeApp(config)
    database = firebase.database()
}