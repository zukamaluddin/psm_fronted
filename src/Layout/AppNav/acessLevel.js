
//------------------------------------------ Owner and Repairer----------------------------------------------------
let admin = localStorage.getItem('position') === "HQ" || localStorage.getItem('position') === "Manager Cawangan" || localStorage.getItem('position') === "Manager Negeri";
let staff = localStorage.getItem('position') === "Staf";
// export const userOwnerAccess = function () {
//     if (admin) {
//         return [
//             {
//                 icon: 'pe-7s-users',
//                 label: 'Pemilik',
//                 delete: true,
//                 add: true,
//                 update: true,
//                 content: [{
//                     label: 'Pendaftaran',
//                     to: '#/owner/register',
//                 }, {
//                     label: 'Senarai',
//                     to: '#/owner/list',
//                 }]
//             }
//         ]
//     }
//     else if (staff){
//         return [
//             {
//                 icon: 'pe-7s-users',
//                 label: 'Pemilik',
//                 delete: false,
//                 add: true,
//                 update: false,
//                 content: [{
//                     label: 'Pendaftaran',
//                     to: '#/owner/register',
//                 }, {
//                     label: 'Senarai',
//                     to: '#/owner/list',
//                 }]
//             }
//         ]
//     }
// }
//
// export const EquipmentNavAccess = function () {
//     if (admin) {
//         return [
//             {
//                 icon: 'pe-7s-news-paper',
//                 label: 'Alatan',
//                 content: [
//                     {
//                         label: 'Daftar Alatan',
//                         to: '#/equipment/create/000',
//                     },
//                     {
//                         label: 'Senarai Alatan',
//                         to: '#/equipment/list',
//                     },
//                     {
//                         label: 'Carian Stiker',
//                         to: '#/equipment/carian',
//                     },
//
//                 ]
//             }
//         ]
//     }
//     else if (staff){
//         return [
//             {
//                 icon: 'pe-7s-news-paper',
//                 label: 'Alatan',
//                 content: [
//                     {
//                         label: 'Daftar Alatan',
//                         to: '#/equipment/create/000',
//                     },
//                     {
//                         label: 'Senarai Alatan',
//                         to: '#/equipment/list',
//                     },
//                     {
//                         label: 'Carian Stiker',
//                         to: '#/equipment/carian',
//                     },
//
//                 ]
//             }
//         ]
//     }
// }

//---------------------------------------------- END Owner and Repairer ------------------------------------------------------------
