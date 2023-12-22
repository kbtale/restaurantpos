import Vue from 'vue';
import Cookies from 'js-cookie';
import VueRouter from 'vue-router';
import axios from 'axios';

import AuthLayout from '@/Layouts/Auth';
import AdminLayout from '@/Layouts/Admin';
import PrintLayout from '@/Layouts/Print';
import PublicLayout from '@/Layouts/Public';

import AuthLoginPage from '@/Views/Auth/Login';
import AuthRegisterPage from '@/Views/Auth/Register';
import AuthRecoverPage from '@/Views/Auth/Recover';
import AuthResetPage from '@/Views/Auth/Reset';

import AdminHomePage from '@/Views/Admin/Home';
import AdminDashboardPage from '@/Views/Admin/Dashboard';

import AdminSaleList from '@/Views/Admin/Sales/List';
import AdminSaleView from '@/Views/Admin/Sales/View';

import AdminFoodCategoriesList from '@/Views/Admin/Food-categories/List';
import AdminFoodCategoriesNew from '@/Views/Admin/Food-categories/New';
import AdminFoodCategoriesEdit from '@/Views/Admin/Food-categories/Edit';

import AdminFoodItemList from '@/Views/Admin/Food-items/List';
import AdminFoodItemNew from '@/Views/Admin/Food-items/New';
import AdminFoodItemEdit from '@/Views/Admin/Food-items/Edit';

import AdminModifierList from '@/Views/Admin/Modifiers/List';
import AdminModifierNew from '@/Views/Admin/Modifiers/New';
import AdminModifierEdit from '@/Views/Admin/Modifiers/Edit';

import AdminIngredientList from '@/Views/Admin/Ingredients/List';
import AdminIngredientNew from '@/Views/Admin/Ingredients/New';
import AdminIngredientEdit from '@/Views/Admin/Ingredients/Edit';

import AdminExpenseTypeList from '@/Views/Admin/Expense-types/List';
import AdminExpenseTypeNew from '@/Views/Admin/Expense-types/New';
import AdminExpenseTypeEdit from '@/Views/Admin/Expense-types/Edit';

import AdminExpenseList from '@/Views/Admin/Expenses/List';
import AdminExpenseNew from '@/Views/Admin/Expenses/New';
import AdminExpenseEdit from '@/Views/Admin/Expenses/Edit';

import AdminUsersList from '@/Views/Admin/Users/List';
import AdminUsersNew from '@/Views/Admin/Users/New';
import AdminUsersEdit from '@/Views/Admin/Users/Edit';

import AdminUserRolesList from '@/Views/Admin/User-roles/List';
import AdminUserRolesNew from '@/Views/Admin/User-roles/New';
import AdminUserRolesEdit from '@/Views/Admin/User-roles/Edit';

import AdminCustomerList from '@/Views/Admin/Customers/List';
import AdminCustomerNew from '@/Views/Admin/Customers/New';
import AdminCustomerEdit from '@/Views/Admin/Customers/Edit';

import AdminOverallReport from '@/Views/Admin/Reports/Overall';
import AdminExpenseReport from '@/Views/Admin/Reports/Expense';
import AdminTaxReport from '@/Views/Admin/Reports/Tax';
import AdminStockAlertReport from '@/Views/Admin/Reports/Stock-alerts';

import AdminImportExport from '@/Views/Admin/Import-exports/Index';

import AdminServiceTableList from '@/Views/Admin/Service-tables/List';
import AdminServiceTableNew from '@/Views/Admin/Service-tables/New';
import AdminServiceTableEdit from '@/Views/Admin/Service-tables/Edit';

import AdminPaymentMethodList from '@/Views/Admin/Payment-methods/List';
import AdminPaymentMethodNew from '@/Views/Admin/Payment-methods/New';
import AdminPaymentMethodEdit from '@/Views/Admin/Payment-methods/Edit';

import AdminBackupAndRestore from '@/Views/Admin/Backup/Index';

