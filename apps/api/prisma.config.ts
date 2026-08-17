import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'mysql://root:본인비밀번호@localhost:3306/pizzly',
  },
});