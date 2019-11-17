/**
curl --request GET \
  --url 'https://some.atlassian.net/rest/api/3/search?jql=status%20not%20in%20(Closed%2C%20Done)%20and%20project%3DContact&maxResults=1&fields=statuscategorychangedate,issuetype,project' \
  --user 'email@company.com:amyl2uWaTymL0oEm0dcHA6F4' \
  --header 'Accept: application/json'
 **/