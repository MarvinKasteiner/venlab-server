# Venlab Backend API Documentation

**Version:** 0.1.0
**License:** Default

## Overview
This API manages laboratory data, including Analysis, Boxes, Box Positions, Logs, Samples, and Thresholds. It provides CRUD operations for these resources and specific "joined" views for complex data retrieval.

---

## 1. Analysis
Operations related to analysis data.

### List Analysis
**GET** `/analysis`
Retrieves a list of all analysis records.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:** `200 OK` (Array of [Analysis](#analysis-object))

### Get Analysis by ID
**GET** `/analysis/{id}`
Retrieves a specific analysis record.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | integer | path | Yes | Analysis ID |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:**
* `200 OK` (Array of [Analysis](#analysis-object))
* `404 Not Found`

### Update Analysis
**PUT** `/analysis/{id}`
Updates an existing analysis record.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | integer | path | Yes | Analysis ID |

**Body:** [UpdateAnalysis](#updateanalysis-object)
**Response:** `200 OK` (Array of [Analysis](#analysis-object)), `400 Bad Request`, `404 Not Found`

### Delete Analysis
**DELETE** `/analysis/{id}`
Deletes an analysis record.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | integer | path | Yes | Analysis ID |

**Response:** `204 No Content`, `404 Not Found`

---

## 2. Box
Operations related to storage boxes.

### List Boxes
**GET** `/box`
Retrieves a list of all boxes.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:** `200 OK` (Array of [Box](#box-object))

### Create Box
**POST** `/box`
Creates a new box.

**Body:** [NewBox](#newbox-object)
**Response:** `201 Created` ([Box](#box-object)), `400 Bad Request`

### Get Box by ID
**GET** `/box/{id}`
Retrieves a specific box.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Box ID |

**Response:** `200 OK` ([Box](#box-object)), `404 Not Found`

### Update Box
**PUT** `/box/{id}`
Updates an existing box.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Box ID |

**Body:** [UpdateBox](#updatebox-object)
**Response:** `200 OK` ([Box](#box-object)), `400 Bad Request`, `404 Not Found`

### Delete Box
**DELETE** `/box/{id}`
Deletes a box.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Box ID |

**Response:** `204 No Content`, `404 Not Found`

---

## 3. Box Positions (Boxpos)
Operations related to positions within boxes.

### List Box Positions
**GET** `/boxpos`
Retrieves a list of all box positions.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:** `200 OK` (Array of [Boxpos](#boxpos-object))

### Create Box Position
**POST** `/boxpos`
Creates a new box position entry.

**Body:** [NewBoxpos](#newboxpos-object)
**Response:** `201 Created` ([Boxpos](#boxpos-object)), `400 Bad Request`

### Get Specific Box Position
**GET** `/boxpos/{box_id}/{boxpos_id}`
Retrieves a specific position within a specific box.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `box_id` | string | path | Yes | Box ID |
| `boxpos_id` | string | path | Yes | Box Position ID |

**Response:** `200 OK` (Array of [Boxpos](#boxpos-object)), `404 Not Found`

### Update Box Position
**PUT** `/boxpos/{box_id}/{boxpos_id}`
Updates a box position entry.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `box_id` | string | path | Yes | Box ID |
| `boxpos_id` | string | path | Yes | Box Position ID |

**Body:** [UpdateBoxpos](#updateboxpos-object)
**Response:** `200 OK` ([Boxpos](#boxpos-object)), `400 Bad Request`, `404 Not Found`

### Delete Box Position
**DELETE** `/boxpos/{box_id}/{boxpos_id}`
Deletes a box position entry.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `box_id` | string | path | Yes | Box ID |
| `boxpos_id` | string | path | Yes | Box Position ID |

**Response:** `204 No Content`, `404 Not Found`

---

## 4. Joined Views
Endpoints that return aggregated data.

### Get Box with Positions
**GET** `/joined/box/{id}`
Retrieves a box along with all its positions.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Box ID |

**Response:** `200 OK` (Array of [BoxWithBoxpos](#boxwithboxpos-object)), `404 Not Found`

### Get Sample with Analysis
**GET** `/joined/sample/{id}/{ts}`
Retrieves a sample along with its analysis data.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Sample ID |
| `ts` | string | path | Yes | Timestamp |

**Response:** `200 OK` (Array of [SampleWithAnalysis](#samplewithanalysis-object)), `404 Not Found`

---

## 5. Log
Operations related to system logs.

### List Logs
**GET** `/log`
Retrieves a list of logs.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:** `200 OK` (Array of [Log](#log-object))

### Create Log
**POST** `/log`
Creates a new log entry.

**Body:** [NewLog](#newlog-object)
**Response:** `201 Created` (Array of [Log](#log-object)), `400 Bad Request`

### Get Log by ID
**GET** `/log/{id}`
Retrieves a specific log.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | integer | path | Yes | Log ID |
| `limit` | integer | query | No | Max results |

**Response:** `200 OK` (Array of [Log](#log-object)), `404 Not Found`

### Update Log
**PUT** `/log/{id}`
Updates a log entry.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | integer | path | Yes | Log ID |

**Body:** [UpdateLog](#updatelog-object)
**Response:** `200 OK` (Array of [Log](#log-object)), `400 Bad Request`, `404 Not Found`

### Delete Log
**DELETE** `/log/{id}`
Deletes a log entry.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | integer | path | Yes | Log ID |

**Response:** `204 No Content`, `404 Not Found`

---

## 6. Sample
Operations related to samples.

### List Samples
**GET** `/sample`
Retrieves a list of samples.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:** `200 OK` (Array of [Sample](#sample-object))

### Create Sample
**POST** `/sample`
Creates a new sample.

**Body:** [NewSample](#newsample-object)
**Response:** `201 Created` ([Sample](#sample-object)), `400 Bad Request`

### Get Sample (ID/TS)
**GET** `/sample/{id}/{ts}`
Retrieves a specific sample by ID and Timestamp.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Sample ID |
| `ts` | string | path | Yes | Timestamp |

**Response:** `200 OK` (Array of [Sample](#sample-object)), `404 Not Found`

### Update Sample
**PUT** `/sample/{id}/{ts}`
Updates a sample.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Sample ID |
| `ts` | string | path | Yes | Timestamp |

**Body:** [UpdateSample](#updatesample-object)
**Response:** `200 OK` ([Sample](#sample-object)), `400 Bad Request`, `404 Not Found`

### Delete Sample
**DELETE** `/sample/{id}/{ts}`
Deletes a sample.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Sample ID |
| `ts` | string | path | Yes | Timestamp |

**Response:** `204 No Content`, `404 Not Found`

---

## 7. Threshold
Operations related to configuration thresholds.

### List Thresholds
**GET** `/threshold`
Retrieves a list of thresholds.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | integer | query | No | Maximum number of results to return |

**Response:** `200 OK` (Array of [Threshold](#threshold-object))

### Create Threshold
**POST** `/threshold`
Creates a new threshold.

**Body:** [NewThreshold](#newthreshold-object)
**Response:** `201 Created` (Array of [Threshold](#threshold-object)), `400 Bad Request`

### Get Threshold by ID
**GET** `/threshold/{id}`
Retrieves a specific threshold.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Threshold ID |
| `limit` | integer | query | No | Max results |

**Response:** `200 OK` (Array of [Threshold](#threshold-object)), `404 Not Found`

### Update Threshold
**PUT** `/threshold/{id}`
Updates a threshold.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Threshold ID |

**Body:** [UpdateThreshold](#updatethreshold-object)
**Response:** `200 OK` (Array of [Threshold](#threshold-object)), `400 Bad Request`, `404 Not Found`

### Delete Threshold
**DELETE** `/threshold/{id}`
Deletes a threshold.

| Parameter | Type | In | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | path | Yes | Threshold ID |

**Response:** `204 No Content`, `404 Not Found`

---

## Component Schemas

### Analysis Object
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `a_id` | integer | **Yes** | Analysis ID |
| `s_stamp` | string | **Yes** | Timestamp |
| `pol` | string | **Yes** | Pol value |
| `nat` | string | **Yes** | Nat value |
| `kal` | string | **Yes** | Kal value |
| `an` | string | **Yes** | An value |
| `glu` | string | **Yes** | Glucose value |
| `dry` | string | **Yes** | Dry value |
| `date_in` | string | **Yes** | Date In |
| `date_out` | string | **Yes** | Date Out |
| `weight_mea` | string | **Yes** | Measured weight |
| `weight_nrm` | string | **Yes** | Normal weight |
| `weight_cur` | string | **Yes** | Current weight |
| `weight_dif` | string | **Yes** | Weight difference |
| `density` | string | **Yes** | Density |
| `date_exported`| string | **Yes** | Date exported |
| `a_flags` | string | No | Flags |
| `comment` | string | No | Comment |
| `lane` | integer | No | Lane number |
| `s_id` | string | No | Sample ID |

### Box Object
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `b_id` | string | **Yes** | Box ID |
| `date_exported`| string | **Yes** | Date exported |
| `comment` | string | No | Comment |
| `name` | string | No | Box Name |
| `num_max` | integer | No | Max number |
| `type_` | integer | No | Type ID |

### Boxpos Object
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `b_id` | string | **Yes** | Box ID |
| `bpos_id` | integer | **Yes** | Position ID |
| `date_exported`| string | No | Date exported |
| `s_id` | string | No | Sample ID |
| `s_stamp` | string | No | Sample Timestamp |

### BoxWithBoxpos Object
*Inherits all fields from [Box Object](#box-object)* plus:
| Field | Type | Description |
| :--- | :--- | :--- |
| `boxposes` | Array[[Boxpos](#boxpos-object)] | List of positions in the box |

### Sample Object
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `s_id` | string | **Yes** | Sample ID |
| `s_stamp` | string | **Yes** | Sample Timestamp |
| `weight_net` | string | **Yes** | Net Weight |
| `weight_bru` | string | **Yes** | Gross Weight |
| `weight_tar` | string | **Yes** | Tare Weight |
| `quantity` | string | **Yes** | Quantity |
| `distance` | string | **Yes** | Distance |
| `comment` | string | No | Comment |
| `date_crumbled`| string | No | Date Crumbled |
| `date_exported`| string | No | Date Exported |
| `lane` | integer | No | Lane |
| `name` | string | No | Name |
| `s_flags` | string | No | Flags |

### SampleWithAnalysis Object
*Inherits all fields from [Sample Object](#sample-object)* plus:
| Field | Type | Description |
| :--- | :--- | :--- |
| `analyses` | Array[[Analysis](#analysis-object)] | Associated analysis records |

### Log Object
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `log_id` | integer | **Yes** | Log ID |
| `level` | string | No | Log Level (e.g., INFO) |
| `info` | string | No | Log Message |
| `date_created` | string | No | Creation Date |
| `date_exported`| string | No | Export Date |
| `a_id` | integer | No | Analysis ID (if applicable) |
| `s_id` | string | No | Sample ID (if applicable) |
| `s_stamp` | string | No | Timestamp |

### Threshold Object
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `th_id` | string | **Yes** | Threshold ID |
| `value_min` | string | **Yes** | Minimum Value |
| `value_max` | string | **Yes** | Maximum Value |
| `date_changed` | string | No | Date last changed |

---
**Note:** `New{Object}` and `Update{Object}` schemas generally follow the structure of their main objects, excluding system-generated IDs where appropriate, or making specific fields optional. Refer to the API definition for exact validation constraints.