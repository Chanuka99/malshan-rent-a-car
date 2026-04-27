'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginSchema, RegisterSchema } from '@/lib/validations'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(`/auth/verify?email=${encodeURIComponent(email)}`)
}

export async function registerAction(formData: FormData) {
  const raw = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: `${parsed.data.firstName} ${parsed.data.lastName}`.trim(),
        phone: parsed.data.phone,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  // Supabase returns success but empty identities if the user already exists
  // when "Prevent Email Enumeration" is turned on in settings.
  if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
    return { error: 'An account with this email already exists. Please sign in instead.' }
  }

  // Redirect to OTP verify page with email as query param
  redirect(`/auth/verify?email=${encodeURIComponent(parsed.data.email)}`)
}

export async function verifyOtpAction(formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  if (!email || !token || token.length !== 8) {
    return { error: 'Please enter the 8-digit code from your email.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: 'Invalid or expired code. Please try again.' }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
