# sdg-api
An API to retrieve SDG related information


# documentation

##/goals

| parameter                 | type           | description                                                                      | example |
|---------------------------|----------------|----------------------------------------------------------------------------------|---------|
| `none`                      |      `null`          | retrives a list of all the goals                                                 |         |
| `ids`                       | `Array <String>` | comma separated list of goal ids (numbers) to filter by                          | 1,2,3,4      |
| `targets`                   | `Boolean`        | returns the associated targets for each goal                                     | true    |
| `indicators`                | `Boolean`        | returns the associated indicators for each goal or target                        | true    |
| `relateIndicatorsToTargets` | `Boolean`        | enforces the hierarchy to return indicators related to each target for each goal. ignored if *`targets` is `false`* | true    |

####example 
#####request
`http://localhost:3000/goals?ids=5, 12&targets=true&indicators=true&relateIndicatorsToTargets=true`
#####response
```json[
   {
      "goal":5,
      "title":"Achieve gender equality and empower all women and girls",
      "short":"Gender Equality",
      "targets":[
         {
            "goal":5,
            "id":"5.1",
            "title":"End all forms of discrimination against all women and girls everywhere",
            "indicators":[
               {
                  "goal":1,
                  "targets":"1.1,1.4,2.3,5.1,5.a,10.2",
                  "indicator":"Percentage of women, men, indigenous peoples, and local communities with secure rights to land, property, and natural resources, measured by (i) percentage with documented or recognized evidence of tenure, and (ii) percentage who perceive their rights are recognized and protected.",
                  "data":{
                     "url":"",
                     "format":"",
                     "meta":""
                  },
                  "source":"http://indicators.report/indicators/i-5/",
                  "leads":"FAO, UNDP, UN-Habitat",
                  "other goals":"2, 5, 10, 11",
                  "available":"C",
                  "category":"100"
               },
               ...
               ```


##/targets
####example
