import {initializeApp} from "firebase/app";
import {addDoc, collection, getFirestore} from "firebase/firestore";
import * as fs from "fs";
const csv = require('csv-parser');

const firebaseConfig = {
    apiKey: "AIzaSyDSajayl2vSjOIW68ezn-xQsRoXKJHnASs",
    authDomain: "examin-imsa.firebaseapp.com",
    projectId: "examin-imsa",
    storageBucket: "examin-imsa.appspot.com",
    messagingSenderId: "695220303790",
    appId: "1:695220303790:web:d28a66bfe4726f7470fa3f",
    measurementId: "G-WQBEX4VBZ9"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const COLLECTION_NAME = "questions-whap";

const charArray = ["A", "B", "C", "D", "E"];

const tableRef = collection(db, COLLECTION_NAME);

fs.createReadStream('questions.csv')
    .pipe(csv())
    .on('data', (row) => {
        const primQuestion: PrimitiveQuestion = row;
        const map = {};
        map[primQuestion.A1.trim()] = primQuestion.AE1.trim();
        map[primQuestion.A2.trim()] = primQuestion.AE2.trim();
        map[primQuestion.A3.trim()] = primQuestion.AE3.trim();
        map[primQuestion.A4.trim()] = primQuestion.AE4.trim();
        if(primQuestion.A5.trim()) {
            map[primQuestion.A5.trim()] = primQuestion.AE5.trim();
        }
        console.log(map);
        const question: Question = {
            prompt: primQuestion.Question.trim(),
            answers: map,
            answer: charArray.indexOf(primQuestion.Answer),
            difficulty: primQuestion.Difficulty,
            skill: primQuestion.Skill.trim(),
            topic: primQuestion.Topic.trim(),
            imgUrl: primQuestion.imgUrl.trim(),
            unit: primQuestion.Unit,
            year: primQuestion.Year
        };
        addDoc(tableRef, question);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });


type PrimitiveQuestion = {
    Question: string,
    A1: string,
    A2: string,
    A3: string,
    A4: string,
    A5: string,
    AE1: string,
    AE2: string,
    AE3: string,
    AE4: string,
    AE5: string,
    Answer: string
    imgUrl: string,
    Subject: string,
    Year: number,
    Difficulty: number,
    Skill: string,
    Unit: number,
    Topic: string
}

type Question = {
    prompt: string,
    answer: number,
    answers: {},
    difficulty: number,
    skill: string,
    topic: string,
    unit: number,
    year: number,
    imgUrl: string
};
