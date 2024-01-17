export class User {
    id?: number;
    username: String;
    first_name: string;
    last_name: string;
    email: string;
    is_verified: boolean;
    password: string;

    constructor(obj?:any){
        this.id = obj ? obj.id: null;
        this.username = obj ? obj.username: '';
        this.first_name = obj ? obj.first_name: '';
        this.last_name = obj ? obj.last_name: '';
        this.email = obj ? obj.email: '';
        this.is_verified = obj ? obj.ist_verified: '';
        this.password= obj ? obj.password: '';
    }

    public toJSON(){
        return {
            id: this.id,
            username: this.username,
           first_name: this.first_name,
           last_name: this.last_name,
           email: this.email,
           ist_verified: this.is_verified,
           password: this.password
        }
    }
}