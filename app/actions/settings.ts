'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileSettings(formData: FormData): Promise<void> {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  
  if (!firstName || !lastName || !phone) {
    console.error('Please fill out all fields.')
    return
  }

  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    console.error('Unauthorized')
    return
  }

  const fullName = `${firstName} ${lastName}`.trim()

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone,
    })
    .eq('id', userData.user.id)

  if (error) {
    console.error(error.message)
    return
  }

  revalidatePath('/dashboard/settings')
}

export async function updatePassword(formData: FormData): Promise<void> {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!newPassword || newPassword.length < 8) {
    console.error('Password must be at least 8 characters long.')
    return
  }
  if (newPassword !== confirmPassword) {
    console.error('Passwords do not match.')
    return
  }

  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error(error.message)
    return
  }
}
