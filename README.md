**Overview:**
Pizza Police is a revolutionary ticket management system designed to tackle pizza-related crimes reported by pizza enthusiasts worldwide. Users can submit reports on various pizza mishaps, ranging from missing toppings to pineapple infiltrations. Admins can efficiently manage these reports, resolve issues, and engage with users through comments. This system aims to maintain pizza purity and uphold the integrity of this beloved dish.

**Key Features:**

1. **Anonymous Reporting:** Users can submit reports without the need for authentication, ensuring seamless reporting for all pizza enthusiasts.
2. **Admin Dashboard:** Admins have access to a comprehensive dashboard displaying all reported pizza crimes, allowing them to efficiently manage and prioritize tasks.
3. **Resolve Feature:** Admins can mark reported issues as resolved, providing closure to users and maintaining transparency in issue resolution.
4. **Comment Feature:** Users and admins can engage in dialogue by posting comments on reported incidents, fostering community interaction and feedback.
5. **Urgency Level:** Admins can assign urgency levels to reported issues, enabling them to prioritize and address critical pizza crimes promptly.

**Use Cases:**

1. **User Reporting:** Jim, a pizza aficionado, notices a missing slice in his pizza delivery. He uses Pizza Police to report the incident, providing details such as location, description, and urgency level.
2. **Admin Management:** Sarah, an admin, logs into the system to review incoming reports. She prioritizes urgent cases, resolves resolved issues, and engages with users through comments to provide updates and gather additional information.
3. **Issue Resolution:** After investigating a reported incident, Michael, an admin, marks the issue as resolved on the dashboard, providing closure to the user and updating the status of the report.

**Pages and Features:**

* **Home Page:** Users can access the reporting form to submit pizza crime reports.
* **Admin Dashboard:** Admins can view, manage, and resolve reported incidents, assign urgency levels, and engage with users through comments.

How to run this project:

First run the development server:

```
npm install

npm run dev
```

and open up [http://localhost:3000/](http://localhost:3000/) to see the result of the pages.

**Purpose of each file in this project:**

1. **index.js:**

   * **Purpose:** This file serves as the entry point of the application and renders the main layout of the home page.
   * **Functionalities:**
     * Imports and renders the `Home` component, which contains the main content of the home page.
     * Includes a reporting form component (`ReportPizzaForm`) for users to submit pizza-related incidents.
2. **home.js:**

   * **Purpose:** This file contains the components and layout for the home page of the Pizza Police application.
   * **Functionalities:**
     * Defines the structure of the home page layout using HTML elements and CSS classes.
     * Renders hero sections with images and descriptions to showcase the features and benefits of the Pizza Police platform.
     * Includes a reporting form component (`ReportPizzaForm`) for users to submit new pizza-related incidents.
3. **ReportPizzaForm.js:**

   * **Purpose:** This file defines the reporting form component, allowing users to report pizza-related incidents.
   * **Functionalities:**
     * Implements a form with input fields for users to provide details such as their name, date of incident, location, description, and urgency level.
     * Handles form submission by sending a POST request to the server-side API (`/api/reportForm`) to create a new ticket.
4. **individualReport.js:**

   * **Purpose:** This file contains the components and layout for the admin dashboard (AdminView), where administrators can manage reported pizza incidents.
   * **Functionalities:**
     * Fetches a list of reported incidents from the server-side API (`/api/reportForm`) and displays them in a list format.
     * Allows administrators to resolve reported incidents by sending DELETE requests to the server-side API.
     * Provides functionality for administrators to edit urgency levels of reported incidents by sending PUT requests to the server-side API.
     * Enables administrators to post comments on reported incidents by sending POST requests to the server-side API.
5. **NavBar.js:**

   * **Purpose:** This file defines the navigation bar component displayed at the top of the application.
   * **Functionalities:**
     * Renders navigation links for different pages of the application, such as the home page and admin dashboard.
     * Handles user authentication status and displays sign-in/sign-out buttons accordingly.
     * Uses the `useSession` hook from NextAuth to manage user authentication.
6. **database.mjs:**

   * **Purpose:** This file contains functions and utilities for interacting with the database to manage pizza-related incidents.
   * **Functionalities:**
     * Defines functions for opening, reading, and saving data to the database file (`db.json`).
     * Provides functions for CRUD operations (Create, Read, Update, Delete) on pizza incident records stored in the database.
     * Implements functions for creating, updating, deleting, and fetching pizza incident records.
     * I chose to work with a local db.json object because:
       * Working with local files is often simpler and faster than interacting with a cloud-based database like Firestore. There is no network latency involved, and data operations are typically faster since they are performed locally.
       * Cost Considerations: If you're concerned about costs, using local files can be more cost-effective, especially for smaller projects or during development and testing phases. Firestore, being a cloud-based service, may incur ongoing costs based on usage and storage.
7. successMessage.js: Renders a success message component when a form is submitted successfully, utilized in home.js

## Areas for Improvement:

#### Database operations

Although I'm more familiar with Firebase, I felt that some of the operations used to retriever, update, or append entries weren't that similar to each other, which forced me to use inefficient methods (for the time being) to make my APIs work. For example, in my 'editComment' function in database.mjs (line 126), I'm trying to update the comment in case if an admin wants to change relevant information or fix mistakes. Initially I had attempted to embed sql in my functions, but it wasn't consistent with the documentation and wasn't sure if supabase had depracated some of the embedded sql functions. 

Instead, I chose to fetch and temporarily store all the comments for that specific ticketID, filtered out for the correct commentID that needs to be edited, and then updated the comment along with it's updated timestamp and the user who is editing the comments (every admin can edit any comment even if they didn't write it) within the stored array of comment objects. I then updated the entire comments column for that specific ticketID. This is an expensive read and write operation, as supposed to querying the list of columns and updating a single comment object. 

In the future I plan on creating my own sql functions in the SQL Editor in Supabase, and calling them in my database file to avoid redundant read/write operations.

#### Project Planning in Sprints

Working on asking more relevant questions to the team. After I built this app I realized that although the requirements may have seemed clear to me in the beginning, I realized that the end product may not be exactly what was in the team's minds. If I were to join the team I would mark certain milestones within the project, and check in with the team to see if it meets their expectations.

#### Abstraction

A lot of the types of requests I had to build out were very simialr in nature, and I would like to explore the opportunity to abstract these requests so that it can be accessible to multiple features.

#### **Leveraging NextJS Tools**

I would like to leverage NextJS's dynamic routing to represent a larger view of each ticket with more customized options. This would allow for more detailed ticket reports, as well as allow the users and admins alike to bucket each ticket into it's own categories.
