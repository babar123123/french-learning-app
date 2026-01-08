---
description: How to deploy and update the French Learning App
---

### Initial Deployment
1. Open terminal in the project folder.
2. Run `npm run build` to create the production ready code.
3. Run `npx vercel` to deploy.
4. Follow the prompts (Login, Link Project: Yes, Name: french-learning-app).

### How to push Updates (Future Changes)
Whenever you make changes to the code:
1. Run `npm run build` again.
2. Run `npx vercel --prod` to push the new build to the live site.

// turbo
### Quick Build
npm run build
