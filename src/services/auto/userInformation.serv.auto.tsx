// import { doc, DocumentData, onSnapshot } from "firebase/firestore";
// import { db } from "../../config/firebaseSDK";

// let subscribe_userInformation: (() => void) | undefined = undefined

// interface UserInformation {
//     username: string;
//     gmail: string;
//     uuid: string;
//     avartarCode: string;
//     friends: {
//         status: string;
//         list: string[] | string;
//     };
//     requests: string[] | string;
//     setting: {} | string; // hoặc cụ thể hơn nếu có
//     profileStatus: string;
// }

// export const enableListener_userInformation = (gmail: string):Promise<UserInformation | DocumentData | undefined> => {
//     return new Promise((resolve, reject) => {
//         if (subscribe_userInformation) {
//             console.log("Started before")
//             return resolve(undefined)
//         }

//         subscribe_userInformation = onSnapshot(doc(db, "userInformation", btoa(gmail)), (doc) => {
//             const data = doc.data()
//             if (data) {
//                 console.log(doc.data())
//                 resolve(doc.data())
//             } else {
//                 reject(undefined)
//             }
//         })
//     })
// }


// export const disableListener_userInformation = () => {
//     if (subscribe_userInformation) {
//         subscribe_userInformation()
//         subscribe_userInformation = undefined
//         console.log("stop listen UserInformation")
//     }
// }