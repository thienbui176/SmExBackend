import JwtPayload from 'src/Core/Interfaces/JwtPayload';

export default interface ITokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  validateToken(token: string): boolean;
  getEmail(token: string): string;
  getId(token: string): string;
  getAuthentication(token: string): any;
}
