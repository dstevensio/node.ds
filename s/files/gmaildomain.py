'''
Run this script either by doing:

  python gmaildomain.py
  
And you will be prompted for details, or you can save time by doing:

  python gmaildomain.py WEBFACTION_USERNAME_HERE DOMAIN_TO_USE_GMAIL_FOR_HERE_WITHOUT_WWW

And you will only be prompted for your password.  

Don't forget to complete the Google Apps sign up process prior to running this script though as without that step, this is pointless!
'''

import sys
import xmlrpclib
import getpass

googleMX = {
  'ALT1.ASPMX.L.GOOGLE.COM':'20', 
  'ASPMX5.GOOGLEMAIL.COM':'30', 
  'ASPMX3.GOOGLEMAIL.COM':'30', 
  'ALT2.ASPMX.L.GOOGLE.COM':'20', 
  'ASPMX2.GOOGLEMAIL.COM':'30', 
  'ASPMX4.GOOGLEMAIL.COM':'30', 
  'ASPMX.L.GOOGLE.COM':'10'
}

if len(sys.argv) == 3:
  uname = sys.argv[1]
  userdomain = sys.argv[2]
else:
  uname = raw_input("Enter Webfaction Username:")
  userdomain = raw_input("Enter domain you wish to use Gmail Hosted Mail for:")


pwd = getpass.getpass("Enter password:")

server = xmlrpclib.ServerProxy('https://api.webfaction.com/')
session_id, account = server.login(uname,pwd)

print 'Setting DNS Overrides now...'

for mxname, mxpriority in googleMX.iteritems():
  server.create_dns_override(session_id,userdomain,'','',mxname,mxpriority,'')
  
print 'All done'