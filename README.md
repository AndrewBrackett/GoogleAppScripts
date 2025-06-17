# GoogleAppScripts
Simple scripts to move files from one place to another

Problem:
Your organization works in Google Workspace. Most files are kept in Google Drive, but most data and analytics operations are now reliant on cloud storage and applications outside the Google Ecosystem. You have a need to either back up files to Google Cloud Storage or move files to Google Cloud Storage as part of an ETL operation getting files to external warehouses/processes.

Goal:
You want a file landing area in Google Drive you control for different business users to deliver files to you. The goal is for other users to drop files into subfolders within your landing, which keeps access control for you and privacy for them. Other users drop versioned or new files into their subfolder in your landing, and you want to perform ETL operations by moving those files to a Cloud Storage Bucket in GCS. You want the process easy to manage, hardended, with the ability to log and trigger notifications.


Solutions:
1. Low Code - No Automation via Google Colab and a few commands
   This option I don't cover in repository files, but it's incredibly simple to mount your drive and move files from Google Drive to Google Cloud Storage instantly ad hoc. No logging, No notifications, no automation.

2. High Code
   Create a service account in your Google Cloud Project
   Turn on all related APIs for Drive, Logging.
   Add your Service account as a storage admin in the project and as a viewer on every file in Drive that needs to be processed
   Write a Python/Javascript script that authenticates to Google Drive and your project, moves files using file Ids
   Script Logs results through the Google Project and triggers notifications.

This option works, but is time intensive and relies on many moving parts.

3. Mid Code
   Google App Scripts is the hero here. Download three scripts in this repository and make a new GAS project at script.google.com
   Have a Google Cloud Project with a bucket you have access to
   Turn on Google Drive API and Logging API
   Build a trigger for your Check_Trigger main function to run daily is GAS.
   Notifications can trigger off your project log to extend the hardened nature of the process

