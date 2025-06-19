Spy Cat Agency Frontend
React frontend application for managing Spy Cats, including creation, listing, updating, and deletion, integrated with the Spy Cat Agency backend API.

Prerequisites
Node.js 16+ (includes npm)

Git (optional, for cloning)

Access to running backend API (default at http://localhost:8000)

Step-by-step Setup and Run Guide
1. Clone the repository (if applicable)
bash
Copy
Edit
git clone https://github.com/your-username/spy-cat-frontend.git
cd spy-cat-frontend
If you don’t have a repo yet, create your project folder and place the frontend files inside.

2. Install dependencies
Make sure you have package.json and package-lock.json or yarn.lock in the project root.

Run:

bash
Copy
Edit
npm install
or if you use yarn:

bash
Copy
Edit
yarn install
3. Configure environment (optional)
If your backend API URL differs from the default http://localhost:8000, update API base URLs in the frontend source code accordingly.

4. Start the development server
Run:

bash
Copy
Edit
npm run dev
or

bash
Copy
Edit
yarn dev
The app will be accessible at:

arduino
Copy
Edit
http://localhost:3000
5. Use the application
Add new Spy Cats via the form.

View, edit salary, and delete existing Spy Cats in the list.

The frontend communicates with the backend API for CRUD operations.
