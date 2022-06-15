# BigQuery Specifics

The data is stored in a format optimal for Google BigQuery. We list below the things that you might need to know about those caveats

## Denormalization

We denormalize as much as possible in the dimension tables using [STRUCT](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#struct_type). Data about the `site` is therefore accessible in the `dim_contents__ext` table.

Most BI tools seem to understand `STRUCT` correctly, therefore `dim_contents__ext.site.id` is available as a column in most BI tools.

## Translatable Fields

Some fields in Lumapps are `Translatable` : they are available in multiple-language in the platform.

_Example: A Content Title must be defined is at least one language_

Those fields are stored as `ARRAY<STRUCT<code STRING value STRING>>` in BigQuery.
A `content.title` might look like this :

```
[{'code': en, 'value': 'title in english'}, {'code':'fr', 'value': 'titre en français'}]
```

This format of data is not natively handled by BI tools. When it comes to analyzing the data, you must select the language in which those fields are displayed in dashboards. We feel the following to snippet of code will be useful to you.

### Example 1 : Defaulting to english when dealing with translatable fields

In this snippet, we default to **english** for translated fields of the content table 

``` sql
SELECT c.id, c.created_at, c.published_at, c.site.status as site_status, c.site.slug as site_slug, c.status as content_status, 
(SELECT value from unnest(c.title) where code="en") as content_title ,
(SELECT value from unnest(c.slug) where code="en") as content_slug,
(SELECT value from unnest(c.site.title) where code="en") as site_title,
(SELECT value from unnest(c.custom_content_type.name) where code="en") as content_type_name,
FROM hm-prod-go-cell-005.gold.dim_contents__ext c 
```

### Example 2 : Defaulting to any language 

In this snippet, we default to any available language available

``` sql
SELECT c.id, c.created_at, c.published_at, c.site.status as site_status, c.site.slug as site_slug, c.status as content_status, 
(SELECT value from unnest(c.title) order by code) as content_title ,
(SELECT value from unnest(c.slug) order by code) as content_slug,
(SELECT value from unnest(c.site.title) order by code) as site_title,
(SELECT value from unnest(c.custom_content_type.name) order by code) as content_type_name,
FROM hm-prod-go-cell-005.gold.dim_contents__ext c 
```