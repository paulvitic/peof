import DataCollectionProcessor from "./DataCollectionProcessor";
import DomainEvent from "./DomainEvent";
import DataCollectionStarted from "./DataCollectionStarted";

export default class DataCollectionExecutive implements DataCollectionProcessor<DomainEvent> {

    public start(): DomainEvent | undefined {
        return new DataCollectionStarted("DataCollection", "111111");
        /**
         curl --request GET \
         --url 'https://some.atlassian.net/rest/api/3/search?jql=status%20not%20in%20(Closed%2C%20Done)%20and%20project%3DContact&maxResults=1&fields=statuscategorychangedate,issuetype,project' \
         --user 'email@company.com:amyl2uWaTymL0oEm0dcHA6F4' \
         --header 'Accept: application/json'
         **/
    }

    public process(event: DomainEvent): undefined {
        return undefined;
    }
}