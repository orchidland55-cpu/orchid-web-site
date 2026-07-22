export type AnalysisResult = {
    commune: string;
    province: string;
    region: string;
};

export type AnalyzeLocationResponse =
    | {
        success: true;
        supported: true;
        data: AnalysisResult;
    }
    | {
        success: false;
        supported: false;
        message: string;
    };

export async function analyzeLocation(
    latitude: number,
    longitude: number
): Promise<AnalyzeLocationResponse> {

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/due-diligence/analyze`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                latitude,
                longitude,
            }),
        }
    );

    return response.json();

}