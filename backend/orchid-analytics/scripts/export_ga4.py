from pathlib import Path

import pandas as pd

from google.oauth2 import service_account

from google.analytics.data_v1beta import BetaAnalyticsDataClient

from google.analytics.data_v1beta.types import (
    RunReportRequest,
    Dimension,
    Metric,
    DateRange,
)

from config.config import (
    PROPERTY_ID,
    CREDENTIALS,
    RAW_DATA,
)

def get_client():

    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS
    )

    return BetaAnalyticsDataClient(credentials=credentials)

def run_report(
    client,
    dimensions,
    metrics,
    start_date="365daysAgo",
    end_date="today",
):

    request = RunReportRequest(

        property=f"properties/{PROPERTY_ID}",

        dimensions=[
            Dimension(name=d)
            for d in dimensions
        ],

        metrics=[
            Metric(name=m)
            for m in metrics
        ],

        date_ranges=[
            DateRange(
                start_date=start_date,
                end_date=end_date
            )
        ],
    )

    response = client.run_report(request)

    rows = []

    for row in response.rows:

        record = {}

        for i, dimension in enumerate(dimensions):
            record[dimension] = row.dimension_values[i].value

        for i, metric in enumerate(metrics):
            record[metric] = row.metric_values[i].value

        rows.append(record)

    return pd.DataFrame(rows)

def export_traffic_sources(client):

    print("Exporting traffic sources...")

    df = run_report(

        client,

        dimensions=[
            "sessionSource",
            "sessionMedium",
        ],

        metrics=[
            "sessions",
            "activeUsers",
            "engagedSessions",
            "engagementRate",
            "averageSessionDuration",
        ],
    )

    RAW_DATA.mkdir(
        parents=True,
        exist_ok=True,
    )

    output = RAW_DATA / "traffic_sources.csv"

    df.to_csv(
        output,
        index=False,
    )

    print(f"Saved -> {output}")
    
def export_property_pages(client):

    print("Exporting property pages...")

    df = run_report(

        client,

        dimensions=[
            "pageTitle",
        ],

        metrics=[
            "screenPageViews",
            "activeUsers",
            "engagedSessions",
            "engagementRate",
            "averageSessionDuration",
            "eventCount",
        ],
    )

    output = RAW_DATA / "property_pages.csv"

    df.to_csv(
        output,
        index=False,
    )

    print(f"Saved -> {output}")

def main():

    print("=" * 50)
    print("ORCHID ANALYTICS")
    print("=" * 50)

    client = get_client()

    export_traffic_sources(client)

    export_property_pages(client)

    print()
    print("Done.")

if __name__ == "__main__":

    main()