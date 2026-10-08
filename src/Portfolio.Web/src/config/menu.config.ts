import { PathEnum, UserRoleEnum } from '@types';

export enum MenuCategory {
  Administrare = 'ADMINISTRARE',
}

export type MenuItemConfig = {
  order: number,
  path: PathEnum,
  icon: string,
  labelKey: string,
  homeDescriptionKey?: string,
  showOnHome: boolean,
  category?: MenuCategory,
  roles?: UserRoleEnum[],
  emails?: string[],
};

export const menuCategoryOrder = [
  MenuCategory.Administrare,
] as const;

export const MENU_CATEGORY_STORAGE_KEY = 'portfolio.selectedMenuCategoryIndex';

export const getStoredMenuCategoryIndex = () => {
  const storedIndex = Number(globalThis.localStorage?.getItem(MENU_CATEGORY_STORAGE_KEY));
  return Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < menuCategoryOrder.length ? storedIndex : 0;
};

export const menuCategoryLabelKeys = {
  [MenuCategory.Administrare]: 'menuCategories.administration',
} as const satisfies Record<MenuCategory, string>;

export const menuItems = [
  { order: 10, path: PathEnum.Home, icon: 'home', labelKey: 'general.home', showOnHome: false },
  {
    order: 30,
    category: MenuCategory.Administrare,
    path: PathEnum.Users,
    icon: 'manage_accounts',
    labelKey: 'general.users',
    homeDescriptionKey: 'home.manageUsersDescription',
    showOnHome: true,
    roles: [UserRoleEnum.Superadmin],
  },
] as const satisfies readonly MenuItemConfig[];

export const orderedMenuItems = [...menuItems].sort((first, second) => first.order - second.order);

export const categorizedMenuItems = menuCategoryOrder.map((category) => ({
  category,
  items: orderedMenuItems.filter((item) => 'category' in item && item.category === category),
}));
