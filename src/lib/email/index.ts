export {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationApprovedEmail,
  sendNewMessageEmail,
  type SendEmailParams,
  type SendEmailResult,
} from "./send";

export {
  processTemplate,
  getDefaultVars,
  type TemplateVars,
} from "./templates";
