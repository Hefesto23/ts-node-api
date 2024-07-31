
import { Role } from '@prisma/client';

// Permissões de cada cargo do sistema
const allRoles = {
  [Role.USER]: [],
  [Role.ADMIN]: ['lerUsuarios', 'editarUsuarios'],
  [Role.FINANCEIRO]: ['lerUsuarios'],
  [Role.MARKETING]: ['lerUsuarios'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
