CREATE TABLE event_log
(
    aggregate_id VARCHAR(31) NOT NULL,
    aggregate    VARCHAR(31) NOT NULL,
    event_type   VARCHAR(31) NOT NULL,
    generated_on TIMESTAMP   NOT NULL,
    event        json        NOT NULL,
    PRIMARY KEY (aggregate_id, aggregate)
);
