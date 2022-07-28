const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH, OAUTH_LINK } =
  process.env;

const auth = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  MAILING_REFRESH,
  OAUTH_LINK
);

const sendEmail = (data = {}) => {
  const { email, name, url } = data;
  auth.setCredentials({
    refresh_token: MAILING_REFRESH,
  });
  const accessToken = auth.getAccessToken();
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "oauth2",
      user: EMAIL,
      clientId: MAILING_ID,
      clientSecret: MAILING_SECRET,
      refreshToken: MAILING_REFRESH,
      accessToken,
    },
  });
  const mailoptions = {
    from: EMAIL,
    to: email,
    subject: "Facebook jdvpl email verification",
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img style="width:30px" src="https://res.cloudinary.com/jdvpl/image/upload/v1658353608/facebook-jdvpl/logo_ipsutz.png" alt=""><span>Action requise: Activate your facebook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created a new facebook account. To complete your registration, please confirm your account.</span></div><a href="${url}" style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all your friends, once registered on facebook, you can share photos, organize events and much more.</span></div></div>`,
  };
  stmp.sendMail(mailoptions, (err, res) => {
    if (err) return err;
    return res;
  });
};

// send code
const sendEmailCode = (data = {}) => {
  const { email, name, code } = data;
  auth.setCredentials({
    refresh_token: MAILING_REFRESH,
  });
  const accessToken = auth.getAccessToken();
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "oauth2",
      user: EMAIL,
      clientId: MAILING_ID,
      clientSecret: MAILING_SECRET,
      refreshToken: MAILING_REFRESH,
      accessToken,
    },
  });
  const mailoptions = {
    from: EMAIL,
    to: email,
    subject: "Reset facebook password",
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img style="width:30px" src="https://res.cloudinary.com/jdvpl/image/upload/v1658353608/facebook-jdvpl/logo_ipsutz.png" alt=""><span>Action requise: Activate your facebook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created a new facebook account. To complete your registration, please confirm your account.</span></div><a style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all your friends, once registered on facebook, you can share photos, organize events and much more.</span></div></div>`,
  };
  stmp.sendMail(mailoptions, (err, res) => {
    if (err) return err;
    return res;
  });
};

module.exports = { sendEmail, sendEmailCode };
