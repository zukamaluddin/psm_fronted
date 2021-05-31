export default {

    listBranch: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "mesin/list/" + global.global_id, {
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

    getAllBranches: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + `branch/get-all-branches/${global.global_id}`, {
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

    deleteBranch: (data) => {
        return new Promise((resolve, reject) => {

            fetch(global.ipServer + `mesin/delete`, {
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

    viewBranch: (rowid) => {
        return new Promise((resolve, reject) => {

            fetch(global.ipServer + "mesin/view/" + rowid, {
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
    checkBranch: (code) => {
        return new Promise((resolve, reject) => {

            fetch(global.ipServer + "branch/check_branch/" + code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    return resolve(result.exist)
                })

        });
    },


}
