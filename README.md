# Yahee - My first project to practice what I've learned

Take a look @https://yahee.vercel.app/user/messenger

Chat 1vs1 - Users can:

1. Exchange text messages, media (photos, voice recordings), click and hold send button to send a default emoji of different sizes aligned with how long the button is pressed (similar behavior to what you have on facebook messenger)
2. Pin, reply, hide, recall, copy, forward or react to messages
3. Set nicknames, conversation theme or block the other end
4. Buzz others (their chat windows will shake) when sending a default emoji or when the sent text contains certain words.
5. engage in a video call (within a local network only, for now)

Group chat

1. Most of the above
2. Set theme and name for the conversation.
3. Add more members
4. Become an admin of the conversation (conversation creator is the admin by default).
   As an admin, you can:
   4.1 Make another (member) admin
   4.2 Remove another or yourself as admin
   4.3 Remove a member from the group
   4.4 Remove and block a member (Once done you and others shouldn't be able to add him back EVER)

- In the event the conversation doesn't have an admin, all members are given the option to claim themself as the admin

5. Leave the conversation

Users can also

1. Upload their own profile photo, turn off notification sounds, set chat window theme, search for contacts
2. Send a new message to a person or several people (a new conversation will be created if there isn't one in place)

Other features:

1. Messages go through several stages as presented by their status before they are seen: uploading (sending to the server), sent (saved to database, but recipients have gone offline), delivered (the message is delivered but has yet to be seen by recipients), seen (message is seen by recipients), failed (the message is not saved to database)
2. Infinite scrolling: initially the server will send back 30 messages or less for each conversation. User can scroll up to see previous messages

Issues to be fixed:
Unexpected behavior when users open several tabs simultaneously
Janky scroll especially when messages contain attachments
Removed messages may still be present on sidebar
...
