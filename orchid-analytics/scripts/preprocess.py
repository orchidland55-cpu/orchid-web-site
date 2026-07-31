import pandas as pd

from config.config import (
    RAW_DATA,
    PROCESSED_DATA,
)
def clean_dataframe(df):

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Replace empty strings with missing values
    df = df.replace("", pd.NA)

    # Remove rows where every value is missing
    df = df.dropna(how="all")

    return df

def preprocess_traffic():

    print("Cleaning traffic sources...")

    df = pd.read_csv(
        RAW_DATA / "traffic_sources.csv"
    )

    df = clean_dataframe(df)
    df = df[
        (df["sessionSource"] != "(not set)") &
        (df["sessionMedium"] != "(not set)")
    ]

    # Remove localhost traffic
    df = df[
        ~df["sessionSource"].str.contains(
        "localhost",
        case=False,
        na=False
        )
    ]

    numeric_columns = [

        "sessions",
        "activeUsers",
        "engagedSessions",
        "engagementRate",
        "averageSessionDuration"

    ]

    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    df = df.fillna(0)

    output = (
        PROCESSED_DATA /
        "traffic_sources_clean.csv"
    )

    PROCESSED_DATA.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        output,
        index=False
    )

    print(f"Saved -> {output}")

    def preprocess_properties():

        print("Cleaning property pages...")

    df = pd.read_csv(
        RAW_DATA / "property_pages.csv"
    )

    df = clean_dataframe(df)

    numeric_columns = [

        "screenPageViews",
        "activeUsers",
        "engagedSessions",
        "engagementRate",
        "averageSessionDuration",
        "eventCount"

    ]

    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    df = df.fillna(0)

    output = (
        PROCESSED_DATA /
        "property_pages_clean.csv"
    )

    df.to_csv(
        output,
        index=False
    )

    print(f"Saved -> {output}")

def preprocess_properties():

    print("Cleaning property pages...")

    df = pd.read_csv(
        RAW_DATA / "property_pages.csv"
    )

    df = clean_dataframe(df)

    numeric_columns = [

        "screenPageViews",
        "activeUsers",
        "engagedSessions",
        "engagementRate",
        "averageSessionDuration",
        "eventCount"

    ]

    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    df = df.fillna(0)

    output = (
        PROCESSED_DATA /
        "property_pages_clean.csv"
    )

    df.to_csv(
        output,
        index=False
    )

    print(f"Saved -> {output}")

def main():

    print("=" * 50)
    print("PREPROCESSING")
    print("=" * 50)

    preprocess_traffic()

    preprocess_properties()

    print()
    print("Finished.")

if __name__ == "__main__":

    main()