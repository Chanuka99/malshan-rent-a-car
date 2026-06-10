export const metadata = {
  title: 'Terms & Conditions — Malshan Rent A Car',
  description: 'Read our terms and conditions for car rental services.',
}

export default function TermsPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[40vh] flex items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Terms & <span className="text-brand">Conditions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before renting a vehicle from Malshan Rent A Car.
          </p>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2>1. Rental Agreement</h2>
            <p>
              By renting a vehicle from Malshan Rent A Car, you agree to comply with all terms and conditions outlined in this agreement. The rental agreement is a binding contract between you and Malshan Rent A Car.
            </p>

            <h2>2. Age and License Requirements</h2>
            <p>
              The renter must be at least 18 years old and possess a valid driving license. International customers must provide an International Driving Permit (IDP). A valid form of identification is required for all rentals.
            </p>

            <h2>3. Required Documents</h2>
            <ul>
              <li>Valid driving license</li>
              <li>National ID or passport</li>
              <li>Billing proof (electricity or water bill)</li>
              <li>Guarantor with valid ID</li>
            </ul>

            <h2>4. Rental Fees and Payment</h2>
            <p>
              All rental fees are payable at the time of booking or as agreed. Malshan Rent A Car accepts cash, card payments, and bank transfers. All prices are final unless otherwise agreed in writing.
            </p>

            <h2>5. Mileage Allowance</h2>
            <p>
              The rental package includes 3,000 km mileage per month. Any additional kilometers beyond this limit will be charged at the agreed rate per kilometer.
            </p>

            <h2>6. Vehicle Condition</h2>
            <p>
              The renter must inspect the vehicle upon collection and report any existing damage immediately. The vehicle must be returned in the same condition as received. Excess wear and tear will be charged to the renter.
            </p>

            <h2>7. Fuel Policy</h2>
            <p>
              Vehicles are provided with a full tank of fuel. The vehicle must be returned with a full tank. Refueling at pickup location is mandatory. A fuel surcharge will apply if the vehicle is returned with less fuel.
            </p>

            <h2>8. Cancellation Policy</h2>
            <p>
              Free cancellation is available up to 24 hours before the scheduled pickup date. Cancellations within 24 hours may incur a cancellation fee. No refunds are provided for no-shows.
            </p>

            <h2>9. Insurance and Liability</h2>
            <p>
              All rental vehicles include comprehensive insurance coverage. However, the renter is responsible for any damages caused by negligence, violation of traffic rules, or misuse of the vehicle. A security deposit is required and will be held for 7 days to assess any damage claims.
            </p>

            <h2>10. Restrictions</h2>
            <p>
              The renter agrees not to:
            </p>
            <ul>
              <li>Smoke in the vehicle</li>
              <li>Transport illegal items or hazardous materials</li>
              <li>Use the vehicle for commercial purposes (taxi, delivery, etc.) without prior consent</li>
              <li>Allow unauthorized drivers to operate the vehicle</li>
              <li>Drive under the influence of alcohol or drugs</li>
              <li>Exceed speed limits or violate traffic regulations</li>
            </ul>

            <h2>11. Traffic Violations and Accidents</h2>
            <p>
              The renter is responsible for all traffic fines, parking tickets, and toll charges incurred during the rental period. In case of an accident, the renter must immediately notify Malshan Rent A Car and provide a police report.
            </p>

            <h2>12. Late Return</h2>
            <p>
              Vehicles must be returned by the agreed date and time. Late returns will be charged at the daily rate or partial daily rate, depending on the duration of the delay.
            </p>

            <h2>13. Roadside Assistance</h2>
            <p>
              Malshan Rent A Car provides 24/7 roadside assistance including towing, fuel delivery, and battery assistance. In case of breakdown, contact the provided hotline immediately.
            </p>

            <h2>14. Limitation of Liability</h2>
            <p>
              Malshan Rent A Car shall not be liable for any indirect, incidental, or consequential damages. Our liability is limited to the rental fee paid.
            </p>

            <h2>15. Modifications to Terms</h2>
            <p>
              Malshan Rent A Car reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon publication.
            </p>

            <h2>16. Governing Law</h2>
            <p>
              These terms and conditions are governed by the laws of Sri Lanka. Any disputes will be resolved through mutual discussion or legal proceedings.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              For questions about these terms, please contact us at:
            </p>
            <ul>
              <li>Phone: 076 209 8120</li>
              <li>Email: hello@malshanrentacar.lk</li>
              <li>Address: 135/2, Arawwala Road, Pannipitiya, Colombo</li>
            </ul>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: June 2024
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
