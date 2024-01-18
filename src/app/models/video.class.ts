export class Video {
    id?: number;
    created_at: Date;
    created_from: string;
    title: string;
    description: string;
    category: string;
    video_file: string;
    likes: number[];

    constructor(obj?:any){
        this.id = obj ? obj.id: null;
        this.created_at = obj ? obj.created_at: null;
        this.created_from = obj ? obj.created_from: '';
        this.title = obj ? obj.title: '';
        this.description = obj ? obj.description: '';
        this.category = obj ? obj.category: '';
        this.video_file = obj ? obj.video_file: '';
        this.likes = obj ? obj.likes: [];
    }

    public toJSON(){
        return {
            id: this.id,
            created_at: this.created_at,
           created_from: this.created_from,
           title: this.title,
           description: this.description,
           category: this.category,
           video_file: this.video_file,
           likes: this.likes
        }
    }
}