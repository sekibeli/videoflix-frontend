export interface VideoQuality {
    quality: string;
    video_file: string;
  }


export class Video {
    id: number;
    created_at: Date;
    created_from: number;
    title: string;
    description: string;
    category: string;
    video_file: string;
    likes: number[];
    thumbnail: string;
    view_count: number;
    qualities?: VideoQuality[];
    film_rating: number;

    constructor(obj?:any){
        this.id = obj ? obj.id: null;
        this.created_at = obj ? obj.created_at: null;
        this.created_from = obj ? obj.created_from: null;
        this.title = obj ? obj.title: '';
        this.description = obj ? obj.description: '';
        this.category = obj ? obj.category: '';
        this.video_file = obj ? obj.video_file: '';
        this.likes = obj ? obj.likes: [];
        this.thumbnail = obj ? obj.thumbnail: '';
        this.view_count = obj ? obj.view_count: null;
        this.qualities = obj ? obj.qualities : [];
        this.film_rating = obj ? obj.film_rating : null;
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
           likes: this.likes,
           thumbnail: this.thumbnail,
           view_count: this.view_count,
           qualities: this.qualities,
           film_rating: this.film_rating
        }
    }
}