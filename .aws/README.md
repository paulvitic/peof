## Push image to ECR

Provided you have your aws user profile at *~/.aws/config*, e.g.

```
[repo-user]
region = eu-central-1
output=json
```
and the credentials of this aws user at *~/.aws/credentials*, e.g.

```
[repo-user]
aws_access_key_id = AAAAAAAAAAAAAAAAAA
aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxxxx
```

then use aws cli to login. This will basically output a *docker login command*
using a temporary docker user and password. You can directly execute the output of
aws ecr get-login by sourcing the output:
 
```
source <(aws --profile repo-user ecr get-login --region eu-central-1 --no-include-email)
```

then tag and push the image
```
docker tag 1178850dc127 332197038802.dkr.ecr.eu-central-1.amazonaws.com/test-repository
docker push 332197038802.dkr.ecr.eu-central-1.amazonaws.com/test-repository
```


[Cloud formation templates](https://s3.amazonaws.com/cloudformation-templates-us-east-1)