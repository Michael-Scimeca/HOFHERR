/*
 * Email template for catering package booking requests.
 * Generates both plain‑text and HTML versions that match the layout we
 * previously used for the mailto body.
 */

export const BRAND = {
  font: 'Arial, Helvetica, sans-serif',
  primary: '#333',
  accent: '#ccc',
};

export interface PackageInfo {
  name: string;
  price: string;
  servings?: string;
  description?: string;
  items?: string[];
}

export const getMailtoLink = (pkg: any) => {
  const subject = encodeURIComponent(`Package Inquiry: ${pkg.name}`);
  const body = generateEmailBody(pkg);
  return `mailto:catering@hofherrmeatco.com?subject=${subject}&body=${body}`;
};

/**
 * Generate the subject line for the booking email.
 */
export const generateSubject = (pkg: PackageInfo): string => {
  return `Package Inquiry: ${pkg.name}`;
};

/**
 * Generate the plain‑text body for the booking email.
 *
 */
export const generatePlainText = (pkg: PackageInfo): string => {
  const itemsList = pkg.items?.map((i) => `- ${i}`).join('\n') || 'None';
  return `---\nPackage: ${pkg.name}\nPrice: ${pkg.price}\nServings: ${pkg.servings ?? 'N/A'}\nDescription: ${pkg.description ?? 'N/A'}\n\nItems:\n${itemsList}\n\n---\nPlease provide the following details:\nName: [Enter name]\nEmail: [Enter email]\nPhone: [Enter phone]\nAddress: [Enter address]\nDate & Time of Event: [Enter date & time]`;
};

export const generateEmailBody = (pkg: any) => {
  const itemsList = pkg.items?.map((item: string) => `- ${item}`).join('\n') || 'None';
  const body = `---\nPackage: ${pkg.name}\nPrice: ${pkg.price}\nServings: ${pkg.servings || 'N/A'}\nDescription: ${pkg.description || 'N/A'}\n\nItems:\n${itemsList}\n\n---\nPlease provide the following details:\nName: [Enter name]\nEmail: [Enter email]\nPhone: [Enter phone]\nAddress: [Enter address]\nDate & Time of Event: [Enter date & time]`;
  return encodeURIComponent(body);
};

/**
 * Generate the HTML body for the booking email.
 * Uses simple styling – bold labels and a list for items
 */
export const generateHtml = (pkg: PackageInfo): string => {
  const itemsList = pkg.items?.map(i => `<li>${i}</li>`).join('') || '<li>None</li>';

  const header = `
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" class="header">
          <img src="/assets/logo.svg" alt="Hofherr Meat Co." style="max-height:60px;" />
        </td>
      </tr>
      <tr>
        <td align="center">
          <img src="/email-assets/email-template-banner.jpg" alt="Catering Banner" style="width:100%; max-height:200px; object-fit:cover;" />
        </td>
      </tr>
    </table>`;

  const body = `
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#111;border-radius:8px;overflow:hidden;">
            <tr>
              <td class="content" style="padding:20px;color:#F2F2F2;font-family:'Inter',sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="label" style="font-family:'Yanone Kaffeesatz',sans-serif;font-weight:bold;color:#CC0E1D;">Package:</td>
                    <td>${pkg.name}</td>
                  </tr>
                  <tr>
                    <td class="label" style="font-family:'Yanone Kaffeesatz',sans-serif;font-weight:bold;color:#CC0E1D;">Price:</td>
                    <td>${pkg.price}</td>
                  </tr>
                  <tr>
                    <td class="label" style="font-family:'Yanone Kaffeesatz',sans-serif;font-weight:bold;color:#CC0E1D;">Servings:</td>
                    <td>${pkg.servings ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td class="label" style="font-family:'Yanone Kaffeesatz',sans-serif;font-weight:bold;color:#CC0E1D;">Description:</td>
                    <td>${pkg.description ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td class="label" style="font-family:'Yanone Kaffeesatz',sans-serif;font-weight:bold;color:#CC0E1D;vertical-align:top;">Items:</td>
                    <td><ul style="margin:0;padding-left:20px;">${itemsList}</ul></td>
                  </tr>
                </table>
                <hr class="separator" style="border:none;border-top:1px solid #A8905F;margin:20px 0;" />
                <div class="section" style="margin-top:10px;font-family:'Yanone Kaffeesatz',sans-serif;font-weight:bold;color:#CC0E1D;">Please provide the following details:</div>
                <div class="placeholder" style="background:#fff;border:1px dashed #555;color:#000;padding:6px 8px;font-style:italic;border-radius:4px;">Name: [Enter name]</div>
                <div class="placeholder" style="background:#fff;border:1px dashed #555;color:#000;padding:6px 8px;font-style:italic;border-radius:4px;">Email: [Enter email]</div>
                <div class="placeholder" style="background:#fff;border:1px dashed #555;color:#000;padding:6px 8px;font-style:italic;border-radius:4px;">Phone: [Enter phone]</div>
                <div class="placeholder" style="background:#fff;border:1px dashed #555;color:#000;padding:6px 8px;font-style:italic;border-radius:4px;">Address: [Enter address]</div>
                <div class="placeholder" style="background:#fff;border:1px dashed #555;color:#000;padding:6px 8px;font-style:italic;border-radius:4px;">Date &amp; Time of Event: [Enter date &amp; time]</div>
                <a href="mailto:catering@hofherrmeatco.com" class="cta" style="background:#CC0E1D;color:#fff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:4px;display:inline-block;margin-top:15px;">Reply to this email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  const footer = `
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="footer" style="background:#383838;color:#fff;text-align:center;padding:12px;font-size:0.9em;">
          Hofherr Meat Co. • 123 Main St, Northfield, IL • (847) 441‑MEAT
        </td>
      </tr>
    </table>`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${pkg.name} – Catering Inquiry</title>
  <style>
    .wrapper { width: 100%; }
    body { background: #f3f3f3 !important; margin:0; padding:0; }
    .container { background:#fefefe; width:580px; margin:0 auto; }
    .header img { max-height:60px; }
    .cta a { background:#CC0E1D;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none; }
    .placeholder { background:#fff;border:1px dashed #555;padding:6px 8px;margin-top:4px; }
  </style>
</head>
<body>
  ${header}
  ${body}
  ${footer}
</body>
</html>`;
};

/**
 * Convenience wrapper that returns an object suitable for most email libraries.
 */
export const buildEmail = (pkg: PackageInfo) => {
  return {
    subject: generateSubject(pkg),
    text: generatePlainText(pkg),
    html: generateHtml(pkg),
  };
};
