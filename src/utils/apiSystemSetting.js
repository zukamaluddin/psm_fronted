export default {
    listPentadbiran: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            fetch(global.ipServer + "setting/listJawatanPentadbiran/", {
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
}