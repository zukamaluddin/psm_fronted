export default {
    listPentadbiran: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/listJawatanPentadbiran", {
                method: 'POST', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    deletePentadbiran: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `setting/deleteJawatanPentadbiran`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
                body: JSON.stringify({data: data}),
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    viewPentadbiran: (rowid) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/viewJawatanPentadbiran/" + rowid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },

    listGred: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/listJawatanGred", {
                method: 'POST', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    deleteGred: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `setting/deleteJawatanGred`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
                body: JSON.stringify({data: data}),
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    viewGred: (rowid) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/viewJawatanGred/" + rowid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },

    listLantikan: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/listJawatanLantikan", {
                method: 'POST', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    deleteLantikan: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `setting/deleteJawatanLantikan`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
                body: JSON.stringify({data: data}),
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    viewLantikan: (rowid) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/viewJawatanLantikan/" + rowid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },

    listGenerik: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/listJawatanGenerik", {
                method: 'POST', body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    deleteGenerik: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `setting/deleteJawatanGenerik`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
                body: JSON.stringify({data: data}),
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
    viewGenerik: (rowid) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/viewJawatanGenerik/" + rowid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })
        });
    },
}