import AdminSettingsIndex from '@/Views/Admin/Settings/Index';
import AdminSettingsGeneral from '@/Views/Admin/Settings/General';
import AdminSettingsAppearance from '@/Views/Admin/Settings/Appearance';
import AdminSettingsLocalization from '@/Views/Admin/Settings/Localization';
import AdminSettingsAuthentication from '@/Views/Admin/Settings/Authentication';
import AdminSettingsOutgoingMail from '@/Views/Admin/Settings/Outgoing-mail';
import AdminSettingsCaptcha from '@/Views/Admin/Settings/Captcha';
import AdminSettingsTax from '@/Views/Admin/Settings/Tax';
import AdminSettingsCurrency from '@/Views/Admin/Settings/Currency';

import AdminLanguageList from '@/Views/Admin/Languages/List';
import AdminLanguageNew from '@/Views/Admin/Languages/New';
import AdminLanguageEdit from '@/Views/Admin/Languages/Edit';

import AccountPage from '@/Views/Account/Index';

import KitchenDisplay from '@/Views/Public/kitchenDisplay';
import Pos from '@/Views/Public/Pos';
import SalePrint from '@/Views/Print/Sale';

import DashboardNotFoundPage from '@/Views/Admin/Error/Not-found';
import PageNotFoundPage from '@/Views/Error/Not-found';

