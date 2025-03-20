# GUIDE RUN PROJECT : DEMO SQL INJECTION

### Step 1: Install Required Libraries

sudo apt update<br/>
sudo apt install npm<br/>
npm install express sqlite3 body-parser express-session<br/>
npm install express sqlite3 body-parser express-session --legacy-peer-deps<br/>

### Step 2: Run the Server and Access the Running URL
node server.js


#### Run

<img width="188" alt="image" src="https://github.com/user-attachments/assets/79492161-1184-4487-b9ae-dabda06f9ea8" /><br/>

[^1]: Open url: <mark>http://localhost:3000<br/>

<img width="641" alt="image" src="https://github.com/user-attachments/assets/b6774881-94b8-4cea-9c36-b95a2cac3ae2" /><br/>

[^2]: Try username: <mark>user</mark>, password: <mark>password</mark><br/>
<img width="640" alt="image" src="https://github.com/user-attachments/assets/5cfa9b19-03c3-47a0-b457-a756f809239a" /><br/>

[^3]: Try username: <mark>admin' OR 1=1 -- </mark>, password: <mark>password</mark><br/>
<img width="639" alt="image" src="https://github.com/user-attachments/assets/9de78002-c400-4470-88d8-3259dffe513b" /><br/>
