export default {
    checkEmail: (data) => {
        return new Promise((resolve, reject) => {
            fetch(`${global.ipServer}user/check_email/${data}/${global.global_id}`, {
                headers: {
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    return resolve(data.exist)
                })
        });
    },

    listUser: (data) => {
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "user/list/" + global.global_id, {
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

    deleteUser: (data) => {
        return new Promise((resolve, reject) => {

            fetch(global.ipServer + "user/delete/" + global.global_id, {
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

    viewUser: (rowid) => {
        return new Promise((resolve, reject) => {

            fetch(global.ipServer + "user/view/" + rowid , {
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
