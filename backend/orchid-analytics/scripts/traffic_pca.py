import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler

from config.config import (
    PROCESSED_DATA,
    RESULTS,
)
def main():

    print("=" * 50)
    print("TRAFFIC SOURCE PCA")
    print("=" * 50)

    df = pd.read_csv(
        PROCESSED_DATA /
        "traffic_sources_clean.csv"
    )

    identifiers = df[[
        "sessionSource",
        "sessionMedium"
    ]]

    features = df[[
        "sessions",
        "activeUsers",
        "engagedSessions",
        "engagementRate",
        "averageSessionDuration"
    ]]
    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(
        features
    )
    pca = PCA(
        n_components=1
    )

    component = pca.fit_transform(
        X_scaled
    )
    normalizer = MinMaxScaler(
        feature_range=(0, 100)
    )

    score = normalizer.fit_transform(
        component
    )

    identifiers["AI_Engagement_Score"] = (
        score.round(2)
    )
    result = pd.concat(
        [
            identifiers,
            features
        ],
        axis=1
    )

    result = result.sort_values(
        "AI_Engagement_Score",
        ascending=False
    )
    RESULTS.mkdir(
        parents=True,
        exist_ok=True
    )

    output = (
        RESULTS /
        "traffic_engagement_scores.csv"
    )

    result.to_csv(
        output,
        index=False
    )

    print()
    print(result)

    print()
    print("Saved ->", output)

if __name__ == "__main__":

    main()

