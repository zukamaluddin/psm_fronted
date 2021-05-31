import {redirectLogout} from "../index";

export default {

    checkROC: (data, id, prop) => {
        return new Promise((resolve, reject) => {
            fetch(`${global.ipServer}owner/checkROC/${data}/${global.global_id}?token=${global.token}&id=${id}`, {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        redirectLogout(response.status, prop);
                        return [];

                    }
                    // return response.json()
                })
                .then((data) => {
                    return resolve(data.status);

                })
        });
    },

    list: (data, prop) => {
        return new Promise((resolve, reject) => {
            fetch(`${global.ipServer}owner/list/${global.global_id}?token=${global.token}`, {
                method: 'POST',
                body: data,
                headers: {
                    'x-access-token': global.token
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        redirectLogout(response.status, prop);
                        return [];

                    }
                    // return response.json()
                })
                .then((result) => {
                    return resolve(result)
                })

        });
    },

    delete: (data, prop) => {
        return new Promise((resolve, reject) => {

            fetch(`${global.ipServer}owner/delete/${global.global_id}/${global.global_id}?token=${global.token}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token,
                },
                body: JSON.stringify({data: data}),
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        redirectLogout(response.status, prop);
                        return [];

                    }
                    // return response.json()
                })
                .then((result) => {
                    return resolve(result)
                })

        });
    },

    updateAPI: (data, id, prop) => {
        return new Promise((resolve, reject) => {
            fetch(`${global.ipServer}owner/update/${id}/${global.global_id}?token=${global.token}`, {

                method: 'POST',
                body: data,
                headers: {
                    'x-access-token': global.token
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        redirectLogout(response.status, prop);
                        return [];

                    }
                    // return response.json()
                })
                .then((result) => {
                    return resolve(result)
                })

        });
    },

}
