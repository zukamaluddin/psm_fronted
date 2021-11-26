import {userRepairerAccess,userOwnerAccess,EquipmentNavAccess} from "./acessLevel"
export const MainNav = [
    {
        icon: 'pe-7s-browser',
        label: 'Pages',
        content: [
            {
                label: 'Login',
                to: '#/pages/login',
            },
            {
                label: 'Login Boxed',
                to: '#/pages/login-boxed',
            },
            {
                label: 'Register',
                to: '#/pages/register',
            },
            {
                label: 'Register Boxed',
                to: '#/pages/register-boxed',
            },
            {
                label: 'Forgot Password',
                to: '#/pages/forgot-password',
            },
            {
                label: 'Forgot Password Boxed',
                to: '#/pages/forgot-password-boxed',
            },
        ],
    },
];

// export const userOwnerNav = userOwnerAccess()

export const userRepairerNav = [
    {
        icon: 'pe-7s-tools',
        label: 'Surat Lantikan',
        // add: true,
        // delete: true,
        // update: true,
        content: [{
            label: 'Senarai',
            to: '#/repairer/list',

        }]
    }
]

export const DashboardNav = [
    {
        icon: 'pe-7s-graph2',
        label: 'Dashboard',
        to: '#/repairer/list',
        // add: true,
        // delete: true,
        // update: true,
        // content: [{
        //     label: 'Senarai',
        //     to: '#/repairer/list',
        //
        // }]
    }
]



let userContent = function () {
    if (localStorage.getItem('position') === "HQ"){
        return [
            {
                label: 'Senarai',
                to: '#/user/list',
            },

        ]
    }else{
        return [
            {
                label: 'Pendaftaran',
                to: '#/user/register',
            },
            {
                label: 'Senarai',
                to: '#/user/list',
            },

        ]
    }

}

let branchContent = function () {

    if (localStorage.getItem('position') === "HQ"){
        return [
            {
                label: 'Senarai',
                to: '#/branch/list',
            },

        ]
    }else{
        return [
            {
                label: 'Pendaftaran',
                to: '#/branch/register',
            },
            {
                label: 'Senarai',
                to: '#/branch/list',
            },

        ]
    }

};

export const Branch = [
    {
        icon: 'pe-7s-culture',
        label: 'Tugasan',
        content: branchContent()
    }
];

export const UserManagement = [
    {
        icon: 'pe-7s-id',
        label: 'Pengurusan Pengguna',
        content: userContent()
    }
];



let reportContent = function () {
    if (localStorage.getItem('position') === "HQ") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Laporan',
                content: [
                    {
                        label: 'Harian',
                        to: '#/report/daily',
                    },
                    {
                        label: 'Bulanan',
                        to: '#/report/monthly',
                    },
                    {
                        label: 'Tahunan',
                        to: '#/report/yearly',
                    },{
                        label: 'Alatan',
                        to: '#/report/alatan',
                    },
                    {
                        label: 'Penentusahan Pembaik',
                        to: '#/report/tentusahan',
                    },
                    {
                        label: 'Penentusahan Alat',
                        to: '#/report/serapan',
                    },{
                        label: 'Carian Maklumat Tentusah',
                        to: '#/report/carian',
                    },{
                        label: 'Carian Maklumat Inventori',
                        to: '#/report/maklumat',
                    },

                ]
            }];
    }
    else if (localStorage.getItem('position') === "Manager Cawangan") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Laporan',
                content: [
                    {
                        label: 'Harian',
                        to: '#/report/daily',
                    },
                    {
                        label: 'Bulanan',
                        to: '#/report/monthly',
                    },
                    {
                        label: 'Tahunan',
                        to: '#/report/yearly',
                    },{
                        label: 'Alatan',
                        to: '#/report/alatan',
                    },{
                        label: 'Carian Maklumat Tentusah',
                        to: '#/report/carian',
                    },{
                        label: 'Carian Maklumat Inventori',
                        to: '#/report/maklumat',
                    },

                ]
            }];
    }
    else if (localStorage.getItem('position') === "Staf") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Laporan',
                content: [
                    {
                        label: 'Harian',
                        to: '#/report/daily',
                    },
                    {
                        label: 'Bulanan',
                        to: '#/report/monthly',
                    },
                    {
                        label: 'Tahunan',
                        to: '#/report/yearly',
                    },{
                        label: 'Alatan',
                        to: '#/report/alatan',
                    },{
                        label: 'Carian Maklumat Tentusah',
                        to: '#/report/carian',
                    },{
                        label: 'Carian Maklumat Inventori',
                        to: '#/report/maklumat',
                    },

                ]
            }];
    }
    else if (localStorage.getItem('position') === "Kerani Cawangan") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Laporan',
                content: [
                    {
                        label: 'Harian',
                        to: '#/report/daily',
                    },
                    {
                        label: 'Bulanan',
                        to: '#/report/monthly',
                    },
                    {
                        label: 'Tahunan',
                        to: '#/report/yearly',
                    },{
                        label: 'Alatan',
                        to: '#/report/alatan',
                    },{
                        label: 'Carian Maklumat Tentusah',
                        to: '#/report/carian',
                    },{
                        label: 'Carian Maklumat Inventori',
                        to: '#/report/maklumat',
                    },

                ]
            }];
    }
    else if (localStorage.getItem('position') === "Manager Negeri") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Laporan',
                content: [
                    {
                        label: 'Harian',
                        to: '#/report/daily',
                    },
                    {
                        label: 'Bulanan',
                        to: '#/report/monthly',
                    },
                    {
                        label: 'Tahunan',
                        to: '#/report/yearly',
                    },{
                        label: 'Alatan',
                        to: '#/report/alatan',
                    },{
                        label: 'Carian Maklumat Tentusah',
                        to: '#/report/carian',
                    },{
                        label: 'Carian Maklumat Inventori',
                        to: '#/report/maklumat',
                    },

                ]
            }];
    }
    else if (localStorage.getItem('position') === "KPDNHEP") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Laporan',
                content: [
                    {
                        label: 'Laporan Penentusahan Alat',
                        to: '#/report/serapan',
                    },

                ]
            }];
    }

};

// export const ReportNav = reportContent();

let settingContent = function () {
    if (localStorage.getItem('position') === "HQ") {
        return [
            {
                icon: 'pe-7s-news-paper',
                label: 'Tetapan',
                content: [
                    {
                        label: 'Caj Tentusah',
                        to: '#/setting/Caj',
                    },
                    // {
                    //     label: 'Senarai Harga',
                    //     to: '#/setting/list',
                    // },

                ]
            }];
    }

};

export const SettingNav = settingContent();

