export default {

    getAllJenis: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `report/get-jenis`, {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })

        });
    },

    getLain: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `report/get-lain`, {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })

        });
    },

    getKategori: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `report/get-kategori`, {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result)
                })

        });
    },

    getCawangan: (data) => {
        // return new Promise((resolve, reject) => {
        //     fetch(global.ipServer + `report/get-cawangan/`+ global.global_id, {
        //         method: 'GET',
        //         headers: {
        //             'x-access-token': global.token
        //         },
        //     })
        //         .then((response) => response.json())
        //         .then((result) => {
        //             return resolve(result)
        //         })
        //
        // });
    },

    getPembaik: (data) => {
        // return new Promise((resolve, reject) => {
        //     fetch(global.ipServer + `report/get-pembaik/`+ global.global_id, {
        //         method: 'GET',
        //         headers: {
        //             'x-access-token': global.token
        //         },
        //     })
        //         .then((response) => response.json())
        //         .then((result) => {
        //             return resolve(result)
        //         })
        //
        // });
    },


}
