import config from '@config/config';
import logger from '@config/logger';
import nodemailer from 'nodemailer';

// criação do transporter do nodemailer
// O serviço de transporte do nodemailer é responsável por enviar os emails utilizando o protocolo SMTP (Simple Mail Transfer Protocol).
// Ele é inicializado com as configurações do SMTP (como o host, porta, username e password) que são fornecidos no arquivo de configuração .env.
// O serviço de transporte cria uma conexão com o servidor de email e, em seguida, envia os emails que são configurados por meio dos métodos `sendMail` ou `sendMailAsync`.

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Conectado ao servidor de email!'))
    .catch(() =>
      logger.warn(
        'Não foi possível conectar ao servidor de email. Verifique se as configurações do SMTP options no arquivo .env estão preenchidas corretamente.'
      )
    );
}

/**
 * Enviar email
 * @param {string} toEmail para o qual o email será enviado
 * @param {string} subject assunto do email
 * @param {string} text texto do email
 * @returns {Promise}
 */
const sendEmail = async (toEmail: string, subject: string, text: string) => {
  const msg = { from: config.email.from, to:toEmail, subject, text };
  await transport.sendMail(msg);
};

/**
 * Enviar email de redefinição de senha
 * @param {string} toEmail para o qual o email será enviado
 * @param {string} token token de redefinição de senha
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (toEmail: string, token: string) => {

  const subject = 'Redefinição de senha';
  // Substitua aqui pela URL do seu front-end no env file
  const resetPasswordUrl = `${config.frontend.url}/reset-password?token=${token}`;
  const text = `Caro usuário, para redefinir sua senha, clique no seguinte link: ${resetPasswordUrl}. Se voce não solicitou esta alteração, então ignore este e-mail.`;
  await sendEmail(toEmail, subject, text);
};

/**
 * Enviar email de verificação
 * @param {string} toEmail para o qual o email será enviado
 * @param {string} token token de verificação de email
 * @returns {Promise}
 */
const sendVerificationEmail = async (toEmail: string, token: string) => {
  const subject = 'Verificação de email';
  // Substitua aqui pela URL do seu front-end no env file
  const verificationEmailUrl = `${config.frontend.url}/verify-email?token=${token}`;
  const text = `Caro usuário,
Para verificar seu email na Plataforma Snapflow, clique neste link: ${verificationEmailUrl}`;
  await sendEmail(toEmail, subject, text);
};

export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail
};
