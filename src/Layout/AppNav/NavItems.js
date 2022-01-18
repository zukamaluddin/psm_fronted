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

export const userRepairerNav = [
    {
        icon: 'pe-7s-tools',
        label: 'Lantikan',
        to: '#/repairer/list',
    }
]

export const SettingNav = [
    {
        icon: 'pe-7s-tools',
        label: 'Tetapan',
        content: [{
            label: 'Jawatan Pentadbiran',
            to: '#/setting/pentadbiran',
        },
        {
            label: 'Jawatan Gred',
            to: '#/setting/gred',
        },
        {
            label: 'Lantikan',
            to: '#/setting/lantikan',
        },
        {
            label: 'Jawatan Generik',
            to: '#/setting/generik',
        }]
    }
]

export const lantikanNav = [
    {
        icon: 'pe-7s-tools',
        label: 'Lantikan',
        content: [{
            label: 'Senarai',
            to: '#/lantikan/list',
        },
        {
            label: 'Lantikan',
            to: '#/lantikan/register',
        }]
    }
]

export const DashboardNav = [
    {
        icon: 'pe-7s-graph2',
        label: 'Dashboard',
        to: '#/dashboard/list',

    }
]

export const Branch = [
    {
        icon: 'pe-7s-culture',
        label: 'Tugasan',
        to: '#/branch/list'
    }
];

export const UserManagement = [
    {
        icon: 'pe-7s-id',
        label: 'Pengurusan Pengguna',
        to: '#/user/list'
    }
];
