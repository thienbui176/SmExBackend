import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import BaseService from 'src/Core/Base/BaseService';
import UserLoginRequest from './Request/User/UserLoginRequest';
import { UserService } from '../User/UserService';
import Messages from 'src/Core/Messages/Messages';
import * as bcrypt from 'bcrypt';
import UserRegisterRequest from './Request/User/UserRegisterRequest';
import { User, USER_STATUS } from '../User/Entity/User';
import TokenService from 'src/Providers/Token/TokenService';
import JwtPayload from 'src/Core/Interfaces/JwtPayload';
import MailService from 'src/Providers/Mailer/MailService';
import UserVerifyEmailRequest from './Request/User/VerifyEmailRequest';
import ChangePasswordRequest from './Request/User/ChangePasswordRequest';
import { TokenPayload } from 'src/Providers/Token/Interfaces/TokenPayload';

@Injectable()
export class AuthUserService extends BaseService {
    private userService: UserService;
    private tokenService: TokenService;
    private mailService: MailService;
    TYPE_REQUEST_CHANGE_PASSWORD = 'REQUEST_CHANGE_PASSWORD';
    constructor(userService: UserService, tokenService: TokenService, mailService: MailService) {
        super();
        this.userService = userService;
        this.tokenService = tokenService;
        this.mailService = mailService;
    }

    public async login(loginRequest: UserLoginRequest) {
        try {
            this.logger.log(loginRequest.email + 'Log Login Request');
            const user = await this.userService.findByEmail(loginRequest.email);
            if (!user) throw new UnauthorizedException(Messages.MSG_001);
            if (!(await bcrypt.compare(loginRequest.password, user.password)))
                throw new UnauthorizedException(Messages.MSG_001);

            switch (user.status) {
                case USER_STATUS.INACTIVE:
                    throw new ForbiddenException(Messages.MSG_005);
                case USER_STATUS.BLOCKED:
                    throw new ForbiddenException(Messages.MSG_006);
                default:
                    break;
            }

            const payload: JwtPayload = {
                sub: user._id.toString(),
                email: user.email,
            };
            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken(payload);

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            this.logger.error(error);
            if (error) throw error;
            throw new InternalServerErrorException();
        }
    }

    public async register(registerRequest: UserRegisterRequest) {
        try {
            this.logger.log(JSON.stringify(registerRequest));
            const user = await this.userService.findByEmail(registerRequest.email);
            if (user) throw new ConflictException(Messages.MSG_002);
            const passwordHashed = await bcrypt.hash(registerRequest.password, 10);
            const userRegister = new User();
            userRegister.email = registerRequest.email;
            userRegister.password = passwordHashed;
            userRegister.profile = {
                fullName: registerRequest.fullName,
                gender: registerRequest.gender,
            };

            const userCreated = await this.userService.create(userRegister);
            if (userCreated) {
                // Handle send mail veriry account
                const tokenVerifyEmail = this.tokenService.generateVerifyEmailToken(
                    registerRequest.email,
                );
                await this.sendMailVerifyUser(userCreated.email, tokenVerifyEmail);
            }
            return;
        } catch (error) {
            this.logger.error(error);
            if (error) throw error;
            throw new InternalServerErrorException();
        }
    }

    public async verifyEmail(verifyEmailRequest: UserVerifyEmailRequest): Promise<void> {
        if (!this.tokenService.validateToken(verifyEmailRequest.token, 'verifyEmail'))
            throw new ForbiddenException(Messages.MSG_007);

        const email = this.tokenService.getEmail(verifyEmailRequest.token);
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException(Messages.MSG_008);
        await this.userService.update(user._id.toString(), {
            status: USER_STATUS.ACTIVE,
        });
        return;
    }

    public async requestChangePassword(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('Email này chưa được đăng ký.');

        const tokenChangePassword = this.tokenService.generateToken<
            TokenPayload<{ email: string }>
        >({ type: this.TYPE_REQUEST_CHANGE_PASSWORD, subject: { email } }, '10m');

        await this.sendMailChangePassword(email, tokenChangePassword);
    }

    public async changePassword(token: string, changePasswordRequest: ChangePasswordRequest) {
        try {
            if (!this.tokenService.validateToken(token, 'token'))
                throw new ForbiddenException(Messages.MSG_007);
            const { subject, type } =
                this.tokenService.decodeToken<TokenPayload<{ email: string }>>(token);
            if (type !== this.TYPE_REQUEST_CHANGE_PASSWORD)
                throw new ForbiddenException('Token không tồn tại.');
            const email = subject.email;
            const user = await this.userService.findByEmail(email);
            if (!user) throw new NotFoundException('Email này chưa được đăng ký.');
            if (!(await bcrypt.compare(user.password, changePasswordRequest.oldPassword)))
                throw new UnauthorizedException('Mật khẩu cũ không đúng. ');

            const passwordHashed = await bcrypt.hash(changePasswordRequest.newPassword, 10);
            await this.userService.update(user._id.toString(), { password: passwordHashed });
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    private async sendMailVerifyUser(email: string, tokenVerifyEmail: string) {
        const verifyUrl = `localhost:3000/auth/user/verify-email?token=${tokenVerifyEmail}`;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #333;">Xác thực tài khoản của bạn</h2>
            <p>Chào <strong>${email}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấn vào nút bên dưới để xác thực email:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Xác thực Email
              </a>
            </div>
            <p>Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
          </div>
        `;

        await this.mailService.sendMail(email, 'Xác thực tài khoản qua Email', html);
    }

    private async sendMailChangePassword(email: string, tokenChangePassword: string) {
        const changePasswordUrl = `localhost:3000/auth/change-password?token=${tokenChangePassword}`;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #333;">Đổi mật khẩu của bạn</h2>
            <p>Chào <strong>${email}</strong>,</p>
             <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để đổi mật khẩu:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${changePasswordUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Đổi mật khẩu
              </a>
            </div>
            <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
          </div>
        `;

        await this.mailService.sendMail(email, 'Đổi mật khẩu tài khoản', html);
    }
}
