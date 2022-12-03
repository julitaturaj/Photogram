import * as fs from 'fs';
import * as path from 'path';
import { compile } from 'handlebars';
import mjml2html from 'mjml';

const signUpContent = fs.readFileSync(
  path.join(process.cwd(), 'src/auth/email-templates/sign-up-email.mjml'),
  'utf-8',
);
export const getSignUpMailContent = (
  context: Record<string, string>,
): string => {
  return getTemplate(signUpContent, context);
};

const getTemplate = (content: string, context: Record<string, string>) => {
  const template = compile(content);
  const mjml = template(context);
  const { html } = mjml2html(mjml);
  return html;
};
