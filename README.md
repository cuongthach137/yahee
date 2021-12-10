# Yahee - My first project to practice react and mongodb

Have a look @ https://yahee.vercel.app/user/messenger
Test account:
test@gmail.com
anhem!23
Or create your own account

Chat 1vs1 - Users can:

1. Exchange text messages, media (photos, voice recordings), click and hold send button to send a default emoji of different sizes aligned with how long the button is pressed (similar behavior to what you have on facebook messenger)
2. Pin, reply, hide, recall, copy, forward or react to messages
3. Set nicknames, conversation theme or block the other end
4. Buzz other end (their chat windows will shake) when sending a default emoji or when the sent text contains certain words.
5. Engage in a video call (within a local network only, for now)

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

Miscellaneous:

1. Messages go through several stages as presented by their status before they are seen: uploading (sending to the server), sent (saved to database, but recipients have gone offline), delivered (the message is delivered but has yet to be seen by recipients), seen (message is seen by recipients), failed (the message is not saved to database)

Issues to be fixed:

1. Unwanted behavior when users open several tabs
2. Janky scroll especially when messages contain attachments
3. Removed messages may still be visible on sidebar as latest message
4. Incorrect announcements in group chat when a user leaves the conversation and is later added back
5. Broken layout on login page
6. Accessing the site on IOS devices shows a blank page @@
7. Weird bug when sending a new message from a Mac in which the very last word of the message duplicates into a new message (Ex: "hey yo" "yo") (please wtf)
8. Incorrect user activity status

Bugs...features to be added:
1. Conversation tags
2. Video call that actually works
   ...
