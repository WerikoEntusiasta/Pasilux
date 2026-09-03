import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

export interface EmailLeadPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
}

export interface EmailBudgetPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  city: string;
  state: string;
  notes?: string;
  items?: Array<{
    profileCode?: string;
    length?: number | string;
    quantity?: number | string;
    color?: string;
    lightTemp?: string;
  }>;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
}

/**
 * Returns whether SMTP credentials have been declared in environment variables.
 */
export function isEmailConfigured(): boolean {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return Boolean(host && user && pass);
}

/**
 * Returns email configuration status for frontend diagnostics.
 */
export function getEmailConfigStatus(defaultRecipient?: string) {
  const configured = isEmailConfigured();
  const host = process.env.SMTP_HOST || '';
  const port = process.env.SMTP_PORT || '587';
  const user = process.env.SMTP_USER || '';
  const recipient = process.env.EMAIL_TO || defaultRecipient || 'contato@pasilux.com.br';
  const from = process.env.EMAIL_FROM || `Pasilux Perfis LED <${user || 'contato@pasilux.com.br'}>`;

  // Mask user email for security
  const maskedUser = user.length > 4 
    ? `${user.substring(0, 3)}***@${user.split('@')[1] || '...'}` 
    : user ? 'Configurado' : 'Não configurado';

  return {
    configured,
    host: host || 'Não configurado',
    port,
    user: maskedUser,
    recipient,
    from,
  };
}

/**
 * Lazy creation of nodemailer transporter
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Sends a contact form lead notification email.
 */
