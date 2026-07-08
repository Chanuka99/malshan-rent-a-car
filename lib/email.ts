import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingEmailData {
  to: string
  bookingId: string
  carName: string
  pickupDate: string
  dropoffDate: string
  totalDays: number
  totalPrice: number
  driverName: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const {
    to,
    bookingId,
    carName,
    pickupDate,
    dropoffDate,
    totalDays,
    totalPrice,
    driverName,
  } = data

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation — Malshan Rent A Car</title>
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#5632C9;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Malshan Rent A Car</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Car Rental Colombo</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111;font-size:22px;">Booking Confirmed! 🎉</h2>
              <p style="margin:0 0 32px;color:#555;font-size:16px;">Hi ${driverName}, your car rental booking has been received successfully.</p>

              <!-- Booking Reference -->
              <div style="background:#f1edfb;border-left:4px solid #5632C9;padding:16px 20px;border-radius:4px;margin-bottom:32px;">
                <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#5632C9;font-family:monospace;">${bookingId.toUpperCase().slice(0, 8)}</p>
              </div>

              <!-- Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                <tr style="background:#f9fafb;">
                  <td style="padding:12px 16px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">Detail</td>
                  <td style="padding:12px 16px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">Value</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;">Vehicle</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${carName}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;">Pick-up Date</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${new Date(pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;">Drop-off Date</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${new Date(dropoffDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;">Duration</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111;font-weight:600;border-bottom:1px solid #f0f0f0;">${totalDays} day${totalDays > 1 ? 's' : ''}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#555;">Total Amount</td>
                  <td style="padding:14px 16px;font-size:16px;color:#5632C9;font-weight:700;">LKR ${totalPrice.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Payment Notice -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:32px;">
                <h3 style="margin:0 0 8px;color:#166534;font-size:16px;">💳 Pay on Arrival</h3>
                <p style="margin:0;color:#15803d;font-size:14px;line-height:1.6;">No payment is required now. Simply bring this reference and a valid ID when you collect your vehicle. Payment is collected at the time of pick-up.</p>
              </div>

              <!-- Contact -->
              <p style="color:#555;font-size:14px;line-height:1.6;">Questions? Contact us at <a href="mailto:hello@malshanrentacar.lk" style="color:#5632C9;text-decoration:none;">hello@malshanrentacar.lk</a> or call <strong>+94 11 234 5678</strong>.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#999;text-align:center;">© ${new Date().getFullYear()} Malshan Rent A Car. All rights reserved. | Colombo, Sri Lanka</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const { data: emailData, error } = await resend.emails.send({
    from: 'Malshan Rent A Car <hello@malshanrentacar.lk>',
    to: [to],
    subject: `Booking Confirmed — ${carName} | Ref: ${bookingId.toUpperCase().slice(0, 8)}`,
    html: htmlContent,
  })

  if (error) {
    console.error('Failed to send booking email:', error)
    throw new Error('Failed to send confirmation email')
  }

  return emailData
}
