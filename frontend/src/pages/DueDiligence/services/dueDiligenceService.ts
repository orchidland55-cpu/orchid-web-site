import { apiService } from "@/services/api";

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

    return apiService.analyzeLocation(
        latitude,
        longitude
    );

}