import { apiService } from "@/services/api";

export type AnalysisResult = {

    commune: string;

    province: string;

    region: string;

    planning: {

        available: boolean;

        planningDocument?: string;

        approvalDate?: string;

        zoningCode?: string;

        zoningDesignation?: string;

        allowedUses: any[];

        prohibitedUses: any[];

        rules: any[];

    };

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