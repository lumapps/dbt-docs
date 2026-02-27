# Connect to Datalake using BigQuery CLI / API

## **📋 Prerequisites & Credentials**

Before you begin, ensure you have the following details provided by your administrator:

* **Service Account:** [`Reference`](https://docs.cloud.google.com/iam/docs/service-accounts-create)
* **Billing Project:** `lumapps-datalake-external`
* **Data Project:** `hm-prod-go-cell-XXX (replace this with your cell)`
* **Dataset:** `external`
* **JSON Key File:** You must have the private key file for the Service Account downloaded to your local environment.

---

## **🛠 Method 1: Connecting via BigQuery CLI (`bq`)**

The `bq` tool is part of the Google Cloud SDK and is ideal for quick queries and data movement tasks.

### **1\. Initialize the Environment**

If you haven't already, install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and initialize it:

Bash

```shell
gcloud init
```

### **2\. Authenticate the Service Account**

Activate the service account using your JSON key file. This tells GCP who is performing the actions.

```shell
gcloud auth activate-service-account --key-file=path/to/your-key.json
```

### **3\. Run a Sample Query**

When querying, always specify the full path: `project.dataset.table`.

**Note:** Since the data is in a different project than your billing project, the `--project_id` flag ensures the costs are billed to the correct account.

Bash

```
bq query --use_legacy_sql=false \
--project_id=lumapps-datalake-external \
'SELECT dc.id, dc.title
 FROM `hm-prod-go-cell-XXX.external.dim_contents__ext` dc
 LIMIT 5'
```

### **4\. Copy Data to Your Project**

To move data from the LumApps Data Lake into your own Google Cloud project:

Bash

```
bq cp -f \
hm-prod-go-cell-XXX:external.dim_contents__ext \
your-target-project:your_dataset.your_table_name
```

---

## **💻 Method 2: Connecting via API (Python Example)**

Using the Client Libraries is the best approach for automating workflows or building applications.

### **1\. Install the Library**

```shell
pip install --upgrade google-cloud-bigquery
```

### **2\. Set Environment Variable**

Point your application to your service account credentials:

```shell
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-key.json"
```

### **3\. Python Connection Script**

This script initializes the client using your **Billing Project** and executes a query.

Python

```py
from google.cloud import bigquery

# Identify the billing project
billing_project_id = "lumapps-datalake-external"

# Construct a BigQuery client object
client = bigquery.Client(project=billing_project_id)

query = """
    SELECT id, title
    FROM `hm-prod-go-cell-XXX.external.dim_contents__ext`
    LIMIT 5
"""

# Run the query
query_job = client.query(query)  # API request

print("The query data:")
for row in query_job:
    print(f"ID: {row.id} | Title: {row.title}")
```

---

## **⚠️ Important Considerations**

* **Billing Project:** Always ensure `lumapps-datalake-external` is set as your project ID in your configuration. This is the project with permission to run jobs.
* **Data Residency:** The data resides in `hm-prod-go-cell-XXX`. Ensure your queries reference this project explicitly in the `FROM` clause.

