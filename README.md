[![CircleCI](https://circleci.com/gh/paulvitic/product-engineering.svg?style=svg)](https://circleci.com/gh/paulvitic/product-engineering)

# PEOF - A Product & Engineering Organization Framework 

The idea is to build a framework that automates product and software delivery
management and provides visibility to the organization.

Additionally this is a technical PoC project that investigates various
approaches such as DDD and micro-front-ends.

At the high level the systems is split into 4 domains. This may be an 
over-kill but nevertheless the design will be used to verify the technical
concepts mentioned above.

## Organization

Is the domain that deals with strategic organization design, i.e. the teams 
and projects within the organization.

## People

This domains deals with the roles and responsibilities of the people,
the performance evaluation process. Performance evaluation will be receiving
input both from this domain, in the form of 360 feedback results and
from other domains providing a final outcome.

## Portfolio

This domain deals with the portfolio management process that will use the
OKR approach. 

## Assets

These are the all the technological assets developed and maintained by the 
teams. It will interface with other dev tools and service used in the company
to monitor the architectural fitness function data to evaluate the direction
in which the architecture is evolving.

## Agile

This domain will monitor the software development process by interfacing
with the agile boards of each team. 

#### References

* [Docker logging](https://logz.io/blog/docker-logging/)
* [CircleCi build custom primary container](https://circleci.com/docs/2.0/custom-images/)
* [CircleCi primary containers](https://github.com/CircleCI-Public/example-images)
* [Goland 11 Alpine Docker image](https://github.com/docker-library/golang/blob/103d42338bd9c3f661ade41f39dbc88fe9dc83a3/1.11/alpine3.10/Dockerfile)
