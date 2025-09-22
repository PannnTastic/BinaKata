#!/bin/sh
# Ensure Prisma schema is applied on container start
npx prisma db push || true
exec npx next start -p 3000
