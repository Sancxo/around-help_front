export default interface User {
    [index: string]: string | number | number[] | Date | undefined,
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    birthdate?: Date,
    about?: string,
    address_id?: number,
    chat_rooms?: number[],
    id_card?: string | undefined,
    avatar?: string | undefined,
    created_at?: Date
}

export interface RegistrationValues {
    [index: string]: string | number | number[] | Date | File | undefined,
    first_name: string,
    last_name: string,
    email: string,
    current_password?: string,
    birthdate?: Date,
    about?: string,
    address_id?: number,
    avatar?: File | undefined
}


export interface LoginValues {
    email: string,
    password: string
}