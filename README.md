# sdg-api
An API to retrieve information and metadata on the [Sustainable Development Goals](http://www.un.org/sustainabledevelopment/sustainable-development-goals/). 

The Inter-agency Expert Group on SDG Indicators released a series of PDFs that includes metadata for each Indicator. Those PDFs can be downloaded [here](http://unstats.un.org/sdgs/iaeg-sdgs/metadata-compilation/).

This API is a JSON-based representation of those reports, assembled with love :)

So let's go build something that changes the world.


---

# setup
- clone/fork repo
- `cd` into dir
- `npm install`
- `npm start`
- api now available @ `http://localhost:3000`

---

# documentation

##/goals

| parameter                 | type           | description                                                                      | example |
|---------------------------|----------------|----------------------------------------------------------------------------------|---------|
| `none`                      |      `null`          | retrives a list of all the goals                                                 |         |
| `ids`                       | `Array <String>` | comma separated list of goal ids to filter by                          | 1, 2, 3, 4      |
| `targets`                   | `Boolean`        | returns the associated targets for each goal                                     | true    |
| `indicators`                | `Boolean`        | returns the associated indicators for each goal or target                        | true    |
| `includeMetadata` | `Boolean`        | returns detailed metadata where available, for each indicator | true    |

####example 
#####request
`http://localhost:3000/goals?ids=5,12&targets=true&indicators=true&includeMetadata=true`
#####response
```json
{
  "data": [
    {
      "goal": 5,
      "title": "Achieve gender equality and empower all women and girls",
      "short": "Gender Equality",
      "colorInfo": {
        "hex": "#ff3a21",
        "rgb": [
          255,
          58,
          33
        ]
      },
      "targets": [
        {
          "id": "5.1",
          "title": "End all forms of discrimination against all women and girls everywhere.",
          "goal": 5,
          "indicators": [
            {
              "target_id": "5.1",
              "has_metadata": true,
              "goal": 5,
              "goal_meta_link": "http://unstats.un.org/sdgs/files/metadata-compilation/Metadata-Goal-5.pdf",
              "goal_meta_link_page": 2,
              "target": "End all forms of discrimination against all women and girls everywhere.",
              "indicator_id": "5.1.1",
              "indicator": "Whether or not legal frameworks are in place to promote, enforce and monitor equality and non-discrimination on the basis of sex",
              "responsible_entities": [
                "UN-WOMEN"
              ],
              ...
}
```



##/targets
| parameter                 | type           | description                                                                      | example |
|---------------------------|----------------|----------------------------------------------------------------------------------|---------|
| `none`                      |      `null`          | retrives a list of all the targets                                                 |         |
| `goals`                       | `Array<String>` | goal number to filter targets                          | 1, 2, 4    |
| `ids`                       | `Array<String>` | id number to filter targets                          | 1.1, 2.4, 4.a     |
####example
#####request
`http://localhost:3000/targets?goals=5&ids=5.a`

#####response
```json
{
  "data": [
    {
      "id": "5.a",
      "title": "Undertake reforms to give women equal rights to economic resources, as well as access to ownership and control over land and other forms of property, financial services, inheritance and natural resources, in accordance with national laws.",
      "goal": 5
    }
  ],
  "meta": {}
}
```

##/indicators
| parameter                 | type           | description                                                                      | example |
|---------------------------|----------------|----------------------------------------------------------------------------------|---------|
| `none`                      |      `null`          | retrives a list of all the indicators                                                 |         |
| `ids`                       | `Array<String>` | indicator ids to filter indicators                          | 4.1.1    |
| `goals`                       | `Array<String>` | goal numbers to filter indicators                          | 4, 6, 9    |
| `targets`                       | `Array<String>` | target numbers to filter indicators                          | 4.2, 6.4, 9.1    |
| `includeMetadata`                       | `Boolean` | returns detailed metadata where available, for each indicator                          | true    |

###indicator metadata fields
An effort was made to collect as much information as possible from each individual PDF. Where it was not possible to collect information directly, a "see report" message should be noted. From there, one can use the `goal_meta_link` along with the `goal_meta_link_page` to link directly to the PDF and page for the indicator.

| metadata field            | description  |
|---------------------------|--------------|
|`name` | description|
|`goal` | Goal|
|`goal_meta_link` | Link to UN Stats Metadata Compilation Report in PDF format|
|`goal_meta_link_page` | Page Number to link directly to Indicator within PDF|
|`target_id` | Target ID|
|`target` | Target Description|
|`indicator_id` | Indicator ID|
|`indicator` | Indicator Description|
|`has_metadata` | Is Metadata from the UN Stats report available|
|`definition` | Precise definition of the indicator|
|`method` | Method of Computation and/or Estimation|
|`rationale_interpretation` | Rationale and/or Interpretation|
|`domain` | Domain|
|`subdomain` | Subdomain|
|`target_linkage` | How is the indicator linked to the specific TARGET as worded in the OWG Report?|
|`exists_reported`| Does the indicator already exist and is it regularly reported?|
|`reliability_coverage_comparability_subnational_compute` | Comment on the reliability, potential coverage, comparability across countries, and the possibility to compute the indicator at sub-national level.|
|`baseline_value_2015` | Is there already a baseline value for 2015?|
|`sources_data_collection`| Sources and Data Collection|
|`quantifiable_derivatives` | Quantifiable Derivatives|
|`frequency`| Frequency of Data Collection|
|`disaggregation` | Data Disaggregation|
|`global_regional_monitoring_data` | Entity Responsible for Data for Global and Regional Monitoring|
|`comments_limitations` | Comments and Limitations|
|`gender_equality_issues` | Identifiable Gender Equality Issues|
|`responsible_entities` | Responsible Entities|
|`current_data_availability` | Current Data Availability|
|`related_targets` | Related Targets|
|`related_indicators` | Related Indicators|
|`supplementary_information` | Supplementary Information|
|`references` | References|

####example
#####request
`http://localhost:3000/indicators?goals=4&targets=4.2`
#####response
```json
{
  "data": [
    {
      "indicator_id": "4.1.1",
      "indicator": "Proportion of children and young people: (a) in grades 2/3; (b) at the end of primary; and (c) at the end of lower secondary achieving at least a minimum proficiency level in (i) reading and (ii) mathematics, by sex",
      "target_id": "4.1",
      "target": "By 2030, ensure that all girls and boys complete free, equitable and quality primary and secondary education leading to relevant and effective learning outcomes.",
      "goal": 4,
      "goal_meta_link": "http://unstats.un.org/sdgs/files/metadata-compilation/Metadata-Goal-4.pdf",
      "goal_meta_link_page": 2,
      "has_metadata": true
    },
    {
      "indicator_id": "4.2.1"
      ...
}
```


##/dashboards
This endpoint is for testing purposes only and does not directly relate to this API. It is here as a placeholder to help power a conceptual SDG Dashboard Web Application. It will be removed in a future release.


---


## Licensing
Copyright 2016 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](/LICENSE) file.