import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateProfileSettings, updatePassword } from '@/app/actions/settings'
import { User, Phone, Lock, Mail } from 'lucide-react'

export const metadata = {
  title: 'Account Settings | Malshan Rent A Car',
}

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  const [firstName, ...lastNameParts] = (profile.full_name || '').split(' ')
  const lastName = lastNameParts.join(' ')

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="text-brand" /> Personal Details
          </h2>
          
          <form action={updateProfileSettings} className="space-y-5">
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Email Address (Cannot be changed)</Label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  disabled
                  value={user.email}
                  className="pl-9 bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative mt-1">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={firstName}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative mt-1">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={lastName}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile.phone || ''}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Security Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="text-brand" /> Security
          </h2>
          
          <form action={updatePassword} className="space-y-5">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Min 8 characters"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="outline" className="w-full border-brand text-brand hover:bg-brand hover:text-white">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
