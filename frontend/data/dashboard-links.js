// import { ACCOUNT_TYPE } from './../src/utils/constants';

// export const sidebarLinks = [
//   {
//     id: 1,
//     name: "My Profile",
//     path: "/dashboard/my-profile",
//     icon: "VscAccount",
//   },
//   {
//     id: 2,
//     name: "Dashboard",
//     path: "/dashboard/instructor",
//     type: ACCOUNT_TYPE.INSTRUCTOR,
//     icon: "VscDashboard",
//   },
//   {
//     id: 3,
//     name: "My Courses",
//     path: "/dashboard/my-courses",
//     type: ACCOUNT_TYPE.INSTRUCTOR,
//     icon: "VscVm",
//   },
//   {
//     id: 4,
//     name: "Add Course",
//     path: "/dashboard/add-course",
//     type: ACCOUNT_TYPE.INSTRUCTOR,
//     icon: "VscAdd",
//   },
//   {
//     id: 5,
//     name: "Enrolled Courses",
//     path: "/dashboard/enrolled-courses",
//     type: ACCOUNT_TYPE.STUDENT,
//     icon: "VscMortarBoard",
//   },
//   {
//     id: 6,
//     name: "Purchase History",
//     path: "/dashboard/purchase-history",
//     type: ACCOUNT_TYPE.STUDENT,
//     icon: "VscHistory",
//   },
// ];
import { ACCOUNT_TYPE } from './../src/utils/constants';

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },{
    id: 7,
    name: "Student Analytics",
    path: "/dashboard/analytics",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscGraph",
  },
  // Admin specific links
  {
    id: 8,
    name: "Admin Analytics",
    path: "/dashboard/admin/analytics",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscGraph",
  },
  {
    id: 9,
    name: "Manage Categories",
    path: "/dashboard/admin/categories",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscTag",
  },
];