# Automate Lighthouse Report
This automation, using Puppeteer to automate Lighthouse report generation, ensures consistent and timely performance insights for our application, allowing us to proactively address any issues and maintain optimal performance.

## Installation

Step-by-step instructions to set up the project locally.

1. **Clone the repository:**

   ```sh
   git clone https://github.com/cwmohit/Automate-lighthouse-report-with-puppeteer.git

   cd your-repo

   npm install
   ```

2. **Add .env file:**
   ```sh
    APP_EMAIL=example@gmail.com
    APP_PASSWORD=asdfghjkjhgfds
    SEND_TO_EMAIL=example2@jiraaf.com
    APP_WEBSITE=https://www.example.com/
    APP_NAME=example
    ```

3. **Run the Project:**
    ```sh
        node index.mjs
    ```

3. **Write cron job:**
    ## Create cron.log file in root

    ## Setup
    ```sh
     crontab -e

     30 10 * * * /path/to/your/project/run_lighthouse.sh >> /path/to/your/project/cron.log 2>&1
    ```