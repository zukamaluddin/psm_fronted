import {redirectLogout} from "../index";

export default {

    list: (data, prop) => {
        return new Promise((resolve, reject) => {
            fetch(`${global.ipServer}setting/list_category/${global.global_id}?token=${global.token}`, {
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
                    console.log("-------------------------------------------------")
                    console.log(resolve(result))
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
