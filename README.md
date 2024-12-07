Got it! Here's an updated **README** without mentioning sentiment analysis and encryption, focusing on the actual features and components of the project:

---

# Serenity AI

**Project Category:** Mobile App & Generative AI

---

## 🌍 Project Goal:

Serenity AI aims to create a mobile app that promotes mental wellness by offering personalized mental health advice, daily affirmations, and gamified tasks. The app also includes a journaling feature, allowing users to reflect on their experiences and track their mood. By providing users with empathetic guidance and a space to track their emotions, the goal is to help individuals improve their mental health and overall well-being.

---

## 🎯 Key Achievements:

### 1. **Planning:**

- Successfully created a detailed project plan outlining the app's features and development timeline.
- Identified and documented the various features, including user authentication, chatbot integration, wellness tracking, journaling, and daily affirmations.

### 2. **Chatbot Development:**

- Developed a personalized mental health chatbot utilizing **GPT-4**.
- Integrated the chatbot with a **vector database** to provide informed and empathetic responses based on user input.
- The chatbot draws from a psychological knowledge base to offer advice that is compassionate and supportive.

### 3. **Daily Affirmations:**

- Implemented a feature that sends daily positive affirmations to users, helping them maintain a positive mindset and reflect on their mental wellness.
- Affirmations are generated from a database of affirmations and sent to the user via notifications.

### 4. **Journaling Feature:**

- Built a journaling feature that allows users to log their thoughts and reflections, promoting mindfulness and self-awareness.
- Users can write journal entries, which are stored and retrieved from the database for future reflection.

---

## 🛠 Backend Architecture:

The backend of Serenity AI is built using **Flask**, a lightweight web framework for Python. The backend manages user authentication, handles CRUD operations for wellness data, and supports the chatbot's interaction with users.

### **Key Components:**

1. **User Authentication (SQL Database):**
   - Users authenticate through an SQL database that stores personal information, including login credentials and wellness data (e.g., daily score, sleep hours, water intake, steps, mood).
   - Users are authenticated based on their email and password, ensuring secure access to their accounts.
2. **Database Interactions (CRUD Operations):**

   - The app uses SQL to store, retrieve, update, and delete user wellness data. This data includes user moods, sleep patterns, water intake, and steps.
   - The journaling feature is integrated into the database, allowing users to store journal entries. These entries can be updated or retrieved via the API.

3. **Mental Health Chatbot (GPT-4 & Vector Database):**
   - The **GPT-4** model, fine-tuned for mental health advice, powers the chatbot. The chatbot responds to users’ queries with empathy and provides mental health advice.
   - The chatbot also accesses a **vector database** that holds psychological approaches to how the assistant should communicate with users. This helps ensure that responses are emotionally supportive and aligned with mental health best practices.

---

## 📡 API Endpoints:

The backend exposes several API endpoints to handle user interactions and data storage. Below are some of the key endpoints in the backend:

### 1. **POST /sign_up**:

- Registers a new user by saving their name, email, and password in the database.
- Returns a success message upon successful registration.

### 2. **POST /check_user**:

- Verifies user credentials by checking the provided email and password against the database.
- Returns user details if the email and password match.

### 3. **GET /affirm**:

- Fetches a random affirmation from the database and returns it to the user.
- This endpoint helps provide daily positive affirmations to users.

### 4. **POST /chat**:

- Sends user input (messages) to the GPT-4-powered chatbot.
- The chatbot responds with empathetic advice, leveraging the vector database to generate contextually relevant responses.

### 5. **POST /add_journal_entry**:

- Allows the user to add a new journal entry.
- Requires the user's email and the journal entry text.
- The entry is stored in the database, allowing the user to reflect on their thoughts.

### 6. **GET /get_journal_entries**:

- Fetches all journal entries for a given user (by email).
- Entries are retrieved from the database in reverse chronological order, allowing users to review their past reflections.

### 7. **PUT /update_journal_entry**:

- Updates an existing journal entry by entry ID.
- Requires the user's email, entry ID, and the updated journal text.
- The updated entry is stored in the database.

### 8. **POST /update_wellness**:

- Updates the user's wellness data (e.g., mood, sleep hours, water intake, steps) in the database.
- The data is sent as a JSON object with the necessary updates.

---

## 🗂 Database Schema:

The project relies on SQL databases to manage user information, wellness data, and journal entries. Below are the tables used in the database:

### **1. `userInfo` Table**:

- Stores user information such as name, email, password, and wellness-related data (e.g., daily score, mood, water intake).
- Columns: `user_id`, `name`, `email`, `password`, `daily_score`, `sleep`, `water`, `steps`, `mood`, `phone_number`, etc.

### **2. `journalEntries` Table**:

- Stores the user's journal entries, with an entry ID, email, entry text, and date.
- Columns: `entry_id`, `email`, `entry_text`, `date`.

### **3. `affirmations` Table**:

- Stores a collection of positive affirmations that the app uses to send daily affirmations to users.
- Columns: `affirmation_id`, `affirmation_text`.

---

## 📈 Analytics & Insights:

The app gathers data on user wellness activities, including mood, sleep, water intake, and steps. This data is used to provide users with personalized insights into their mental and physical health.

---

## 🚀 Future Enhancements:

1. **Advanced Gamification:**

   - Introduce more gamified features to encourage users to complete tasks that improve their mental wellness, such as mindfulness exercises, hydration goals, and fitness challenges.

2. **Community Support:**

   - Enable community features where users can interact with others, share experiences, and support each other in their mental health journeys.

3. **AI-Driven Insights:**
   - Leverage AI to analyze user behavior and provide actionable insights based on their wellness activities, journal entries, and chatbot conversations.

---

## 📂 Backend Repository:

The backend code for Serenity AI can be found on GitHub:  
[Serenity Backend](https://github.com/huziibee/serenity_backend)

---

## 📝 Contributing:

Contributions are welcome! If you want to contribute to the development of Serenity AI, feel free to fork the repository, submit a pull request, or raise an issue if you encounter any bugs.

---

## 🎉 Conclusion:

Serenity AI is an innovative project designed to promote mental wellness through personalized advice, daily affirmations, and journaling. With the integration of GPT-4-powered chatbots and a comprehensive backend, Serenity AI offers users a meaningful and empathetic experience on their mental health journey.

---

This version removes references to sentiment analysis and encryption, as per your instructions. Let me know if you need further adjustments!
