import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

from config.config import (
    PROCESSED_DATA,
    RESULTS,
)

def main():

    print("=" * 50)
    print("PROPERTY PAGE CLUSTERING")
    print("=" * 50)

    df = pd.read_csv(
        PROCESSED_DATA /
        "property_pages_clean.csv"
    )
    features = df[
        [
            "screenPageViews",
            "activeUsers",
            "engagedSessions",
            "engagementRate",
            "averageSessionDuration",
            "eventCount"
        ]
    ]
    scaler = StandardScaler()

    X = scaler.fit_transform(features)

    model = KMeans(
        n_clusters=3,
        random_state=42,
        n_init=10
    )

    clusters = model.fit_predict(X)

    result = df.copy()

    cluster_names = {
        0: "Highly Engaging Pages",
        1: "Popular Pages",
        2: "Low Engagement Pages"
    }

    result["Cluster"] = clusters
    result["Cluster_Name"] = result["Cluster"].map(cluster_names)

    result = result.sort_values(
        "Cluster"
    )

    RESULTS.mkdir(
        parents=True,
        exist_ok=True
    )

    output = (
        RESULTS /
        "property_clusters.csv"
    )

    result.to_csv(
        output,
        index=False
    )

    print()
    summary = (
        result
        .groupby("Cluster")
        .agg({
            "screenPageViews": "mean",
            "activeUsers": "mean",
            "engagedSessions": "mean",
            "engagementRate": "mean",
            "averageSessionDuration": "mean",
            "eventCount": "mean",
            "pageTitle": "count"
        })
    )

    summary = summary.rename(columns={
        "pageTitle": "Number of Pages"
    })

    print()
    print("Cluster Summary")
    print("=" * 50)
    print(summary.round(2))

    summary.to_csv(
        RESULTS / "cluster_summary.csv",
    )

    print()
    print("Saved ->", output)
    
if __name__ == "__main__":

    main()