import prisma from './prisma.js';
import RoleType from '../common/enums/RoleType.enum.js';

export async function initRoles() {
    for (const roleName of Object.values(RoleType)) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName }
        });
    }
    console.log('Roles inicializados');
}