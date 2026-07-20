# Urban Planning Database

This repository contains the import pipeline, MongoDB models, and datasets used to build the Urban Planning Database for the **Orchid AI Due Diligence Platform**.

The objective is to centralize urban planning, zoning, GIS, regulatory, road, and public equipment data extracted from official Moroccan *Plans d'Aménagement* into a structured MongoDB database that can later be queried by the AI engine.

---

# Current Coverage

Current imported planning document:

- **Plan d'Aménagement de Marrakech Ouest Mhamid (2025)**

The import pipeline is designed to be reusable so that additional communes and planning documents can be added without modifying the database architecture.

---

# Database Architecture

```text
PlanningDocument
│
├── Commune
├── PlanningBoundary
├── AllZoning
│     ├── PlanningAllowedUse
│     ├── PlanningProhibitedUse
│     └── PlanningArticle
│              └── PlanningRule
│
├── PlanningEquipment
│
├── PlanningRoad
│
└── PlanningRoadPolygon
```

---

# Collections

## PlanningDocument

Stores metadata for every planning document.

Example:

```
PAS_MARRAKECH_OUEST_MHAMID_2025
```

Contains:

- planning code
- document identifier
- commune
- document metadata

---

## Commune

Stores commune information.

Contains:

- commune name
- province
- region
- planning document reference

---

## PlanningBoundary

Stores the outer boundary of each planning document.

Geometry:

- Polygon

Purpose:

- Determine whether a property lies inside a planning document.

---

## AllZoning

Main zoning GIS collection.

### Fields

- zone_id
- planning_code
- polygon_id
- zoning_code
- designation
- summary
- category
- geometry

Geometry:

- Polygon
- MultiPolygon

Spatial index:

```
2dsphere
```

Purpose:

- Retrieve zoning information from GPS coordinates.
- Spatial intersection with parcels.

---

## PlanningArticle

Stores complete articles extracted from planning regulations.

Contains:

- article number
- title
- body
- document
- planning zone

Purpose:

- Legal reference for AI responses.

---

## PlanningRule

Stores individual regulatory rules extracted from articles.

Examples:

- setbacks
- parcel area
- parking
- building placement
- authorizations

Purpose:

- Fine-grained regulatory search.

---

## PlanningAllowedUse

Stores explicitly permitted land uses.

Examples:

- Villa
- Services
- Commercial
- Equipment

---

## PlanningProhibitedUse

Stores prohibited land uses.

Purpose:

Answer questions such as:

> Is a hotel allowed in this zoning?

---

## PlanningEquipment

Stores public facilities.

Examples:

- schools
- hospitals
- cemeteries
- administrative buildings
- public services

Geometry:

- Polygon
- MultiPolygon

---

## PlanningRoad

Stores road centerlines.

Examples:

- National roads
- Streets
- Pedestrian roads

Geometry:

- LineString
- MultiLineString

---

## PlanningRoadPolygon

Stores road right-of-way polygons.

Geometry:

- Polygon
- MultiPolygon

Purpose:

Used for spatial analysis of roads and setbacks.

---

# Imported Datasets

| Dataset | Status |
|----------|--------|
| PlanningDocument | ✅ Imported |
| Commune | ✅ Imported |
| PlanningBoundary | ✅ Imported |
| AllZoning | ✅ Imported |
| PlanningArticle | ✅ Imported |
| PlanningRule | ✅ Imported |
| PlanningAllowedUse | ✅ Imported |
| PlanningProhibitedUse | ✅ Imported |
| PlanningEquipment | ✅ Imported |
| PlanningRoad | ✅ Imported |
| PlanningRoadPolygon | ✅ Imported |

---

# Record Counts

| Collection | Records |
|------------|---------:|
| AllZoning | 2151 |
| PlanningArticle | 127 |
| PlanningRule | 510 |
| PlanningAllowedUse | 252 |
| PlanningProhibitedUse | 90 |
| PlanningEquipment | 2832 |
| PlanningRoad | 1907 |
| PlanningRoadPolygon | 1927 |

---

# Import Pipeline

Every dataset follows the same workflow.

```
Official GIS / CSV
        │
        ▼
Python preprocessing
        │
        ▼
Convert WKT to GeoJSON
        │
        ▼
Convert coordinates to WGS84
        │
        ▼
Repair invalid geometries
        │
        ▼
Export JSON
        │
        ▼
MongoDB Import Script
```

---

# Geometry Repair

Some geometries contained invalid topology.

Issues encountered:

- duplicate vertices
- self-intersections
- invalid loops

Repair was performed using:

```python
shapely.validation.make_valid()
```

All repaired geometries were exported separately and imported into MongoDB.

Final result:

- All zoning polygons imported successfully.
- All road polygons imported successfully.

---

# Spatial Indexes

Spatial collections use MongoDB's `2dsphere` index.

Collections using geospatial indexing:

- AllZoning
- PlanningBoundary
- PlanningEquipment
- PlanningRoad
- PlanningRoadPolygon

---

# Folder Structure

```
backend/

├── datasets/
│   ├── AllZoning.json
│   ├── Commune.json
│   ├── PlanningBoundary.json
│   ├── PlanningDocument.json
│   ├── ZoningPolygon.json
│   ├── RoadPolygon_Repaired.json
│   └── ...
│
├── models/
│
├── scripts/
│   ├── import/
│   │   ├── importPlanningDocument.js
│   │   ├── importCommune.js
│   │   ├── importPlanningBoundary.js
│   │   ├── importAllZoning.js
│   │   ├── importPlanningArticle.js
│   │   ├── importPlanningRule.js
│   │   ├── importPlanningAllowedUse.js
│   │   ├── importPlanningProhibitedUse.js
│   │   ├── importPlanningEquipment.js
│   │   ├── importPlanningRoad.js
│   │   ├── importPlanningRoadPolygon.js
│   │   └── importSingleRoadPolygon.js
│   │
│   ├── checkAllZoning.js
│   ├── checkRoadPolygons.js
│   └── findMissingRoadPolygon.js
│
└── models/
```

---

# AI Capabilities Enabled

The imported database allows the AI platform to:

- Retrieve zoning from GPS coordinates.
- Determine whether a property lies within a planning document.
- Retrieve applicable planning regulations.
- Determine permitted and prohibited land uses.
- Search planning articles and rules.
- Locate nearby roads and public facilities.
- Support automated real estate due diligence reports.

---

# Future Work

The current architecture is designed to scale.

Future work includes:

- Import planning documents from additional communes.
- Import additional Moroccan regions.
- Connect cadastral datasets.
- Integrate conservation foncière data.
- Connect parcel information.
- Build AI-powered geospatial search.
- Generate complete due diligence reports from a property address or GPS coordinates.

---

# Notes

During the import process, several invalid geometries were identified in the official GIS data. These geometries were repaired using **Shapely** before being re-imported into MongoDB.

The import scripts are reusable and can be executed again whenever new planning documents are processed.