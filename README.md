1. Click the “Use this template” button and choose “Create a new repository” from the dropdown
2. In “Create a new repository” page, choose your desired Owner and give the new repository a name (e.g. “WAYWO”). Leave “Include all branches” unticked
3. Choose whether it should be public or private and click “Create repository”
4. Go to the [Keel console](https://console.keel.so/start)
5. Select “New Git project”
6. On the Create project page, click “Connect with Github” to connect your repo
7. Search for the repo you just created in your organisation - make sure you’re searching in the organisation you used. If you can’t see the right organisation, go to “Edit permissions” to add it
8. Select the project name. On the Almost there page click “Create project”
9. You’ll get a confirmation page. Now click “Open project”
10. The project will now build and do an initial commit. This can take a minute or two! 
![Screenshot 2024-07-25 at 18 33 16](https://github.com/user-attachments/assets/5d0ba3c5-799f-49a2-a614-05f7177a7c9a)
![Screenshot 2024-07-25 at 18 33 25](https://github.com/user-attachments/assets/23365fa9-3faf-4920-93f3-a50792c35b76)


Now let’s set up the Slack App:

1. In the [Slack API](https://api.slack.com/apps/): click “Create new app” and then the “From scratch” option
2. Give the app a name it and select the Slack workspace where you want it to be. If you don’t see your workspace, choose “Sign into a different workspace” to connect it
3. Click “Create App”
4. It’ll take you to the Basic Information page
5. Go to the OAuth & Permissions section
6. Under Scopes and Bot Token Scopes click “Add an OAuth Scope” each time to add the following four scopes:
   - channels:read
   - groups:read
   - im:read
   - mpim:read
   - chat:write
8. When you’ve added the four OAuth scopes, scroll back to the top and click “Install to Workspace”
9. On the permission to access page, click “Allow”. **You should now see a Bot User OAuth Token that you can copy**
![Screenshot 2024-07-25 at 18 30 44](https://github.com/user-attachments/assets/b0ec68fe-fb46-44b6-9635-56377978c202)


Now let’s set up the secrets in the Keel app - this is what connects Keel to Slack! 

1. In the Keel console, choose “Secrets” under the left hand Configure menu
2. Click “Add secret” 
3. Copy the OAuth token you just made in the Slack API. In Secrets, add “SLACK_TOKEN” as the Key and paste your token in the Value
4. For the second secret, you need to find the Channel ID for the Slack channel that you’re adding your WAYWO to. In Slack, go to the channel you’ve chosen and open up the channel information. You’ll find the channel ID at the bottom of the information window, with a button to copy it
5. Copy the channel ID from your Slack channel. In Secrets, add “CHANNEL_ID” as the Key and paste the channel ID in the Value
6. Hit save to save your two secrets
7. Go to the build tab and click Deploy on your latest build to redeploy your project
![Screenshot 2024-07-25 at 18 32 21](https://github.com/user-attachments/assets/70268dc3-ac8c-4155-85e2-50e01b47dc70)


The final step is to personalise your WAYWO with prompts - the messages it’ll send to your channel to ask people what they’re working on. 

1. Go to the All Tools section in Keel
2. Click “Add message”
3. Click the + button and type in your prompt. The WAYWO bot will automatically add “Hey @[name] at the start of your message, and it’ll choose a message at random each time it runs
4. Keep clicking the + button to add more messages, until you’re happy
5. Click “Create” to add all your messages
6. In Jobs, click on the Waywo entry
7. Click the “Run” button to test it’s working
8. Go and check your Slack channel where you should see the result! 
9. The WAYWO will run every week day at 2:15pm unless you stop it.
![Screenshot 2024-07-25 at 18 32 45](https://github.com/user-attachments/assets/2292385c-2399-4113-a881-21b50b2369bf)
