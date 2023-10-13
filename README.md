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
8. When you’ve added the four OAuth scopes, scroll back to the top and click “Install to Workspace”
9. On the permission to access page, click “Allow”. **You should now see a Bot User OAuth Token that you can copy**
10. Go to the Incoming Webhooks section
11. Toggle the Activate Incoming Webhooks button to “On”
12. Click “Add New Webhook to Workspace”
13. On the permission to access page, choose the Slack channel you’d like to add your WAYWO bot to from the dropdown, and click “Allow”. **You should now see a Webhook URL that you can copy** 


Now let’s set up the secrets in the Keel app - this is what connects Keel to Slack! 

1. In the Keel console, choose “Secrets” under the left hand Configure menu
2. Click “Add secret” 
3. Copy the OAuth token you just made in the Slack API. In Secrets, add “SLACK_TOKEN” as the Key and paste your token in the Value
4. Click “Add secret”
5. Copy the Webhook URL you just made in the Slack API. In Secrets, add “SLACK_URL” as the Key and paste the URL in the Value
6. Click “Add secret”
7. For the final secret, you need to find the Channel ID for the Slack channel that you’re adding your WAYWO to. In Slack, go to the channel you’ve chosen and open up the channel information. You’ll find the channel ID at the bottom of the information window, with a button to copy it
8. Copy the channel ID from your Slack channel. In Secrets, add “CHANNEL_ID” as the Key and paste the channel ID in the Value
9. Hit save to save your three secrets
10. **Do an empty commit???**


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