Vue.use(VueRouter);

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        component: AuthLoginPage,
        meta: { middleware: 'guest' },
      },
      {
        path: 'register',
        component: AuthRegisterPage,
        meta: { middleware: ['guest', 'register'] },
      },
      {
        path: 'recover',
        component: AuthRecoverPage,
        meta: { middleware: 'guest' },
      },
      {
        path: 'reset/:token',
        component: AuthResetPage,
        meta: { middleware: 'guest' },
      },
    ],
  },
  {
    path: '/print',
    component: PrintLayout,
    meta: { middleware: 'auth', gate: null },
    children: [
      {
        path: 'sale/:uuid',
        component: SalePrint,
        meta: { middleware: 'auth', gate: null },
      },
    ],
  },
  {
    path: '/',
    component: PublicLayout,
    redirect: '/admin',
    meta: { middleware: 'auth', gate: null },
    children: [
      {
        path: 'account',
        component: AccountPage,
        meta: { middleware: 'auth', gate: null },
      },
      {
        path: 'pos/:uuid?',
        component: Pos,
        meta: { middleware: 'auth', gate: 'pos_portal' },
      },
      {
        path: 'kitchen-display',
        component: KitchenDisplay,
        meta: { middleware: 'auth', gate: 'kitchen_portal' },
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: 'admin/home',
    meta: { middleware: 'auth', gate: null },
    children: [
      {
        path: 'home',
        component: AdminHomePage,
        meta: { middleware: 'auth', gate: null },
      },
      {
        path: 'dashboard',
        component: AdminDashboardPage,
        meta: { middleware: 'auth', gate: 'dashboard_access' },
      },

      {
        path: 'sales',
        component: AdminSaleList,
        meta: { middleware: 'auth', gate: 'manage_sales' },
      },
      {
        path: 'sales/:uuid/view',
        component: AdminSaleView,
        meta: { middleware: 'auth', gate: 'manage_sales' },
      },
      {
        path: 'categories',
        component: AdminFoodCategoriesList,
        meta: { middleware: 'auth', gate: 'manage_food_categories' },
      },
      {
        path: 'categories/new',
        component: AdminFoodCategoriesNew,
        meta: { middleware: 'auth', gate: 'manage_food_categories' },
      },
      {
        path: 'categories/:id/edit',
        component: AdminFoodCategoriesEdit,
        meta: { middleware: 'auth', gate: 'manage_food_categories' },
      },
      {
        path: 'products',
        component: AdminFoodItemList,
        meta: { middleware: 'auth', gate: 'manage_food_items' },
      },
      {
        path: 'products/new',
        component: AdminFoodItemNew,
        meta: { middleware: 'auth', gate: 'manage_food_items' },
      },
      {
        path: 'products/:uuid/edit',
        component: AdminFoodItemEdit,
        meta: { middleware: 'auth', gate: 'manage_food_items' },
      },
      {
        path: 'modifiers',
        component: AdminModifierList,
        meta: { middleware: 'auth', gate: 'manage_modifiers' },
      },
      {
        path: 'modifiers/new',
        component: AdminModifierNew,
        meta: { middleware: 'auth', gate: 'manage_modifiers' },
      },
      {
        path: 'modifiers/:id/edit',
        component: AdminModifierEdit,
        meta: { middleware: 'auth', gate: 'manage_modifiers' },
      },
      {
        path: 'ingredients',
        component: AdminIngredientList,
        meta: { middleware: 'auth', gate: 'manage_ingredients' },
      },
      {
        path: 'ingredients/new',
        component: AdminIngredientNew,
        meta: { middleware: 'auth', gate: 'manage_ingredients' },
      },
      {
        path: 'ingredients/:id/edit',
        component: AdminIngredientEdit,
        meta: { middleware: 'auth', gate: 'manage_ingredients' },
      },
      // expenses
      {
        path: 'expense-types',
        component: AdminExpenseTypeList,
        meta: { middleware: 'auth', gate: 'manage_expense_types' },
      },
      {
        path: 'expense-types/new',
        component: AdminExpenseTypeNew,
        meta: { middleware: 'auth', gate: 'manage_expense_types' },
      },
      {
        path: 'expense-types/:uuid/edit',
        component: AdminExpenseTypeEdit,
        meta: { middleware: 'auth', gate: 'manage_expense_types' },
      },
      {
        path: 'expenses',
        component: AdminExpenseList,
        meta: { middleware: 'auth', gate: 'manage_expenses' },
      },
      {
        path: 'expenses/new',
        component: AdminExpenseNew,
        meta: { middleware: 'auth', gate: 'manage_expenses' },
      },
      {
        path: 'expenses/:uuid/edit',
        component: AdminExpenseEdit,
        meta: { middleware: 'auth', gate: 'manage_expenses' },
      },
      //People
      {
        path: 'users',
        component: AdminUsersList,
        meta: { middleware: 'auth', gate: 'manage_users' },
      },
      {
        path: 'users/new',
        component: AdminUsersNew,
        meta: { middleware: 'auth', gate: 'manage_users' },
      },
      {
        path: 'users/:id/edit',
        component: AdminUsersEdit,
        meta: { middleware: 'auth', gate: 'manage_users' },
      },

      {
        path: 'user-roles',
        component: AdminUserRolesList,
        meta: { middleware: 'auth', gate: 'manage_user_roles' },
      },
      {
        path: 'user-roles/new',
        component: AdminUserRolesNew,
        meta: { middleware: 'auth', gate: 'manage_user_roles' },
      },
      {
        path: 'user-roles/:id/edit',
        component: AdminUserRolesEdit,
        meta: { middleware: 'auth', gate: 'manage_user_roles' },
      },

      {
        path: 'customers',
        component: AdminCustomerList,
        meta: { middleware: 'auth', gate: 'manage_customers' },
      },
      {
        path: 'customers/new',
        component: AdminCustomerNew,
        meta: { middleware: 'auth', gate: 'manage_customers' },
      },
      {
        path: 'customers/:uuid/edit',
        component: AdminCustomerEdit,
        meta: { middleware: 'auth', gate: 'manage_customers' },
      },

      //reports
      {
        path: 'overall-report',
        component: AdminOverallReport,
        meta: { middleware: 'auth', gate: 'overall_report' },
      },
      {
        path: 'tax-report',
        component: AdminTaxReport,
        meta: { middleware: 'auth', gate: 'tax_report' },
      },
      {
        path: 'expense-report',
        component: AdminExpenseReport,
        meta: { middleware: 'auth', gate: 'expense_report' },
      },
      {
        path: 'stock-alerts',
        component: AdminStockAlertReport,
        meta: { middleware: 'auth', gate: 'stock_alerts' },
      },
      //advance
      {
        path: 'imports-exports',
        component: AdminImportExport,
        meta: { middleware: 'auth', gate: 'import_exports' },
      },
      {
        path: 'service-tables',
        component: AdminServiceTableList,
        meta: { middleware: 'auth', gate: 'manage_service_tables' },
      },
      {
        path: 'service-tables/new',
        component: AdminServiceTableNew,
        meta: { middleware: 'auth', gate: 'manage_service_tables' },
      },
      {
        path: 'service-tables/:id/edit',
        component: AdminServiceTableEdit,
        meta: { middleware: 'auth', gate: 'manage_service_tables' },
      },
      {
        path: 'Payment-methods',
        component: AdminPaymentMethodList,
        meta: { middleware: 'auth', gate: 'manage_payment_methods' },
      },
      {
        path: 'Payment-methods/new',
        component: AdminPaymentMethodNew,
        meta: { middleware: 'auth', gate: 'manage_payment_methods' },
      },
      {
        path: 'Payment-methods/:id/edit',
        component: AdminPaymentMethodEdit,
        meta: { middleware: 'auth', gate: 'manage_payment_methods' },
      },
      {
        path: 'backup',
        component: AdminBackupAndRestore,
        meta: { middleware: 'auth', gate: 'database_backup' },
      },
      {
        path: 'settings',
        component: AdminSettingsIndex,
        meta: { middleware: 'auth', gate: null },
      },
      {
        path: 'settings/general',
        component: AdminSettingsGeneral,
        meta: { middleware: 'auth', gate: 'general_configuration' },
      },

      {
        path: 'settings/appearance',
        component: AdminSettingsAppearance,
        meta: { middleware: 'auth', gate: 'appearance_configuration' },
      },
      {
        path: 'settings/localization',
        component: AdminSettingsLocalization,
        meta: { middleware: 'auth', gate: 'localization_configuration' },
      },
      {
        path: 'settings/authentication',
        component: AdminSettingsAuthentication,
        meta: { middleware: 'auth', gate: 'authentication_configuration' },
      },
      {
        path: 'settings/outgoing-mail',
        component: AdminSettingsOutgoingMail,
        meta: { middleware: 'auth', gate: 'outgoing_mail_configuration' },
      },
      {
        path: 'settings/captcha',
        component: AdminSettingsCaptcha,
        meta: { middleware: 'auth', gate: 'captcha_configuration' },
      },

      {
        path: 'settings/tax',
        component: AdminSettingsTax,
        meta: { middleware: 'auth', gate: 'tax_configuration' },
      },
      {
        path: 'settings/currency',
        component: AdminSettingsCurrency,
        meta: { middleware: 'auth', gate: 'currency_configuration' },
      },

      {
        path: 'languages',
        component: AdminLanguageList,
        meta: { middleware: 'auth', gate: 'manage_languages' },
      },
      {
        path: 'languages/new',
        component: AdminLanguageNew,
        meta: { middleware: 'auth', gate: 'manage_languages' },
      },
      {
        path: 'languages/:id/edit',
        component: AdminLanguageEdit,
        meta: { middleware: 'auth', gate: 'manage_languages' },
      },

      {
        path: '*',
        component: DashboardNotFoundPage,
        meta: { middleware: 'auth', gate: null },
      },
    ],
  },

  { path: '*', component: PageNotFoundPage },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeResolve((to, from, next) => {
  if (to.meta.middleware) {
    if (to.meta.middleware.includes('auth') && !localStorage.getItem('token')) {
      Cookies.set('intended_url', to.path);
      next('/auth/login');
    } else if (
      to.meta.middleware.includes('register') &&
      !window.app.register
    ) {
      next('/auth/login');
    } else if (
      localStorage.getItem('token') &&
      to.meta.middleware.includes('guest')
    ) {
      next();
    } else if (
      to.meta.middleware.includes('auth') &&
      localStorage.getItem('token')
    ) {
      axios
        .post(route('auth.check'), { gate: to.meta.gate })
        .then((response) => {
          if (!response.data.authorized) {
            Cookies.set('intended_url', to.path);
            next('/auth/login');
          } else if (!to.meta.gate) {
            next();
          } else if (response.data.gate_pass) {
            next();
          } else {
            window.location.href = window.app.url + '/';
          }
        });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
