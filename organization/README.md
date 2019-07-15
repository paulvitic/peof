#### Sheet
* https://developers.google.com/sheets/api/quickstart/go

#### Chat:
* https://medium.com/google-cloud/google-chat-bot-go-cc91c5311d7e
* https://developers.google.com/hangouts/chat/how-tos/libraries
* https://github.com/googleapis/google-api-go-client/tree/master/chat/v1
* https://godoc.org/google.golang.org/api/chat/v1

#### Bitbucket
* [REST Resources Provided By: Bitbucket Server - REST](https://docs.atlassian.com/bitbucket-server/rest/4.9.1/bitbucket-rest.html#idp1356560)
* [projects](https://bitbucket.smava.de/rest/api/1.0/projects)
* [casi project repos](https://bitbucket.smava.de/rest/api/1.0/projects/casi/repos)
* [casi project casi-acd2 repo branches](https://bitbucket.smava.de/rest/api/1.0/projects/casi/repos/casi-acd2/branches?details=true)
* [casi project casi-acd2 repo pull requests](https://bitbucket.smava.de/rest/api/1.0/projects/casi/repos/casi-acd2/pull-requests)
* [Comments for a particular pull request and file](https://bitbucket.smava.de/rest/api/1.0/projects/CASI/repos/casi-acd2/pull-requests/178/comments?path=src/main/java/de/smava/casi/acd/port/http/scriptRunner/ScriptRunnerRequestAdapter.java)

#### Jira
* [JIRA Server platform REST API reference](https://docs.atlassian.com/software/jira/docs/api/REST/8.1.0/)
* [https://developer.atlassian.com/server/jira/platform/security-overview/](https://developer.atlassian.com/server/jira/platform/security-overview/)

Example:
```$xslt
https://intranet.smava.de/jira/rest/auth/1/session
{ "username": "pvitic", "password": "jutta1805" }
Response:
{
    "session": {
        "name": "JSESSIONID",
        "value": "700B5DEC7D3D7D7E9C6F73B45CE27B8B"
    },
    "loginInfo": {
        "failedLoginCount": 3,
        "loginCount": 354,
        "lastFailedLoginTime": "2016-03-15T12:25:16.880+0100",
        "previousLoginTime": "2016-05-09T08:33:49.600+0200"
    }
}
```
* [projects](https://jira.smava.de/rest/api/2/project)
* [open issues in a project (better use post)](https://jira.smava.de/rest/api/2/search?jql=project=11368&status=open)

#### D3

* [Tile](https://bl.ocks.org/d3indepth/fa5e9d42d8e260f3f76a98be648c9edd)
* [Force layout example](http://bl.ocks.org/sxywu/1db896c1a38d89ae71b4)
* [SVG zoom in/out](https://bl.ocks.org/mbostock/3680999)
* [Clicking and dragging svg with react and d3](https://medium.com/dev-shack/clicking-and-dragging-svg-with-react-and-d3-js-5639cd0c3c3b)
* [Zoomable dataviz componenet with d3 and react](https://swizec.com/blog/two-ways-build-zoomable-dataviz-component-d3-zoom-react/swizec/7753)
* [D3 timeline chart 1](https://github.com/Genscape/d3-timeline)
* [D3 timeline chart 2](https://codepen.io/manglass/pen/MvLBRz)
* [D3 simple timeline chart](https://codepen.io/chris-creditdesign/pen/yuFjr)
* [D3 complex timeline chart](https://bl.ocks.org/vasturiano/ded69192b8269a78d2d97e24211e64e0)

#### Go

* [Dependency Injection](https://gitlab.com/drewolson/go_di_example/blob/master/example.go)
* [Integration testing with Docker](https://github.com/ory/dockertest)
* [Go Microservices: Tracing with Zipkin](https://dzone.com/articles/go-microservices-part-12-distributed-tracing-with)

##### MongoDb

* [go mongodb driver cookbook](https://vkt.sh/go-mongodb-driver-cookbook/)
* [mongodb go tutorial](https://github.com/tfogo/mongodb-go-tutorial/blob/master/main.go)
* [official mongodb go driver](https://medium.com/@wembleyleach/how-to-use-the-official-mongodb-go-driver-9f8aff716fdb)