export async function sendLeadEmail(lead: EmailLeadPayload, defaultRecipient?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = createTransporter();
  const recipient = process.env.EMAIL_TO || defaultRecipient || 'contato@pasilux.com.br';
  const from = process.env.EMAIL_FROM || `"Pasilux Perfis LED" <${process.env.SMTP_USER || 'contato@pasilux.com.br'}>`;
  const cc = process.env.EMAIL_CC || undefined;

  if (!transporter) {
    console.warn('[Email Service] SMTP não configurado no .env. O lead foi salvo com sucesso no banco de dados.');
    return {
      success: false,
      error: 'SMTP não configurado no .env (variáveis SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_TO necessárias).',
    };
  }

  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}` : null;
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Prepare attachments if file uploaded
  const attachments: Array<{ filename: string; path: string }> = [];
  if (lead.attachmentUrl) {
    const filename = path.basename(lead.attachmentUrl);
    const localFilePath = path.join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(localFilePath)) {
      attachments.push({
        filename: lead.attachmentName || filename,
        path: localFilePath,
      });
    }
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; color: #18181b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: #09090b; padding: 28px 32px; border-bottom: 3px solid #fae013; }
    .header-badge { display: inline-block; background: rgba(250, 224, 19, 0.15); color: #fae013; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .content { padding: 32px; }
    .section-title { font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #f4f4f5; padding-bottom: 6px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; }
    .info-table td.label { width: 35%; color: #71717a; font-weight: 600; }
    .info-table td.value { color: #09090b; font-weight: 500; }
    .message-box { background: #fafafa; border: 1px solid #e4e4e7; border-left: 4px solid #fae013; border-radius: 8px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #27272a; margin-bottom: 24px; white-space: pre-wrap; }
    .attachment-box { background: #fdfae5; border: 1px solid #fae013; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #854d0e; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
    .actions { text-align: center; margin-top: 28px; padding-top: 24px; border-top: 1px solid #e4e4e7; }
    .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: bold; text-decoration: none; margin: 4px 6px; }
    .btn-wa { background: #16a34a; color: #ffffff; }
    .btn-mail { background: #09090b; color: #ffffff; }
    .footer { background: #fafafa; padding: 20px 32px; text-align: center; font-size: 11px; color: #a1a1aa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="header-badge">Novo Contato do Site</span>
      <h1>Pasilux Iluminação</h1>
    </div>

    <div class="content">
      <div class="section-title">Dados do Contato</div>
      <table class="info-table">
        <tr>
          <td class="label">Nome:</td>
          <td class="value"><strong>${lead.name}</strong></td>
        </tr>
        <tr>
          <td class="label">E-mail:</td>
          <td class="value"><a href="mailto:${lead.email}" style="color: #0284c7; text-decoration: none;">${lead.email}</a></td>
        </tr>
        <tr>
          <td class="label">Telefone / WhatsApp:</td>
          <td class="value">${lead.phone || 'Não informado'}</td>
        </tr>
        <tr>
          <td class="label">Assunto:</td>
          <td class="value"><strong>${lead.subject}</strong></td>
        </tr>
        <tr>
          <td class="label">Data de Envio:</td>
          <td class="value">${now}</td>
        </tr>
      </table>

      <div class="section-title">Mensagem</div>
      <div class="message-box">${lead.message}</div>

      ${lead.attachmentName ? `
      <div class="section-title">Arquivo / Projeto Anexado</div>
      <div class="attachment-box">
        <div>
          <strong>📎 ${lead.attachmentName}</strong> (${lead.attachmentSize || 'Anexo'})
        </div>
      </div>
      ` : ''}

      <div class="actions">
        ${waUrl ? `<a href="${waUrl}" class="btn btn-wa" target="_blank">📱 Responder no WhatsApp</a>` : ''}
        <a href="mailto:${lead.email}?subject=Re:%20${encodeURIComponent(lead.subject)}%20-%20Pasilux" class="btn btn-mail">✉️ Responder por E-mail</a>
      </div>
    </div>

    <div class="footer">
      Esta é uma mensagem automática enviada pelo formulário de contato do site <strong>Pasilux Perfis de LED</strong>.<br>
      Catanduva/SP — (17) 99106-6398 — contato@pasilux.com.br
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
[NOVO CONTATO PASILUX]
Nome: ${lead.name}
E-mail: ${lead.email}
Telefone: ${lead.phone || 'Não informado'}
Assunto: ${lead.subject}
Data: ${now}

MENSAGEM:
${lead.message}

${lead.attachmentName ? `Anexo: ${lead.attachmentName} (${lead.attachmentSize || ''})` : ''}
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: recipient,
      cc,
      replyTo: lead.email,
      subject: `[Novo Contato] ${lead.subject} - ${lead.name}`,
      text: textContent,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log(`[Email Service] Notificação de lead enviada com sucesso para ${recipient} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('[Email Service] Erro ao enviar e-mail de lead:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a budget / quote request notification email.
 */
export async function sendBudgetEmail(budget: EmailBudgetPayload, defaultRecipient?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = createTransporter();
  const recipient = process.env.EMAIL_TO || defaultRecipient || 'contato@pasilux.com.br';
  const from = process.env.EMAIL_FROM || `"Pasilux Perfis LED" <${process.env.SMTP_USER || 'contato@pasilux.com.br'}>`;
  const cc = process.env.EMAIL_CC || undefined;

  if (!transporter) {
    console.warn('[Email Service] SMTP não configurado no .env. O orçamento foi salvo com sucesso no banco de dados.');
    return {
      success: false,
      error: 'SMTP não configurado no .env.',
    };
  }

  const cleanPhone = (budget.phone || '').replace(/\D/g, '');
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}` : null;
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Prepare attachments if file uploaded
  const attachments: Array<{ filename: string; path: string }> = [];
  if (budget.attachmentUrl) {
    const filename = path.basename(budget.attachmentUrl);
    const localFilePath = path.join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(localFilePath)) {
      attachments.push({
        filename: budget.attachmentName || filename,
        path: localFilePath,
      });
    }
  }

  const itemsHtml = (budget.items && budget.items.length > 0)
    ? budget.items.map(item => `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 8px; font-weight: bold;">${item.profileCode || 'Perfil'}</td>
          <td style="padding: 8px;">${item.quantity || 1} un</td>
          <td style="padding: 8px;">${item.length ? item.length + ' m' : '-'}</td>
          <td style="padding: 8px;">${item.color || '-'}</td>
          <td style="padding: 8px;">${item.lightTemp || '-'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="5" style="padding: 8px; color: #71717a;">Especificações descritas no memorial abaixo.</td></tr>';

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; color: #18181b; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: #09090b; padding: 28px 32px; border-bottom: 3px solid #fae013; }
    .header-badge { display: inline-block; background: rgba(250, 224, 19, 0.15); color: #fae013; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .content { padding: 32px; }
    .section-title { font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #f4f4f5; padding-bottom: 6px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; }
    .info-table td.label { width: 35%; color: #71717a; font-weight: 600; }
    .info-table td.value { color: #09090b; font-weight: 500; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; text-align: left; }
    .items-table th { background: #f4f4f5; padding: 8px; font-size: 11px; text-transform: uppercase; color: #52525b; }
    .notes-box { background: #fafafa; border: 1px solid #e4e4e7; border-left: 4px solid #fae013; border-radius: 8px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #27272a; margin-bottom: 24px; white-space: pre-wrap; }
    .attachment-box { background: #fdfae5; border: 1px solid #fae013; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #854d0e; margin-bottom: 24px; }
    .actions { text-align: center; margin-top: 28px; padding-top: 24px; border-top: 1px solid #e4e4e7; }
    .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: bold; text-decoration: none; margin: 4px 6px; }
    .btn-wa { background: #16a34a; color: #ffffff; }
    .btn-mail { background: #09090b; color: #ffffff; }
    .footer { background: #fafafa; padding: 20px 32px; text-align: center; font-size: 11px; color: #a1a1aa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="header-badge">Nova Solicitação de Orçamento</span>
      <h1>Pasilux Iluminação</h1>
    </div>

    <div class="content">
      <div class="section-title">Dados do Solicitante</div>
      <table class="info-table">
        <tr>
          <td class="label">Cliente / Solicitante:</td>
          <td class="value"><strong>${budget.name}</strong></td>
        </tr>
        <tr>
          <td class="label">Empresa / Escritório:</td>
          <td class="value">${budget.company || 'Não informado'}</td>
        </tr>
        <tr>
          <td class="label">E-mail:</td>
          <td class="value"><a href="mailto:${budget.email}" style="color: #0284c7; text-decoration: none;">${budget.email}</a></td>
        </tr>
        <tr>
          <td class="label">Telefone / WhatsApp:</td>
          <td class="value">${budget.phone || 'Não informado'}</td>
        </tr>
        <tr>
          <td class="label">Localização:</td>
          <td class="value"><strong>${budget.city} / ${budget.state}</strong></td>
        </tr>
        <tr>
          <td class="label">Data da Solicitação:</td>
          <td class="value">${now}</td>
        </tr>
      </table>

      <div class="section-title">Itens / Perfis Solicitados</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Perfil</th>
            <th>Qtd</th>
            <th>Medida</th>
            <th>Cor</th>
            <th>Temp. Luz</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      ${budget.notes ? `
      <div class="section-title">Memorial Descritivo / Observações</div>
      <div class="notes-box">${budget.notes}</div>
      ` : ''}

      ${budget.attachmentName ? `
      <div class="section-title">Planta / Arquivo Anexo</div>
      <div class="attachment-box">
        <strong>📎 ${budget.attachmentName}</strong> (${budget.attachmentSize || 'Arquivo de projeto'})
      </div>
      ` : ''}

      <div class="actions">
        ${waUrl ? `<a href="${waUrl}" class="btn btn-wa" target="_blank">📱 Responder via WhatsApp</a>` : ''}
        <a href="mailto:${budget.email}?subject=Orçamento%20Pasilux%20Perfis%20LED%20-%20${encodeURIComponent(budget.name)}" class="btn btn-mail">✉️ Responder por E-mail</a>
      </div>
    </div>

    <div class="footer">
      Solicitação gerada diretamente pelo site <strong>Pasilux Perfis de LED</strong>.<br>
      Catanduva/SP — (17) 99106-6398 — contato@pasilux.com.br
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
[NOVA SOLICITAÇÃO DE ORÇAMENTO PASILUX]
Cliente: ${budget.name}
Empresa: ${budget.company || 'Não informado'}
E-mail: ${budget.email}
Telefone: ${budget.phone || 'Não informado'}
Cidade/UF: ${budget.city} / ${budget.state}
Data: ${now}

OBSERVAÇÕES / MEMORIAL:
${budget.notes || 'Sem observações.'}

${budget.attachmentName ? `Anexo: ${budget.attachmentName} (${budget.attachmentSize || ''})` : ''}
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: recipient,
      cc,
      replyTo: budget.email,
      subject: `[Novo Orçamento] ${budget.name} (${budget.city}/${budget.state}) - Pasilux`,
      text: textContent,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log(`[Email Service] Notificação de orçamento enviada para ${recipient} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('[Email Service] Erro ao enviar e-mail de orçamento:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a test email to verify credentials.
 */
export async function sendTestEmail(targetEmail?: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const transporter = createTransporter();
  const recipient = targetEmail || process.env.EMAIL_TO || 'contato@pasilux.com.br';
  const from = process.env.EMAIL_FROM || `"Pasilux Perfis LED" <${process.env.SMTP_USER || 'contato@pasilux.com.br'}>`;

  if (!transporter) {
    return {
      success: false,
      error: 'Variáveis de ambiente SMTP_HOST, SMTP_USER e SMTP_PASS não estão configuradas.',
    };
  }

  try {
    // Verify connection first
    await transporter.verify();

    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject: '✅ [Teste Pasilux] Configuração de E-mail Validada com Sucesso!',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #fafafa; color: #18181b; border-radius: 12px; border: 1px solid #e4e4e7; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #09090b; margin-top: 0; border-bottom: 2px solid #fae013; padding-bottom: 8px;">Pasilux Iluminação</h2>
          <p style="font-size: 15px; color: #16a34a; font-weight: bold;">✔ O serviço de envio de e-mails está operando corretamente!</p>
          <p style="font-size: 13px; color: #52525b; line-height: 1.5;">
            Todas as mensagens enviadas pelos formulários de <strong>Contato</strong> e solicitações de <strong>Orçamento Sob Medida</strong> serão entregues diretamente nesta caixa postal.
          </p>
          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;">
          <p style="font-size: 11px; color: #a1a1aa; margin: 0;">Servidor SMTP: ${process.env.SMTP_HOST} | Porta: ${process.env.SMTP_PORT || '587'}</p>
        </div>
      `,
      text: 'O serviço de e-mails da Pasilux está configurado e funcionando corretamente!',
    });

    return {
      success: true,
      message: `E-mail de teste enviado com sucesso para ${recipient} (ID: ${info.messageId}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Falha ao testar conexão SMTP: ${err.message}`,
    };
  }
}
