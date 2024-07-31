import { Role, TokenType } from "@prisma/client";

// interface usada para tipar o request da rota de cadastro de usuário
interface ICreateUserRequest {
  email: string;
  cnpj: string;
  senha: string;
  nome?: string;
  role: Role;
}

interface ICreateTokenRequest {
    token: string;
    userId: string;
    expires: Date;
    type: TokenType;
    blacklisted: boolean;
}

interface ITokenResponse {
  token: string;
  expires: Date;
}

interface IAuthTokensResponse {
  access: ITokenResponse;
  refresh?: ITokenResponse;
}

export { IAuthTokensResponse, ICreateTokenRequest, ICreateUserRequest, ITokenResponse };

