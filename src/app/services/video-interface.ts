export interface VideoData {
    created_at: Date | string;
    title: string;
    description: string;
    category: string;
    created_from?: string; 
    video_file?: string;
}