export interface UserDto {
  nombre: string;
  apellido: string;
  role: string;
  email: string;
  password: string;
}
export type UserDtoNullable = UserDto | null;
